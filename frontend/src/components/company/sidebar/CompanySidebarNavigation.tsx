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
  User,
  UsersIcon,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CompanySidebarNavigation() {
  const pathname = usePathname();

  // split path: /newworld/products/new → ["", "newworld", "products", "new"]
  const segments = pathname.split("/").filter(Boolean);
  const base = `/${segments[0]}`; // this will be "newworld" or any dynamic org/shop

  const navigationItems = [
    {
      title: "Dashboard",
      href: `${base}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: `${base}/products`,
      icon: Box,
    },
    {
      title: "Warehouse",
      href: `${base}/warehouse`,
      icon: Warehouse,
    },
    {
      title: "Point of Sale",
      href: `${base}/pos`,
      icon: Computer,
    },
    {
      title: "Sales",
      href: `${base}/sales`,
      icon: Coins,
    },
    {
      title: "Users",
      href: `${base}/users`,
      icon: User,
    },
    {
      title: "Reports",
      href: `${base}/reports`,
      icon: File,
    },
  ];
  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="h-full">
        <SidebarMenu className="h-full">
          {navigationItems.map((item) => {
            const isActive = pathname.includes(item.href);
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
