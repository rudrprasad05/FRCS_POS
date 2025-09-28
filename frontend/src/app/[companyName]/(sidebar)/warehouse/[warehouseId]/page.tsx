"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ warehouseId: string; posId: string; productId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const { warehouseId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.push(`${warehouseId}/view`);
    setIsLoading(false);
  }, [warehouseId, router]);

  if (isLoading) return <Loader2 className="animate-spin" />;
  return null;
}
