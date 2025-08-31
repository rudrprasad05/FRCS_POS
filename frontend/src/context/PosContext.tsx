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
import { useParams, useRouter } from "next/navigation";
import {
  PosSession,
  PosSessionWithProducts,
  SaleItem,
  SaleItemOmitted,
} from "@/types/models";
import { NewCheckoutRequest } from "@/types/res";
import { SaleStatus } from "@/types/enum";
import { Checkout } from "@/actions/PosSession";

interface PosSessionContextType {
  data: PosSessionWithProducts;
  qr: string | undefined;
  products: SaleItemOmitted[];
  setQr: (data: string) => void;
  setInitialState: (data: PosSessionWithProducts) => void;
  updateValues: <K extends keyof PosSession>(
    key: K,
    value: PosSession[K]
  ) => void;
  addProduct: (product: SaleItemOmitted) => void;
  removeProduct: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  moneyValues: IMoneyValue;
  checkout: () => Promise<void>;
  save: () => void;
  isSaving: boolean;
  hasChanged: boolean;
  isTerminalConnectedToServer: boolean;
  setHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTerminalConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
  isScannerConnectedToServer: boolean;
  setIsScannerConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
}

const PosSessionContext = createContext<PosSessionContextType>({
  data: {} as PosSessionWithProducts,
  qr: undefined,
  products: [],
  isSaving: false,
  setInitialState: () => {},
  setQr: () => {},
  updateValues: () => {},
  deleteProduct: () => {},
  addProduct: () => {},
  removeProduct: () => {},
  checkout: async () => {},
  save: () => {},
  moneyValues: {} as IMoneyValue,
  isTerminalConnectedToServer: false,
  setIsTerminalConnectedToServer: () => {},
  isScannerConnectedToServer: false,
  setIsScannerConnectedToServer: () => {},
  hasChanged: false,
  setHasChanged: () => {},
});

interface IMoneyValue {
  subtotal: number;
  taxTotal: number;
  total: number;
}

export const PosSessionProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PosSessionWithProducts>(
    {} as PosSessionWithProducts
  );
  const [qr, setQr] = useState<string | undefined>();
  const router = useRouter();

  const [moneyValues, setMoneyValues] = useState<IMoneyValue>({
    subtotal: 0,
    taxTotal: 0,
    total: 0,
  });

  const [products, setProducts] = useState<SaleItemOmitted[]>([]);
  const [hasChanged, setHasChanged] = useState(false);
  const initialHashRef = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTerminalConnectedToServer, setIsTerminalConnectedToServer] =
    useState(false);
  const [isScannerConnectedToServer, setIsScannerConnectedToServer] =
    useState(false);
  const params = useParams();
  const companyName = String(params.companyName);

  // Track changes
  useEffect(() => {
    const currentHash = hash({ ...data, products });
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [data, products]);

  function setInitialState(inti: PosSessionWithProducts) {
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

  useEffect(() => {
    let subtotal = 0,
      taxTotal = 0,
      total = 0;
    for (const [index, item] of products.entries()) {
      let unitTotal = item.unitPrice * item.quantity;
      subtotal += unitTotal;
      taxTotal +=
        (unitTotal * (item.product.taxCategory?.ratePercent as number)) / 100;
    }

    total += taxTotal + subtotal;
    setMoneyValues({ subtotal, taxTotal, total });
    console.log(products);
  }, [products]);

  function addProduct(product: SaleItemOmitted) {
    setProducts((prev) => {
      const existing = prev.find((p) => p.productId === product.productId);
      if (existing) {
        return prev.map((p) => {
          let newQuant = p.quantity + 1;
          let newP = {
            ...p,
            quantity: newQuant,
            lineTotal: newQuant * p.unitPrice,
          };
          return p.productId === product.productId ? { ...newP } : p;
        });
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          taxRatePercent: Number(product.product.taxCategory?.ratePercent),
        },
      ];
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

  function deleteProduct(productUUID: string) {
    setProducts((prev) => prev.filter((p) => p.product.uuid !== productUUID));
  }

  async function checkout() {
    setIsSaving(true);
    if (products.length === 0) {
      toast.error("No products to checkout");
      return;
    }

    let subtotal = 0,
      taxTotal = 0,
      total = 0;
    for (const [index, item] of products.entries()) {
      let unitTotal = item.unitPrice * item.quantity;
      subtotal += unitTotal;
      taxTotal +=
        (unitTotal * (item.product.taxCategory?.ratePercent as number)) / 100;
      console.log(index, subtotal, taxTotal);
    }

    total += taxTotal + subtotal;
    console.log(products);

    if (
      moneyValues.taxTotal != taxTotal ||
      moneyValues.subtotal != subtotal ||
      moneyValues.total != total
    ) {
      console.log("values dont match");
      toast.error("Checkout failed!");
      return;
    }

    let checkoutDataToSend: NewCheckoutRequest = {
      companyName: companyName,
      posSessionId: data.id,
      cashierId: data.posUserId,
      subtotal: subtotal,
      taxTotal: taxTotal,
      total: total,
      status: SaleStatus.Pending, // use enum with uppercase to match definition
      items: products as SaleItem[],
    };

    console.log("data to send", checkoutDataToSend);

    setIsSaving(true);
    const res = await Checkout(checkoutDataToSend);

    console.log(res);
    console.log("Checking out", { session: data, products });

    if (res.success && res.data) {
      toast.success("Checkout successful!");
      router.push(`${data.uuid}/checkout/${res.data.uuid}`);
    } else {
      console.log(res.errors);
      toast.error("Checkout failed!");
    }

    setProducts([]);
    initialHashRef.current = hash({ ...data, products: [] });
    setHasChanged(false);

    setIsSaving(false);
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
        moneyValues,
        products,
        setQr,
        isSaving,
        setInitialState,
        deleteProduct,
        updateValues,
        addProduct,
        removeProduct,
        checkout,
        save,
        hasChanged,
        setHasChanged,
        setIsTerminalConnectedToServer,
        isTerminalConnectedToServer,
        setIsScannerConnectedToServer,
        isScannerConnectedToServer,
      }}
    >
      {children}
    </PosSessionContext.Provider>
  );
};

// Hook to use POS session
export const usePosSession = () => useContext(PosSessionContext);
