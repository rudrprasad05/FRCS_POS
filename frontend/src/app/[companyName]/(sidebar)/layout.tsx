import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/sidebar/AdminHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { CompanySidebar } from "@/components/company/sidebar/CompanySidebar";
import { CompanyHeader } from "@/components/company/sidebar/CompanyHeader";

export default function CompanyAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <CompanySidebar />
        <div className="flex-1 flex flex-col relative">
          <CompanyHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/sidebar/AdminHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";

export default function CompanyAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <CompanySidebar />
        <div className="flex-1 flex flex-col relative">
          <CompanyHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
