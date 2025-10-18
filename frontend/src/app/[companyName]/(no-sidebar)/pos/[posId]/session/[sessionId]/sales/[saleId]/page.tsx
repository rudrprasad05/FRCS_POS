"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ saleId: string; posId: string; productId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const { saleId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.push(`${saleId}/view`);
    setIsLoading(false);
  }, [saleId, router]);

  if (isLoading) return <Loader2 className="animate-spin" />;
  return null;
}
