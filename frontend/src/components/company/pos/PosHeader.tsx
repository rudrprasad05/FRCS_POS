"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePosSession } from "@/context/PosContext";
import {
  ArrowLeft,
  CreditCard,
  Maximize,
  Menu,
  Minimize,
  Plug,
  RotateCcw,
  Smartphone,
  Unplug,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import PosQrCodeConnectDialoge from "./PosQrCodeConnectDialoge";

export default function PosHeader({ back }: { back?: string }) {
  const { session, isTerminalConnectedToServer, isScannerConnectedToServer } =
    usePosSession();
  const params = useParams();
  const companyName = String(params.companyName);
  const posId = String(params.posId);
  const sessionId = String(params.sessionId);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      {/* Left side - Logo/Brand */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1 text-sm">
          <Link
            className="flex items-center gap-1 text-sm"
            prefetch
            href={back || `/${companyName}/pos/${posId}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          <Link href={`/${companyName}/dashboard`}>RetailPOS</Link>
        </h1>
        <div className="text-sm text-muted-foreground">
          {session.posTerminal?.name}
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        {/* QR Code Scanner */}
        {isTerminalConnectedToServer ? (
          <Plug className="w-4 h-4 text-green-500" />
        ) : (
          <Unplug className="w-4 h-4 text-rose-500" />
        )}
        {isScannerConnectedToServer ? (
          <Smartphone className="w-4 h-4 text-green-500" />
        ) : (
          <Smartphone className="w-4 h-4 text-rose-500" />
        )}
        <PosQrCodeConnectDialoge />
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>

        {/* Main Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/${companyName}/pos/${posId}/session/${sessionId}`}>
                <CreditCard className="h-4 w-4 mr-2" />
                Terminal
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${companyName}/pos/${posId}/session/${sessionId}/sales`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refunds
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
