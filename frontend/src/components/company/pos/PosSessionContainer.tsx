"use client";

import { GetPosSession } from "@/actions/PosSession";
import { PosSession } from "@/types/models";
import { useEffect, useState } from "react";
import PosTerminal from "./PosTerminal";
import { usePosSession } from "@/context/PosContext";

export default function PosSessionContainer({ uuid }: { uuid: string }) {
  const [loading, setLoading] = useState(true);
  const [initialData, setIntialData] = useState<PosSession | undefined>(
    undefined
  );
  const { data, setInitialState } = usePosSession();

  useEffect(() => {
    console.log(uuid);
    const getData = async () => {
      const cake = await GetPosSession(uuid);
      if (!cake.data) return;

      setIntialData(cake.data);
      setInitialState(cake.data);

      console.log(cake);
      setLoading(false);
    };
    getData();
  }, [uuid]);

  if (loading) {
    return <>loading</>;
  }

  if (!initialData) {
    return <>No data</>;
  }

  return <PosTerminal />;
}
