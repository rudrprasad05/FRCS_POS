"use client";

import PosSessionContainer from "@/components/company/pos/PosSessionContainer";
<<<<<<< HEAD
=======
<<<<<<<< HEAD:frontend/src/app/[companyName]/(sidebar)/pos/[posId]/session/[sessionId]/page.tsx
========
import { CartProvider } from "@/context/CartContext";
>>>>>>>> b06d943 (chore (ui): format bugs):frontend/src/app/[companyName]/(no-sidebar)/pos/[posId]/session/[sessionId]/page.tsx
>>>>>>> b06d943 (chore (ui): format bugs)
import { PosSessionProvider } from "@/context/PosContext";
import { use } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};
export default function PosSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);

  return (
    <PosSessionProvider>
<<<<<<< HEAD
      <PosSessionContainer uuid={sessionId} />
=======
<<<<<<<< HEAD:frontend/src/app/[companyName]/(sidebar)/pos/[posId]/session/[sessionId]/page.tsx
      <PosSessionContainer uuid={sessionId} />
========
      <CartProvider>
        <PosSessionContainer uuid={sessionId} />
      </CartProvider>
>>>>>>>> b06d943 (chore (ui): format bugs):frontend/src/app/[companyName]/(no-sidebar)/pos/[posId]/session/[sessionId]/page.tsx
>>>>>>> b06d943 (chore (ui): format bugs)
    </PosSessionProvider>
  );
}
