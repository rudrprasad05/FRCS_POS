import { Header } from "@/components/navigation/sidebar/Header";
import { SideBar } from "@/components/navigation/sidebar/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SideBar />
        <div className="flex-1 flex flex-col relative">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
