import { CompanyHeader } from "@/components/company/sidebar/CompanyHeader";
import { CompanySidebar } from "@/components/company/sidebar/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

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
