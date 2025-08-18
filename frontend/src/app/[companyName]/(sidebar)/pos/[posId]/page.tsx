"use client";

import { CreateNewPosSession } from "@/actions/PosSession";
import { GetPosTerminalById } from "@/actions/PosTerminal";
import { PosTerminal } from "@/types/models";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosPage({ params }: PageProps) {
  const { posId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PosTerminal | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    console.log(posId);
    const getData = async () => {
      const cake = await GetPosTerminalById(posId);
      setData(cake.data);
      setLoading(false);
    };
    getData();
  }, [params, posId]);

  async function handleNewSession() {
    const res = await CreateNewPosSession({
      PosTerminalUUID: posId,
    });
    const url = res.data?.uuid;
    router.push(posId + "/session/" + url);
  }

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="flex items-center gap-4">
      <div>{data?.name}</div>
      <div onClick={() => handleNewSession()} className="underline">
        New Session
      </div>
    </div>
  );
}
