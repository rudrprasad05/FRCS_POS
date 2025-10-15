import { Checkout } from "@/actions/PosSession";
import { GetAllProducts } from "@/actions/Product";
import { SaleStatus } from "@/types/enum";
import {
  ApiResponse,
  ESortBy,
  PosSession,
  PosSessionWithProducts,
  ProductVariant,
  QueryObject,
  SaleItem,
  SaleItemOmitted,
} from "@/types/models";
import { NewCheckoutRequest } from "@/types/res";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import hash from "object-hash";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface PosSessionContextType {
  session: PosSession;
  products: (ProductVariant | undefined)[];
  qr: string | undefined;
  cart: SaleItemOmitted[];
  pagination: QueryObject;

  moneyValues: IMoneyValue;
  isScannerConnectedToServer: boolean;
  isTerminalConnectedToServer: boolean;

  isSaving: boolean;
  isProductsLoading: boolean;
  hasChanged: boolean;

  setQr: (data: string) => void;
  setInitialState: (data: PosSessionWithProducts) => void;

  addProduct: (product: SaleItemOmitted) => void;
  removeProduct: (productVariantId: string) => void;
  deleteProduct: (productVariantId: string) => void;
  loadMore: () => void;

  checkout: () => Promise<void>;

  setIsTerminalConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsScannerConnectedToServer: React.Dispatch<React.SetStateAction<boolean>>;
  setPagination: React.Dispatch<React.SetStateAction<QueryObject>>;

  //   setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const PosSessionContext = createContext<PosSessionContextType>({
  session: {} as PosSession,
  products: {} as ProductVariant[],
  qr: undefined,
  cart: [],
  pagination: {} as QueryObject,

  moneyValues: {} as IMoneyValue,

  isTerminalConnectedToServer: false,
  isScannerConnectedToServer: false,

  isSaving: false,
  hasChanged: false,
  isProductsLoading: false,

  setInitialState: () => {},
  setQr: () => {},
  loadMore: () => {},
  deleteProduct: () => {},
  addProduct: () => {},
  removeProduct: () => {},
  setPagination: () => {},
  checkout: async () => {},

  setIsTerminalConnectedToServer: () => {},
  setIsScannerConnectedToServer: () => {},
  //   setProducts: () => {},
});

interface IMoneyValue {
  subtotal: number;
  taxTotal: number;
  total: number;
}

export const PosSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<PosSession>({} as PosSession);
  const [qr, setQr] = useState<string | undefined>();
  const router = useRouter();

  const [moneyValues, setMoneyValues] = useState<IMoneyValue>({
    subtotal: 0,
    taxTotal: 0,
    total: 0,
  });

  const [cart, setCart] = useState<SaleItemOmitted[]>([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const initialHashRef = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTerminalConnectedToServer, setIsTerminalConnectedToServer] =
    useState(false);
  const [isScannerConnectedToServer, setIsScannerConnectedToServer] =
    useState(false);
  const params = useParams();
  const companyName = String(params.companyName);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 20,
    search: "",
    sortBy: ESortBy.DSC,
    companyName: companyName,
    isDeleted: undefined as boolean | undefined,
  });

  const infiniteQuery = useInfiniteQuery<ApiResponse<ProductVariant[]>, Error>({
    queryKey: ["posSessionProducts", session.id, pagination],
    queryFn: async ({ pageParam = 1 }) => {
      return GetAllProducts(
        {
          ...pagination,
          pageNumber: pageParam as number,
        },
        true
      );
    },
    getNextPageParam: (lastPage) =>
      (lastPage.meta?.pageNumber as number) <
      (lastPage.meta?.totalPages as number)
        ? (lastPage?.meta?.pageNumber as number) + 1
        : undefined,
    initialPageParam: 1, // ← important for TypeScript
    enabled: !!session.id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setIsProductsLoading(infiniteQuery.isLoading);
  }, [infiniteQuery.isLoading]);

  const products = useMemo(
    () => infiniteQuery.data?.pages.flatMap((p) => p.data) ?? [],
    [infiniteQuery.data?.pages]
  );

  const loadMore = () => {
    if (infiniteQuery.hasNextPage) infiniteQuery.fetchNextPage();
  };

  // Track changes
  useEffect(() => {
    const currentHash = hash({ ...cart, products });
    if (!initialHashRef.current) {
      initialHashRef.current = currentHash;
    }
    setHasChanged(currentHash !== initialHashRef.current);
  }, [cart, products, session]);

  const setInitialState = useCallback(
    (init: PosSessionWithProducts) => {
      setSession(init.posSession);
      initialHashRef.current = hash({ ...init, products });
    },
    [products]
  );

  useEffect(() => {
    let subtotal = 0,
      taxTotal = 0,
      total = 0;
    for (const item of cart) {
      const unitTotal = item.unitPrice * item.quantity;
      subtotal += unitTotal;
      taxTotal +=
        (unitTotal * (item.productVariant.taxCategory?.ratePercent as number)) /
        100;
    }

    total += taxTotal + subtotal;
    setMoneyValues({ subtotal, taxTotal, total });
  }, [cart]);

  function addProduct(saleItem: SaleItemOmitted) {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.productVariantId === saleItem.productVariantId
      );
      if (existing) {
        return prev.map((p) => {
          const newQuant = p.quantity + 1;
          const newP = {
            ...p,
            quantity: newQuant,
            lineTotal: newQuant * p.unitPrice,
          };
          return p.productVariantId === saleItem.productVariantId
            ? { ...newP }
            : p;
        });
      }
      console.log("fjfjfjf", saleItem);
      return [
        ...prev,
        {
          ...saleItem,
          quantity: 1,
          taxRatePercent: Number(
            saleItem.productVariant.taxCategory?.ratePercent
          ),
        },
      ];
    });
  }

  function removeProduct(productUUID: string) {
    setCart((prev) => {
      const existing = prev.find((p) => p.productVariant.uuid === productUUID);
      if (!existing) return prev; // product not found

      if (existing.quantity > 1) {
        return prev.map((p) =>
          p.productVariant.uuid === productUUID
            ? { ...p, quantity: p.quantity - 1 }
            : p
        );
      }

      // If quantity is 1, remove product entirely
      return prev.filter((p) => p.productVariant.uuid !== productUUID);
    });
  }

  function deleteProduct(productUUID: string) {
    setCart((prev) =>
      prev.filter((p) => p.productVariant.uuid !== productUUID)
    );
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
      const unitTotal = item.unitPrice * item.quantity;
      subtotal += unitTotal;
      taxTotal +=
        (unitTotal * (item.productVariant.taxCategory?.ratePercent as number)) /
        100;
    }

    total += taxTotal + subtotal;

    if (
      moneyValues.taxTotal != taxTotal ||
      moneyValues.subtotal != subtotal ||
      moneyValues.total != total
    ) {
      toast.error("Checkout failed!", { description: "values dont match" });
      return;
    }

    const checkoutDataToSend: NewCheckoutRequest = {
      companyName: companyName,
      posSessionId: session.id,
      cashierId: session.posUserId,
      subtotal: subtotal,
      taxTotal: taxTotal,
      total: total,
      status: SaleStatus.Pending, // use enum with uppercase to match definition
      items: cart as SaleItem[],
    };

    console.log(checkoutDataToSend);
    // return;
    setIsSaving(true);
    const res = await Checkout(checkoutDataToSend);

    if (res.success && res.data) {
      toast.success("Checkout successful!");
      router.push(`${session.uuid}/checkout/${res.data?.uuid}`);
    } else {
      console.log(res);
      toast.error("Checkout failed!", { description: res.message });
    }

    setCart([]);
    queryClient.invalidateQueries({
      queryKey: [
        "posSessionProducts",
        session.id,
        { ...pagination, search: undefined },
      ],
      exact: false,
    });
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
        pagination,
        cart,
        moneyValues,
        isTerminalConnectedToServer,
        isScannerConnectedToServer,
        isSaving,
        isProductsLoading,
        hasChanged,
        setInitialState,
        loadMore,
        setQr,
        deleteProduct,
        addProduct,
        removeProduct,
        checkout,
        setIsTerminalConnectedToServer,
        setIsScannerConnectedToServer,
        setPagination,
      }}
    >
      {children}
    </PosSessionContext.Provider>
  );
};

// Hook to use POS session
export const usePosSession = () => useContext(PosSessionContext);
