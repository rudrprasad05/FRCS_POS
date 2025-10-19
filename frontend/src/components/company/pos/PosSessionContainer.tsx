"use client";

import { GetPosSession } from "@/actions/PosSession";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePosSession } from "@/context/PosContext";
import { WebSocketUrl } from "@/lib/utils";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import * as signalR from "@microsoft/signalr";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PosTerminal from "./PosTerminal";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const {
    setInitialState,
    setIsTerminalConnectedToServer,
    isTerminalConnectedToServer,
    setIsScannerConnectedToServer,
    isScannerConnectedToServer,
    addProduct,
  } = usePosSession();

  const productsRef = useRef<ProductVariant[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const router = useRouter();

  const handleProductAdd = useCallback(
    async (scan: string) => {
      const product = productsRef.current.find((p) => p.barcode === scan);
      if (!product) return;
      const sI: SaleItemOmitted = {
        productVariantId: product.id,
        productVariant: product,
        quantity: 1,
        unitPrice: product.price,
        taxRatePercent: product.taxCategory?.ratePercent as number,
        lineTotal: product.price,
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

  const initializeConnection = async () => {
    setIsConnecting(true);
    if (!uuid || connectionRef.current) {
      console.warn("Invalid uuid or connection already exists");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${WebSocketUrl}/socket/posHub?terminalId=${uuid}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) =>
          retryContext.previousRetryCount < 3 ? 1000 : null, // Retry 3 times
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    try {
      await connection.start();
      setIsTerminalConnectedToServer(true);
      console.log(`✅ Connected to terminal ${uuid}`);
      await connection.invoke("JoinTerminal", uuid);
      setIsConnecting(false);
    } catch (err: any) {
      setIsTerminalConnectedToServer(false);
      console.error("❌ SignalR connection failed:", err.message, err.stack);
    }

    // Event handlers
    connection.on("ReceiveScan", (scan) => handleProductAdd(scan));
    connection.on("ReceivedJoinTerminal", () =>
      setIsTerminalConnectedToServer(true)
    );
    connection.on("ScannerConnected", () => {
      setIsScannerConnectedToServer(true);
      toast.success("Scanner connected");
    });
    connection.on("ScannerDisconnected", () => {
      setIsScannerConnectedToServer(false);
      toast.warning("Scanner disconnected");
    });

    // Handle reconnection
    connection.onreconnected(() => {
      setIsTerminalConnectedToServer(true);
      connection
        .invoke("JoinTerminal", uuid)
        .catch((err) => console.error("Reconnection invoke failed:", err));
    });

    // Handle close
    connection.onclose((error) => {
      setIsTerminalConnectedToServer(false);
      console.error("Connection closed:", error);
    });
  };

  if (loading)
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col ">
          <Loader2 className="animate-spin" />
          Loading Products
        </div>
      </div>
    );

  if (!isTerminalConnectedToServer) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <Card className="min-w-xl">
          <CardHeader>
            <CardTitle className="text-xl">Oops!</CardTitle>
            <CardDescription>
              Looks like you arent connected to the server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              Terminal:
              <Badge variant={"destructive"}>Offline</Badge>
            </div>
            <div className="flex items-center gap-2">
              Scanner:
              {isScannerConnectedToServer ? (
                <Badge variant={"default"}>Online</Badge>
              ) : (
                <Badge variant={"destructive"}>Offline</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Button variant={"secondary"} onClick={() => router.back()}>
                Go Back
              </Button>
              <Button
                disabled={isTerminalConnectedToServer || !uuid || isConnecting}
                onClick={initializeConnection}
              >
                {isConnecting && <Loader2 className="animate-spin" />}
                Connect
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <PosTerminal />;
}
