"use client";

import { GetPosTerminalById } from "@/actions/PosTerminal";
import { PosTerminal } from "@/types/models";
import React, { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosPage({ params }: PageProps) {
  const { companyId, posId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PosTerminal | undefined>(undefined);

  useEffect(() => {
    console.log(companyId, posId);
    const getData = async () => {
      const cake = await GetPosTerminalById(posId);
      setData(cake.data);
      setLoading(false);
    };
    getData();
  }, [params, companyId]);
  return <div>{data?.name}</div>;
}
