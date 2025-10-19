"use client";

import PosHeader from "@/components/company/pos/PosHeader";
import { useParams } from "next/navigation";
import React from "react";

export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const posId = decodeURIComponent(params.posId as string);
  const sessionId = decodeURIComponent(params.sessionId as string);
  return (
    <div>
      <PosHeader back={`/${companyName}/pos/${posId}/session/${sessionId}`} />
      <div className="px-12 py-8">{children}</div>
    </div>
  );
}
