"use client";

import { GetPosSession } from "@/actions/PosSession";
import { usePosSession } from "@/context/PosContext";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import * as signalR from "@microsoft/signalr";
import { Loader2 } from "lucide-react";
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
    isTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    isScannerConnectedToServer,
    addProduct,
    products,
  } = usePosSession();
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productsRef = useRef<ProductVariant[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;

  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);

      if (!cake.data) return;

      console.log(cake.data);

      setInitialState(cake.data);
    };

    getData();
  }, [setInitialState, uuid]);

  const handleProductAdd = useCallback(
    (barcode: string) => {
      console.log("📦 Received barcode from scanner:", barcode);
      toast.success(`Scanned: ${barcode}`);

      // TODO: Look up product by barcode and add to cart
      // For now, just logging it
      // addProduct(foundProduct);

      const res = products.find((x) => x?.barcode == barcode);

      console.log(res);

      const product = res as ProductVariant;

      const sI: SaleItemOmitted = {
        productVariantId: product.id,
        productVariant: product,
        quantity: 1,
        unitPrice: product.price,
        taxRatePercent: 0.125,
        lineTotal: product.price,
      };
      addProduct(sI);
    },
    [addProduct, products]
  );

  const createConnection = useCallback(() => {
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
      console.log("✅ Server confirmed:", message);
      setIsTerminalConnectedToServer(true);
    });

    // THIS IS THE KEY PART - Listen for scans from the scanner
    conn.on("ReceiveScan", (barcode: string) => {
      handleProductAdd(barcode);
    });

    conn.on("ScannerConnected", (message: string) => {
      console.log("📱 Scanner connected:", message);
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
    apiUrl,
    uuid,
    handleProductAdd,
    setIsScannerConnectedToServer,
    setIsTerminalConnectedToServer,
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
      console.log(`🖥️ Joined terminal group: ${uuid}`);
    } catch (err) {
      console.error("SignalR connection failed", err);
      setConnectionStatus("disconnected");
      setIsTerminalConnectedToServer(false);
      setError("Failed to connect to server");
    } finally {
      setInitialLoad(false);
    }
  }, [uuid, createConnection, setIsTerminalConnectedToServer]);

  useEffect(() => {
    if (uuid) {
      validateUUID();
    }
    return () => {
      connectionRef.current?.stop();
    };
  }, [uuid, validateUUID]);

  if (initialLoad)
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col ">
          <Loader2 className="animate-spin" />
          Loading Products
        </div>
      </div>
    );

  return <PosTerminal />;
}
