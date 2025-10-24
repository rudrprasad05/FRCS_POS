"use client";

import { GetPosSession } from "@/actions/PosSession";
import { Button } from "@/components/ui/button";
import { usePosSession } from "@/context/PosContext";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import * as signalR from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PosTerminal from "./PosTerminal";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "reconnecting"
  >("connecting");

  const {
    setInitialState,
    setIsTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    products,
    setCart,
  } = usePosSession();

  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsRef = useRef<ProductVariant[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const router = useRouter();

  // Keep products ref in sync
  useEffect(() => {
    productsRef.current = products as ProductVariant[];
  }, [products]);

  // Initial data load
  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);
      if (!cake.data) return;
      setInitialState(cake.data);
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

  // Create connection ONCE
  const createConnection = useCallback(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/socket/posHub?terminalId=${uuid}`, {
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .build();

    conn.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      setConnectionStatus("reconnecting");
      setIsTerminalConnectedToServer(false);
    });

    conn.onreconnected(() => {
      console.log("SignalR reconnected");
      setConnectionStatus("connected");
      conn.invoke("JoinTerminal", uuid).catch((err) => {
        console.error("Failed to rejoin terminal group", err);
      });
    });

    conn.onclose(() => {
      console.log("SignalR connection closed");
      setConnectionStatus("disconnected");
      setIsTerminalConnectedToServer(false);
    });

    conn.on("ReceivedJoinTerminal", (message: string) => {
      console.log("Server confirmed:", message);
      setIsTerminalConnectedToServer(true);
    });

    // THIS IS NOW INSIDE — uses latest products via ref
    conn.on("ReceiveScan", (barcode: string) => {
      console.log("Received barcode from scanner:", barcode);
      toast.success(`Scanned: ${barcode}`);

      const product = productsRef.current.find((x) => x?.barcode === barcode);
      if (!product) {
        toast.error(`Product not found: ${barcode}`);
        return;
      }

      const sI: SaleItemOmitted = {
        productVariantId: product.id,
        productVariant: product,
        quantity: 1,
        unitPrice: product.price,
        taxRatePercent: 0.125,
        lineTotal: product.price,
      };

      addProduct(sI); // This will trigger re-render, but ONLY when needed
    });

    conn.on("ScannerConnected", (message: string) => {
      console.log("Scanner connected:", message);
      setIsScannerConnectedToServer(true);
      toast.success("Scanner connected");
    });

    conn.on("ScannerDisconnected", () => {
      console.log("Scanner disconnected");
      setIsScannerConnectedToServer(false);
      toast.warning("Scanner disconnected");
    });

    return conn;
  }, [
    uuid,
    setIsTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    addProduct,
  ]);

  const validateUUID = useCallback(async () => {
    setInitialLoad(true);
    try {
      const conn = createConnection();
      connectionRef.current = conn;

      await conn.start();
      setConnectionStatus("connected");
      setIsTerminalConnectedToServer(true);
      console.log("SignalR connected");

      await conn.invoke("JoinTerminal", uuid);
      console.log(`Joined terminal group: ${uuid}`);
    } catch (err) {
      console.error("SignalR connection failed", err);
      setConnectionStatus("disconnected");
      setIsTerminalConnectedToServer(false);
      setError("Failed to connect to server");
    } finally {
      setInitialLoad(false);
    }
  }, [createConnection, uuid, setIsTerminalConnectedToServer]);

  //   useEffect(() => {
  //     if (uuid) {
  //       validateUUID();
  //     }
  //     return () => {
  //       connectionRef.current?.stop();
  //     };
  //   }, [uuid, validateUUID]);

  if (initialLoad && !connectionRef.current) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col gap-3">
          <span className="mt-2">Connect To Server</span>
          <Button onClick={() => validateUUID()}>Connect</Button>
        </div>
      </div>
    );
  }

  return <PosTerminal />;
}
