"use client";

import { redirect } from "next/navigation";
import { use } from "react";

type PageProps = {
  params: Promise<{ companyName: string; posId: string }>;
};
export default function PosViewPage({ params }: PageProps) {
  const { posId, companyName } = use(params);

  return redirect(`/${companyName}/pos/${posId}/view`);
}
