"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as signalR from "@microsoft/signalr";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import {
  Camera,
  CheckCircle,
  Copy,
  Maximize,
  Minimize,
  Trash2,
  WifiOff,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ScannedItem {
  id: string;
  data: string;
  format: string;
  timestamp: Date;
}

export default function BarcodeScanner() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "reconnecting"
  >("connecting");

  const params = useParams();
  const id = params.id as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const beep = useMemo(() => new Audio("/scanner-beep.mp3"), []);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;

  const createConnection = useCallback(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/socket/posHub?terminalId=${id}`, {
        withCredentials: true,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0, 2, 10, 30 seconds, then 30 seconds
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .build();

    // Connection status handlers
    conn.onreconnecting(() => {
      console.log("SignalR reconnecting...");
      setConnectionStatus("reconnecting");
    });

    conn.onreconnected(() => {
      console.log("SignalR reconnected");
      setConnectionStatus("connected");
      // Rejoin the scanner group after reconnection
      conn.invoke("JoinScanner", id).catch((err) => {
        console.error("Failed to rejoin scanner group", err);
      });
    });

    conn.onclose(() => {
      console.log("SignalR connection closed");
      setConnectionStatus("disconnected");
    });

    // Listen for confirmations from server
    conn.on("ReceivedJoinScanner", (message: string) => {
      console.log("Server confirmed:", message);
    });

    return conn;
  }, [apiUrl, id]);

  const validateUUID = useCallback(async () => {
    setInitialLoad(true);
    try {
      const conn = createConnection();
      connectionRef.current = conn;

      await conn.start();
      setConnectionStatus("connected");
      console.log("SignalR connected");

      await conn.invoke("JoinScanner", id);
      console.log(`Joined scanner group: ${id}`);
    } catch (err) {
      console.error("SignalR connection failed", err);
      setConnectionStatus("disconnected");
      setError("Failed to connect to server");
    } finally {
      setInitialLoad(false);
    }
  }, [id, createConnection]);

  const startScanning = useCallback(async () => {
    try {
      setError(null);

      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      const videoInputDevices =
        await codeReader.current.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        throw new Error("No camera found");
      }

      // Prefer back camera on mobile devices
      const backCamera = videoInputDevices.find((device) =>
        device.label.toLowerCase().includes("back")
      );
      const selectedDeviceId =
        backCamera?.deviceId || videoInputDevices[0].deviceId;

      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const data = result.getText();

            // Debounce: prevent scanning the same code within 2 seconds
            if (lastScanned !== data) {
              const newItem: ScannedItem = {
                id: Date.now().toString(),
                data,
                format: result.getBarcodeFormat().toString(),
                timestamp: new Date(),
              };

              setScannedItems((prev) => [newItem, ...prev]);
              setLastScanned(data);
              beep.play().catch(() => {});

              // Send scan to server via SignalR
              if (
                connectionRef.current?.state ===
                signalR.HubConnectionState.Connected
              ) {
                connectionRef.current
                  .invoke("SendScan", {
                    quickConnectId: id,
                    barcode: data,
                  })
                  .catch((err) => {
                    console.error("SendScan failed", err);
                    setError("Failed to send scan to server");
                  });
              } else {
                console.warn("Cannot send scan - not connected to server");
              }

              setTimeout(() => setLastScanned(null), 2000);
            }
          }

          if (error && !(error instanceof NotFoundException)) {
            console.error("Scan error", error);
          }
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start camera";
      setError(errorMessage);
      console.error("Camera error:", err);
    }
  }, [beep, lastScanned, id]);

  const stopScanning = useCallback(() => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await scannerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setScannedItems([]);
  }, []);

  const copyToClipboard = useCallback(async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, []);

  //   // Initialize connection on mount
  //   useEffect(() => {
  //     validateUUID();
  //   }, [validateUUID]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
      if (connectionRef.current) {
        connectionRef.current.stop().catch((err) => {
          console.error("Error stopping connection", err);
        });
      }
    };
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (initialLoad) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col gap-3">
          <span className="mt-2">Connect To Server</span>
          <Button onClick={() => validateUUID()}>Connect</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scannerRef}
      className="h-screen flex flex-col bg-black text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div>
          <h1 className="text-xl font-bold">Barcode Scanner</h1>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400"
                  : connectionStatus === "reconnecting"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-400"
              }`}
            ></div>
            <span className="text-xs text-gray-400">
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "reconnecting"
                ? "Reconnecting..."
                : "Disconnected"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            disabled={scannedItems.length === 0}
            className="text-white border-gray-600 hover:bg-gray-700 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white border-gray-600 hover:bg-gray-700 bg-transparent"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col">
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="w-64 h-64 border-2 border-white border-dashed rounded-lg opacity-50"></div>
              <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg flex items-center gap-2">
              <WifiOff className="w-5 h-5" />
              {error}
            </div>
          )}

          {!isScanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-4">Camera not active</p>
                <Button
                  onClick={startScanning}
                  disabled={connectionStatus !== "connected"}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                >
                  {connectionStatus !== "connected"
                    ? "Waiting for connection..."
                    : "Start Scanning"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isScanning ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-300">
                  {isScanning ? "Scanning..." : "Stopped"}
                </span>
              </div>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {scannedItems.length} scanned
              </Badge>
            </div>

            <Button
              onClick={isScanning ? stopScanning : startScanning}
              disabled={!isScanning && connectionStatus !== "connected"}
              className={
                isScanning
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
              }
            >
              {isScanning ? "Stop" : "Start"} Scanning
            </Button>
          </div>
        </div>
      </div>

      {/* Scanned Items List */}
      {scannedItems.length > 0 && (
        <div className="h-48 bg-gray-900 border-t border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold text-gray-200">Scanned Items</h3>
          </div>
          <ScrollArea className="h-36">
            <div className="p-4 space-y-2">
              {scannedItems.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-300"
                          >
                            {item.format}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-white font-mono break-all">
                          {item.data}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.data, item.id)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 flex-shrink-0"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
