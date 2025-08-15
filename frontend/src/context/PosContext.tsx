import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import hash from "object-hash";
import { toast } from "sonner";
import { PosSession, SaleItem, SaleItemOmitted } from "@/types/models";

interface PosSessionContextType {
  data: Partial<PosSession>;
  qr: string | undefined;
  products: SaleItemOmitted[];
  setQr: (data: string) => void;
  setInitialState: (data: Partial<PosSession>) => void;
  updateValues: <K extends keyof PosSession>(
    key: K,
    value: PosSession[K]
  ) => void;
  addProduct: (product: SaleItemOmitted) => void;
  removeProduct: (productId: string) => void;
  checkout: () => Promise<void>;
  save: () => void;
  isSaving: boolean;
  hasChanged: boolean;
  setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PosSessionContext = createContext<PosSessionContextType>({
  data: {},
  qr: undefined,
  products: [],
  isSaving: false,
  setInitialState: () => {},
  setQr: () => {},
  updateValues: () => {},
  addProduct: () => {},
  removeProduct: () => {},
  checkout: async () => {},
  save: () => {},
  hasChanged: false,
  setHasChanged: () => {},
});

export const PosSessionProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Partial<PosSession>>({});
  const [qr, setQr] = useState<string | undefined>();
  const [products, setProducts] = useState<SaleItemOmitted[]>([]);
  const [hasChanged, setHasChanged] = useState(false);
  const initialHashRef = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Track changes
  useEffect(() => {
    const currentHash = hash({ ...data, products });
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [data, products]);

  function setInitialState(inti: Partial<PosSession>) {
    if (data === inti) return;
    setData(inti);
    initialHashRef.current = hash({ ...inti, products });
  }

  function updateValues<K extends keyof PosSession>(
    key: K,
    value: PosSession[K]
  ) {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addProduct(product: SaleItemOmitted) {
    setProducts((prev) => {
      const existing = prev.find((p) => p.productId === product.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeProduct(productUUID: string) {
    setProducts((prev) => {
      const existing = prev.find((p) => p.product.uuid === productUUID);
      if (!existing) return prev; // product not found

      if (existing.quantity > 1) {
        return prev.map((p) =>
          p.product.uuid === productUUID
            ? { ...p, quantity: p.quantity - 1 }
            : p
        );
      }

      // If quantity is 1, remove product entirely
      return prev.filter((p) => p.product.uuid !== productUUID);
    });
  }

  async function checkout() {
    if (products.length === 0) {
      toast.error("No products to checkout");
      return;
    }

    try {
      setIsSaving(true);

      // TODO: implement API call to save session + sales
      console.log("Checking out", { session: data, products });

      toast.success("Checkout successful!");
      setProducts([]);
      initialHashRef.current = hash({ ...data, products: [] });
      setHasChanged(false);
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function save() {
    setIsSaving(true);
    try {
      initialHashRef.current = hash({ ...data, products });
      setHasChanged(false);
      toast.success("Saved successfully");
    } catch (error) {
      toast.error("Error occurred. Changes not saved");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PosSessionContext.Provider
      value={{
        data,
        qr,
        products,
        setQr,
        isSaving,
        setInitialState,
        updateValues,
        addProduct,
        removeProduct,
        checkout,
        save,
        hasChanged,
        setHasChanged,
      }}
    >
      {children}
    </PosSessionContext.Provider>
  );
};

// Hook to use POS session
export const usePosSession = () => useContext(PosSessionContext);
