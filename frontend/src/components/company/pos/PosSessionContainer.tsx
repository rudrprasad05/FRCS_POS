"use client";

import { GetPosSession } from "@/actions/PosSession";
import { usePosSession } from "@/context/PosContext";
import { WebSocketUrl } from "@/lib/utils";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PosTerminal from "./PosTerminal";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const [loading, setLoading] = useState(true);

  const {
    setInitialState,
    setIsTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    addProduct,
  } = usePosSession();

  const productsRef = useRef<ProductVariant[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const handleProductAdd = useCallback(
    async (scan: string) => {
      const product = productsRef.current.find((p) => p.barcode === scan);
      if (!product) return;
      const sI: SaleItemOmitted = {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price,
        taxRatePercent: product.taxCategory?.ratePercent as number,
        lineTotal: product.price,
        isDeleted: false,
      };
      addProduct(sI);
    },
    [addProduct]
  );

  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);

      if (!cake.data) return;

      setInitialState(cake.data);
      setLoading(false);
    };

    getData();
  }, [setInitialState, uuid]);

  useEffect(() => {
    if (!uuid || connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${WebSocketUrl}/socket/posHub?terminalId=${uuid}`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        setIsTerminalConnectedToServer(true);
        connection.invoke("JoinTerminal", uuid);
      })
      .catch((err) => {
        setIsTerminalConnectedToServer(false);
        console.error("❌ SignalR connection failed:", err);
      });

    // Listen for scans sent from phone
    connection.on("ReceiveScan", (scan) => {
      handleProductAdd(scan);
    });
    connection.on("ReceivedJoinTerminal", (scan) => {
      setIsTerminalConnectedToServer(true);
    });
    connection.on("ScannerConnected", (scan) => {
      setIsScannerConnectedToServer(true);
      toast.success("Scanner connected");
    });
    connection.on("ScannerDisconnected", (scan) => {
      setIsScannerConnectedToServer(false);
      toast.warning("Scanner disconnected");
    });

    return () => {
      setIsTerminalConnectedToServer(false);
      connection.stop();
    };
  }, [uuid, handleProductAdd]);

  if (loading) return <>loading</>;

  return <PosTerminal />;
}
