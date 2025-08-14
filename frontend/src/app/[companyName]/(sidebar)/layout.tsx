import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/sidebar/AdminHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
<<<<<<< HEAD
<<<<<<< HEAD
import { CompanySidebar } from "@/components/company/sidebar/CompanySidebar";
import { CompanyHeader } from "@/components/company/sidebar/CompanyHeader";
=======
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
=======
import { CompanySidebar } from "@/components/company/sidebar/CompanySidebar";
import { CompanyHeader } from "@/components/company/sidebar/CompanyHeader";
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)

export default function CompanyAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
<<<<<<< HEAD
<<<<<<< HEAD
        <CompanySidebar />
        <div className="flex-1 flex flex-col relative">
          <CompanyHeader />
=======
        <AdminSidebar />
        <div className="flex-1 flex flex-col relative">
          <AdminHeader />
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
=======
        <CompanySidebar />
        <div className="flex-1 flex flex-col relative">
          <CompanyHeader />
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
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
