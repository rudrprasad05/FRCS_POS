"use client";

import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; productId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const { productId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.push(`${productId}/view`);
    setIsLoading(false);
  }, [productId]);

  if (isLoading) return <Loader2 className="animate-spin" />;
  return null;
}
