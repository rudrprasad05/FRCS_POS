"use client";

import { redirect } from "next/navigation";
import React, { use } from "react";

type PageProps = {
  params: Promise<{ companyName: string }>;
};

export default function CompanyAdminPage({ params }: PageProps) {
  const { companyName } = use(params);

  return redirect(`${companyName}/dashboard`);
}
