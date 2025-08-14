"use client";

import React, { use } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function SuperAdminCompanyPage({ params }: PageProps) {
  const { companyId } = use(params);

  return (
    <div>
      {companyId}
      <ul>
        <li>in this page you should see all associated users</li>
        <li>all company warehouses and pos terminals</li>
        <li>active pos sessions</li>
        <li>all products</li>
      </ul>
    </div>
  );
}
