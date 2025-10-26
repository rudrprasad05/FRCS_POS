"use client";

import PosSessionContainer from "@/components/company/pos/PosSessionContainer";
import { PosSessionProvider } from "@/context/PosContext";
import { SignalRProvider } from "@/context/SignalRContext";
import { use } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};
export default function PosSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);

  return (
    <PosSessionProvider>
      <SignalRProvider uuid={sessionId}>
        <PosSessionContainer uuid={sessionId} />
      </SignalRProvider>
    </PosSessionProvider>
  );
}
