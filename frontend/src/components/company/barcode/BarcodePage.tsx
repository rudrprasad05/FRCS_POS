"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Maximize,
  Minimize,
  Camera,
  Trash2,
  Copy,
  CheckCircle,
  OctagonX,
  Loader2,
} from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useParams } from "next/navigation";
import { ValidateQr } from "@/actions/PosSession";
import * as signalR from "@microsoft/signalr";
import { WebSocketUrl } from "@/lib/utils";

interface ScannedItem {
  id: string;
  data: string;
  format: string;
  timestamp: Date;
}

export default function BarcodeScanner() {
  const [isUUIDValidated, setIsUUIDValidated] = useState(false);
  const [initalLoad, setInitialLoad] = useState(true);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const beep = new Audio("/scanner-beep.mp3");
  const [connection, setConnection] = useState<any>(null);

  useEffect(() => {
    validateUUID();
  }, [id]);

  function createConnection(terminalId: string) {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${WebSocketUrl}/socket/posHub?terminalId=${terminalId}`)
      .withAutomaticReconnect()
      .build();
  }

  const validateUUID = async () => {
    setInitialLoad(true);
    try {
      const res = await ValidateQr(id);
      if (res.success) {
        setIsUUIDValidated(true);

        // setup signalR once validated
        const conn = createConnection(id);
        conn
          .start()
          .then(() => {
            console.log("✅ Connected to SignalR hub for terminal:", id);
          })
          .catch((err) => console.error("SignalR connection failed", err));

        // listen for server messages (e.g. terminal confirming scan)
        conn.on("ReceiveMessage", (msg) => {
          console.log("📩 From server:", msg);
        });

        setConnection(conn);
      } else {
        setIsUUIDValidated(false);
      }
    } catch {
      setIsUUIDValidated(false);
    } finally {
      setInitialLoad(false);
    }
  };

  const startScanning = useCallback(async () => {
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      const videoInputDevices =
        await codeReader.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) throw new Error("No camera found");

      const selectedDeviceId = videoInputDevices[0].deviceId;
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const data = result.getText();
            if (lastScanned !== data) {
              const newItem = {
                id: Date.now().toString(),
                data,
                format: result.getBarcodeFormat().toString(),
                timestamp: new Date(),
              };
              setScannedItems((prev) => [newItem, ...prev]);
              setLastScanned(data);
              beep.play().catch(() => {});

              // 🔥 send scan to server via SignalR
              connection
                ?.invoke("SendScan", {
                  terminalId: id,
                  barcode: data,
                  format: result.getBarcodeFormat().toString(),
                })
                .catch((err: any) => console.error("SendScan failed", err));

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
      setError(err instanceof Error ? err.message : "Failed to start camera");
    }
  }, [lastScanned, connection, id]);

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

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
        connection?.stop();
      }
    };
  }, [connection]);

  if (initalLoad) {
    return <Loader2 className="animate-spin" />;
  }

  if (!isUUIDValidated) {
    return (
      <div className="flex items-center gap-4">
        <OctagonX />
        Quick Connect Device could not be verified
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
        <h1 className="text-xl font-bold">Barcode Scanner</h1>
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
          <div className="absolute inset-0 flex items-center justify-center">
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
            <div className="absolute top-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg">
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Scanning
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
                    isScanning ? "bg-green-400" : "bg-gray-400"
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
              className={
                isScanning
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
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
