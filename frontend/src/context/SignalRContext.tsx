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
    // Delay connection setup by 2 seconds
    const delayMs = 2000;
    const timer = setTimeout(() => {
      const conn = getPosHubConnection(uuid);
      setConnection(conn);
      setStatus(getConnectionStatus());

      const unsubscribe = subscribeToStatus(() => {
        setStatus(getConnectionStatus());
      });

      // Cleanup on unmount
      return () => {
        unsubscribe();
      };
    }, delayMs);

    return () => clearTimeout(timer);
  }, [uuid]);

  return (
    <SignalRContext.Provider value={{ connection, status }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
