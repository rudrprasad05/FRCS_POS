// context/SignalRContext.tsx
"use client";

import {
  getConnectionStatus,
  getPosHubConnection,
  subscribeToStatus,
} from "@/lib/signalr";
import { HubConnection } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";

type SignalRContextType = {
  connection: HubConnection | null;
  status: "disconnected" | "connecting" | "connected" | "reconnecting";
};

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  status: "disconnected",
});

export const SignalRProvider = ({
  children,
  uuid,
}: {
  children: React.ReactNode;
  uuid: string;
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [status, setStatus] = useState<
    "disconnected" | "connecting" | "connected" | "reconnecting"
  >("connecting");

  useEffect(() => {
    const conn = getPosHubConnection(uuid);
    setConnection(conn);
    setStatus(getConnectionStatus());

    const unsubscribe = subscribeToStatus(() => {
      setStatus(getConnectionStatus());
    });

    return () => {
      unsubscribe();
      // Optional: keep alive across pages
      // Only stop on full unmount (e.g. tab close)
      // So we DON'T call closeConnection() here
    };
  }, [uuid]);

  return (
    <SignalRContext.Provider value={{ connection, status }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
