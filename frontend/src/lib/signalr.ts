// lib/signalr.ts
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;
const subscribers = new Set<() => void>();

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

let currentStatus: ConnectionStatus = "disconnected";

export const getPosHubConnection = (uuid: string): signalR.HubConnection => {
  if (connection) return connection;

  const apiUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;
  connection = new signalR.HubConnectionBuilder()
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
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // Status tracking
  const setStatus = (status: ConnectionStatus) => {
    currentStatus = status;
    subscribers.forEach((cb) => cb());
  };

  connection.onclose(() => setStatus("disconnected"));
  connection.onreconnecting(() => setStatus("reconnecting"));
  connection.onreconnected(() => setStatus("connected"));

  // Start connection
  connection
    .start()
    .then(() => {
      setStatus("connected");
      connection!.invoke("JoinTerminal", uuid).catch(console.error);
    })
    .catch((err) => {
      console.error("SignalR Connection Failed:", err);
      setStatus("disconnected");
    });

  return connection;
};

export const getConnectionStatus = (): ConnectionStatus => currentStatus;

export const subscribeToStatus = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export const closeConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
    currentStatus = "disconnected";
    subscribers.clear();
  }
};
