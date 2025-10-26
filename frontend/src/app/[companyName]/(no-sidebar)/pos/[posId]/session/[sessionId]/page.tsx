"use client";

import PosSessionContainer from "@/components/company/pos/PosSessionContainer";
import { PosSessionProvider } from "@/context/PosContext";
import { SignalRProvider, useSignalR } from "@/context/SignalRContext";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};
export default function PosSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const [isReady, setIsReady] = useState(false);

  return (
    <PosSessionProvider>
      <SignalRProvider uuid={sessionId}>
        <DelayedInitializer setReady={setIsReady} />
        {isReady ? (
          <PosSessionContainer uuid={sessionId} />
        ) : (
          <InitializingScreen />
        )}
      </SignalRProvider>
    </PosSessionProvider>
  );
}

function DelayedInitializer({ setReady }: { setReady: (v: boolean) => void }) {
  const { status } = useSignalR();

  useEffect(() => {
    if (status === "connected" || status === "disconnected") {
      const timer = setTimeout(() => setReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [status, setReady]);

  return null;
}

function InitializingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Initializing POS...</p>
      </div>
    </div>
  );
}
