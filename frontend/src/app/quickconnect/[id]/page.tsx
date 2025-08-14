"use client";

import BarcodeScanner from "@/components/company/barcode/BarcodePage";
import React, { use } from "react";
import { useEffect, useRef } from "react";
type PageProps = {
  params: Promise<{ id: string; posId: string; sessionId: string }>;
};

export default function QuickConnectPage({ params }: PageProps) {
  const { id } = use(params);

  return <BarcodeScanner />;
}
