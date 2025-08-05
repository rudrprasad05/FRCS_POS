"use client";

import BarcodeScanner from "@/components/barcode/BarcodePage";
import React, { use } from "react";

type PageProps = {
  params: Promise<{ id: string; posId: string; sessionId: string }>;
};

export default function QuickConnectPage({ params }: PageProps) {
  const { id } = use(params);

  return <BarcodeScanner />;
}
