import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/sidebar/AdminHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col relative">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}