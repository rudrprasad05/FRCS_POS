"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BookText,
  Box,
  Building2,
  Coins,
  Computer,
  File,
  Flag,
  LayoutDashboard,
  UsersIcon,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    href: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "products",
    icon: Box,
  },
  {
    title: "Warehouse",
    href: "warehouse",
    icon: Warehouse,
  },
  {
    title: "Point of Sale",
    href: "pos",
    icon: Computer,
  },
  {
    title: "Sales",
    href: "sales",
    icon: Coins,
  },
  {
    title: "Reports",
    href: "reports",
    icon: File,
  },
];

export function CompanySidebarNavigation() {
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
