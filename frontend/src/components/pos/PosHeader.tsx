"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  Maximize,
  Menu,
  Minimize,
  Monitor,
  Moon,
  RotateCcw,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import PosQrCodeConnectDialoge from "./PosQrCodeConnectDialoge";

export default function PosHeader() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

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
        <h1 className="text-xl font-semibold text-foreground">RetailPOS</h1>
        <div className="text-sm text-muted-foreground">Terminal #001</div>
      </div>

      {/* Center - Current page indicator */}
      <div className="flex items-center space-x-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Point of Sale</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        {/* QR Code Scanner */}
        <PosQrCodeConnectDialoge />
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Main Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <CreditCard className="h-4 w-4 mr-2" />
              Terminal
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RotateCcw className="h-4 w-4 mr-2" />
              Refunds
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              User Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
