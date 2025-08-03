"use client";

import { GetPosTerminalById } from "@/actions/PosTerminal";
import { PosTerminal } from "@/types/models";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosPage({ params }: PageProps) {
  const { posId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PosTerminal | undefined>(undefined);

  useEffect(() => {
    console.log(posId);
    const getData = async () => {
      const cake = await GetPosTerminalById(posId);
      setData(cake.data);
      setLoading(false);
    };
    getData();
  }, [params, posId]);
  if (loading) {
    return <Loader2 className="animate-spin" />;
  }
  return <div>{data?.name}</div>;
}
