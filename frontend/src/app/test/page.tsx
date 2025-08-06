"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export default function WebSocketSender() {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket server

    socketRef.current = new WebSocket("wss://192.168.1.10:5081/ws/connect"); // Replace with your IP

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);

      // Example: send message every 2s
      const interval = setInterval(() => {
        socketRef.current?.send(
          JSON.stringify({ type: "ping", payload: "hello from frontend" })
        );
      }, 2000);

      return () => clearInterval(interval);
    };

    socketRef.current.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  // Example: send a barcode message
  const sendMessage = useCallback((barcode: string) => {
    const payload = {
      type: "SCAN",
      payload: barcode,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      console.log("Sent:", payload);
    } else {
      console.warn("WebSocket not connected");
    }
  }, []);

  return (
    <div className="p-4">
      <p>Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>

      <button
        onClick={() => sendMessage("ABC123456")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!isConnected}
      >
        Send Barcode
      </button>
    </div>
  );
}
