"use client";

import { GetPosSession } from "@/actions/PosSession";
import { PosSessionWithProducts } from "@/types/models";
import { useEffect, useState } from "react";
import PosTerminal from "./PosTerminal";
import { usePosSession } from "@/context/PosContext";
import * as signalR from "@microsoft/signalr";
import { WebSocketUrl } from "@/lib/utils";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const [loading, setLoading] = useState(true);
  const [initialData, setIntialData] = useState<PosSessionWithProducts>();
  const {
    setInitialState,
    setIsTerminalConnectedToServer,
    setIsScannerConnectedToServer,
  } = usePosSession();

  useEffect(() => {
    const getData = async () => {
      const cake = await GetPosSession(uuid);
      if (!cake.data) return;

      setIntialData(cake.data);
      setInitialState(cake.data);

      setLoading(false);
    };

    getData();
  }, []);

  // 🔥 Setup SignalR once we have UUID
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
      console.log("📩 Scan received:", scan);
    });
    connection.on("ReceivedJoinTerminal", (scan) => {
      setIsTerminalConnectedToServer(true);
      console.log("📩 Scan received:", scan);
    });
    connection.on("ScannerConnected", (scan) => {
      setIsScannerConnectedToServer(true);
      console.log("📩 Scan received:", scan);
    });

    return () => {
      setIsTerminalConnectedToServer(false);
      connection.stop();
    };
  }, [uuid]);

  if (loading) return <>loading</>;
  if (!initialData) return <>No data</>;

  return <PosTerminal />;
}
