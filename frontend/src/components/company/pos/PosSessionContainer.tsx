"use client";

import { GetPosSession } from "@/actions/PosSession";
import { usePosSession } from "@/context/PosContext";
import { WebSocketUrl } from "@/lib/utils";
import { Product, SaleItemOmitted } from "@/types/models";
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

  const productsRef = useRef<Product[]>([]);

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
    [productsRef, addProduct]
  );

  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);
      console.log("sessin data", cake);
      if (!cake.data) return;

      setInitialState(cake.data);
      setLoading(false);
    };

    getData();
  }, [setInitialState, uuid]);

  useEffect(() => {
    if (!uuid) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${WebSocketUrl}/socket/posHub?terminalId=${uuid}`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        // setIsTerminalConnectedToServer(true);
        console.log("✅ Terminal connected to hub:", uuid);
        connection.invoke("JoinTerminal", uuid);
      })
      .catch((err) => {
        setIsTerminalConnectedToServer(false);
        console.error("❌ SignalR connection failed:", err);
      });

    // Listen for scans sent from phone
    connection.on("ReceiveScan", (scan) => {
      console.log("📩 Barcode received:", scan);
      handleProductAdd(scan);
    });
    connection.on("ReceivedJoinTerminal", (scan) => {
      setIsTerminalConnectedToServer(true);
      console.log("📩 Scan received:", scan);
    });
    connection.on("ScannerConnected", (scan) => {
      setIsScannerConnectedToServer(true);
      toast.success("Scanner connected");
      console.log("📩 Scan received:", scan);
    });
    connection.on("ScannerDisconnected", (scan) => {
      setIsScannerConnectedToServer(false);
      toast.warning("Scanner disconnected");
      console.log("📩 scanner left:", scan);
    });

    return () => {
      setIsTerminalConnectedToServer(false);
      connection.stop();
    };
  }, [
    uuid,
    handleProductAdd,
    setIsScannerConnectedToServer,
    setIsTerminalConnectedToServer,
  ]);

  if (loading) return <>loading</>;

  return <PosTerminal />;
}
