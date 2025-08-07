"use client";

import { H1, P } from "@/components/font/HeaderFonts";
import { DashboardStats } from "@/components/superadmin/dashboard/DashboardStats";
import SuperAdminSalesGraph from "@/components/superadmin/dashboard/SuperAdminSalesGraph";

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1 className="">Dashboard</H1>
        <P className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </P>
      </div>

      <DashboardStats />
      <SuperAdminSalesGraph />
    </div>
  );
}
