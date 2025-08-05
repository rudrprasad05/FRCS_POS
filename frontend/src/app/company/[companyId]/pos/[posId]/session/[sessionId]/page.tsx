"use client";

import { GetPosSession } from "@/actions/PosSession";
import { GetPosTerminalById } from "@/actions/PosTerminal";
import PosSessionContainer from "@/components/pos/PosSessionContainer";
import { PosSessionProvider } from "@/context/PosContext";
import { PosSession } from "@/types/models";
import { IPosSessionData } from "@/types/res";
import React, { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};
export default function PosSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);

  return (
    <div>
      <PosSessionProvider>
        <PosSessionContainer uuid={sessionId} />
      </PosSessionProvider>
    </div>
  );
}
