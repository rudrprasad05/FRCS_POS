"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Star,
  Share2,
  MessageSquare,
  Database,
  Tag,
  Cake,
  Bell,
  Globe,
  Cloud,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="h-full">
        <SidebarMenu className="h-full">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "" : " "
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
