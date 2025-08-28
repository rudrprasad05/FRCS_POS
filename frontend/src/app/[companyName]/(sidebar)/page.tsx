"use client";

import { useAuth } from "@/context/UserContext";
import { redirect } from "next/navigation";
import React, { use } from "react";

type PageProps = {
  params: Promise<{ companyName: string }>;
};

export default function CompanyAdminPage({ params }: PageProps) {
  const { companyName } = use(params);
  const { user } = useAuth();

  return redirect(`${companyName}/dashboard`);
}
