import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/sidebar/AdminHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
<<<<<<< HEAD
import { CompanySidebar } from "@/components/company/sidebar/CompanySidebar";
import { CompanyHeader } from "@/components/company/sidebar/CompanyHeader";
=======
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)

export default function CompanyAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
<<<<<<< HEAD
        <CompanySidebar />
        <div className="flex-1 flex flex-col relative">
          <CompanyHeader />
=======
        <AdminSidebar />
        <div className="flex-1 flex flex-col relative">
          <AdminHeader />
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
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
