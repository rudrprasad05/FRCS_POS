"use client";

import { H1, P } from "@/components/font/HeaderFonts";
import { DashboardStats } from "@/components/superadmin/dashboard/DashboardStats";
import SuperAdminSalesGraph from "@/components/superadmin/dashboard/SuperAdminSalesGraph";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("prefecthed");
    router.prefetch("/admin/companies");
    router.prefetch("/admin/reports");
    router.prefetch("/admin/tax");
    router.prefetch("/admin/users");
  }, [router]);

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
