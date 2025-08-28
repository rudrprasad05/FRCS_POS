"use client";

import CompanySalesGraph from "@/components/company/dashboard/CompanySalesGraph";
import { CompanyDashboardStats } from "@/components/company/dashboard/DashboardStats";
import { H1, P } from "@/components/font/HeaderFonts";

export default function CompanyDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1 className="">Dashboard</H1>
        <P className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </P>
      </div>

      <CompanyDashboardStats />
      {/* <CompanySalesGraph /> */}
    </div>
  );
}
