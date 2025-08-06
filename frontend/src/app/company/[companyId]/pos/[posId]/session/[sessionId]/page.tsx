"use client";

import PosSessionContainer from "@/components/pos/PosSessionContainer";
import { CartProvider } from "@/context/CartContext";
import { PosSessionProvider } from "@/context/PosContext";
import { use } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};
export default function PosSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);

  return (
    <div>
      <PosSessionProvider>
        <CartProvider>
          <PosSessionContainer uuid={sessionId} />
        </CartProvider>
      </PosSessionProvider>
    </div>
  );
}
