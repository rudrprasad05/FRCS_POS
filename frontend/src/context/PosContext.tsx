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
  Product,
  SaleItem,
  SaleItemOmitted,
} from "@/types/models";
import { NewCheckoutRequest } from "@/types/res";
import { SaleStatus } from "@/types/enum";
import { Checkout } from "@/actions/PosSession";
import { init } from "next/dist/compiled/webpack/webpack";

interface PosSessionContextType {
  session: PosSession;
  products: Product[];
  qr: string | undefined;
  cart: SaleItemOmitted[];

  moneyValues: IMoneyValue;
  isScannerConnectedToServer: boolean;
  isTerminalConnectedToServer: boolean;

  isSaving: boolean;
  hasChanged: boolean;

  setQr: (data: string) => void;
  setInitialState: (data: PosSessionWithProducts) => void;

  addProduct: (product: SaleItemOmitted) => void;
  removeProduct: (productId: string) => void;
  deleteProduct: (productId: string) => void;

  checkout: () => Promise<void>;

  setIsTerminalConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsScannerConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const PosSessionContext = createContext<PosSessionContextType>({
  session: {} as PosSession,
  products: {} as Product[],
  qr: undefined,
  cart: [],

  moneyValues: {} as IMoneyValue,

  isTerminalConnectedToServer: false,
  isScannerConnectedToServer: false,

  isSaving: false,
  hasChanged: false,

  setInitialState: () => {},
  setQr: () => {},

  deleteProduct: () => {},
  addProduct: () => {},
  removeProduct: () => {},

  checkout: async () => {},

  setIsTerminalConnectedToServer: () => {},
  setIsScannerConnectedToServer: () => {},
  setProducts: () => {},
});

interface IMoneyValue {
  subtotal: number;
  taxTotal: number;
  total: number;
}

export const PosSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<PosSession>({} as PosSession);

  const [products, setProducts] = useState<Product[]>([]);
  const [qr, setQr] = useState<string | undefined>();
  const router = useRouter();

  const [moneyValues, setMoneyValues] = useState<IMoneyValue>({
    subtotal: 0,
    taxTotal: 0,
    total: 0,
  });

  const [cart, setCart] = useState<SaleItemOmitted[]>([]);
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
    console.log(cart, products, session);
    const currentHash = hash({ ...cart, products });
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [cart, products, session]);

  function setInitialState(init: PosSessionWithProducts) {
    console.log(init);
    setProducts(init.products); // TODO bug?
    setSession(init.posSession);
    initialHashRef.current = hash({ ...init, products });
  }

  useEffect(() => {
    let subtotal = 0,
      taxTotal = 0,
      total = 0;
    for (const [index, item] of cart.entries()) {
      let unitTotal = item.unitPrice * item.quantity;
      subtotal += unitTotal;
      taxTotal +=
        (unitTotal * (item.product.taxCategory?.ratePercent as number)) / 100;
    }

    total += taxTotal + subtotal;
    setMoneyValues({ subtotal, taxTotal, total });
    console.log("mv", subtotal, taxTotal, total);
  }, [cart]);

  function addProduct(product: SaleItemOmitted) {
    setCart((prev) => {
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
    setCart((prev) => {
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
    setCart((prev) => prev.filter((p) => p.product.uuid !== productUUID));
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
    for (const [index, item] of cart.entries()) {
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
      console.log(moneyValues.taxTotal, taxTotal);
      console.log(moneyValues.subtotal, subtotal);
      console.log(moneyValues.total, total);
      console.log("values dont match");
      toast.error("Checkout failed!");
      return;
    }

    let checkoutDataToSend: NewCheckoutRequest = {
      companyName: companyName,
      posSessionId: session.id,
      cashierId: session.posUserId,
      subtotal: subtotal,
      taxTotal: taxTotal,
      total: total,
      status: SaleStatus.Pending, // use enum with uppercase to match definition
      items: cart as SaleItem[],
    };

    console.log("data to send", checkoutDataToSend);

    setIsSaving(true);
    const res = await Checkout(checkoutDataToSend);

    console.log(res);
    console.log("Checking out", { session: session, products });

    if (res.success && res.data) {
      toast.success("Checkout successful!");
      router.push(`${session.uuid}/checkout/${res.data.uuid}`);
    } else {
      console.log(res.errors);
      toast.error("Checkout failed!");
    }

    setCart([]);
    initialHashRef.current = hash({ ...cart, products: [] });
    setHasChanged(false);

    setIsSaving(false);
  }

  return (
    <PosSessionContext.Provider
      value={{
        session,
        products,
        qr,
        cart,
        moneyValues,
        isTerminalConnectedToServer,
        isScannerConnectedToServer,
        isSaving,
        hasChanged,
        setInitialState,
        setQr,
        deleteProduct,
        addProduct,
        removeProduct,
        checkout,
        setIsTerminalConnectedToServer,
        setIsScannerConnectedToServer,
        setProducts,
      }}
    >
      {children}
    </PosSessionContext.Provider>
  );
};

// Hook to use POS session
export const usePosSession = () => useContext(PosSessionContext);
