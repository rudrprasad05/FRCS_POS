"use client";

import { GetPosSession } from "@/actions/PosSession";
import { GetOneProductByBarcode } from "@/actions/Product";
import { Button } from "@/components/ui/button";
import { usePosSession } from "@/context/PosContext";
import { useSignalR } from "@/context/SignalRContext";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PosTerminal from "./PosTerminal";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const { connection, status } = useSignalR();
  const {
    setInitialState,
    setIsTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    products,
    setCart,
  } = usePosSession();

  const [initialLoad, setInitialLoad] = useState(true);
  const productsRef = useRef<ProductVariant[]>([]);
  const router = useRouter();

  // Sync products
  useEffect(() => {
    productsRef.current = products as ProductVariant[];
  }, [products]);

  // Initial data
  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);
      if (cake.data) setInitialState(cake.data);
    };
    getData();
  }, [setInitialState, uuid]);

  const addProduct = useCallback(
    (saleItem: SaleItemOmitted) => {
      setCart((prev) => {
        const existing = prev.find(
          (p) => p.productVariantId === saleItem.productVariantId
        );
        if (existing) {
          return prev.map((p) =>
            p.productVariantId === saleItem.productVariantId
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                  lineTotal: (p.quantity + 1) * p.unitPrice,
                }
              : p
          );
        }
        return [
          ...prev,
          {
            ...saleItem,
            quantity: 1,
            taxRatePercent: Number(
              saleItem.productVariant.taxCategory?.ratePercent ?? 0
            ),
          },
        ];
      });
    },
    [setCart]
  );

  // Setup SignalR event handlers ONCE
  useEffect(() => {
    if (!connection) return;

    const handlers = {
      ReceiveScan: async (barcode: string) => {
        console.log("Scanned:", barcode);
        toast.success(`Scanned: ${barcode}`);
        const product = productsRef.current.find((x) => x.barcode === barcode);

        if (!product) {
          const res = await fetchVariantFromDb(barcode);
          if (!res) {
            toast.error(`Product not found: ${barcode}`);
            return;
          } else {
            addProduct({
              productVariantId: res.id,
              productVariant: res,
              quantity: 1,
              unitPrice: res.price,
              taxRatePercent: res.taxCategory?.ratePercent || 0.125,
              lineTotal: res.price,
            });
          }
          return;
        }

        addProduct({
          productVariantId: product.id,
          productVariant: product,
          quantity: 1,
          unitPrice: product.price,
          taxRatePercent: product.taxCategory?.ratePercent || 0.125,
          lineTotal: product.price,
        });
      },
      ScannerConnected: () => {
        setIsScannerConnectedToServer(true);
        toast.success("Scanner connected");
      },
      ScannerDisconnected: () => {
        setIsScannerConnectedToServer(false);
        toast.warning("Scanner disconnected");
      },
      ReceivedJoinTerminal: () => {
        setIsTerminalConnectedToServer(true);
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      connection.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => {
        connection.off(event);
      });
    };
  }, [
    connection,
    addProduct,
    setIsScannerConnectedToServer,
    setIsTerminalConnectedToServer,
  ]);

  const fetchVariantFromDb = async (barcode: string) => {
    const res = await GetOneProductByBarcode({ uuid: barcode });
    if (res.success) {
      return res.data as ProductVariant;
    } else {
      return null;
    }
  };

  // Update connection status
  useEffect(() => {
    setIsTerminalConnectedToServer(status === "connected");
  }, [status, setIsTerminalConnectedToServer]);

  // Initial load UI
  if (initialLoad && status === "connecting") {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col gap-3">
          <span className="mt-2">Connecting to server...</span>
          <Button disabled>Connecting</Button>
        </div>
      </div>
    );
  }

  return <PosTerminal />;
}
