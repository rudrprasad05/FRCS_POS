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
  Building2,
  UsersIcon,
  Flag,
  BookText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    title: "Tax",
    href: "/admin/tax",
    icon: BookText,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
];

const companyNavigationItems = [
  {
    title: "Inventory",
    href: (companyId: string | number) => `/company/${companyId}/inventory`,
    icon: Database,
    subItems: [
      {
        title: "Summary",
        href: (companyId: string | number) =>
          `/company/${companyId}/inventory/summary`,
      },
      {
        title: "Product Batches",
        href: (companyId: string | number) =>
          `/company/${companyId}/inventory/batches`,
      },
      {
        title: "Low Stock",
        href: (companyId: string | number) =>
          `/company/${companyId}/inventory/low-stock`,
      },
      {
        title: "Expiring Products",
        href: (companyId: string | number) =>
          `/company/${companyId}/inventory/expiring`,
      },
      {
        title: "Stock Transfers",
        href: (companyId: string | number) =>
          `/company/${companyId}/inventory/transfers`,
      },
    ],
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  // Check if we're in a company route
  const companyMatch = pathname.match(/\/company\/([^\/]+)/);
  const companyId = companyMatch ? companyMatch[1] : null;

  // Determine which navigation items to show based on the route
  const itemsToShow = companyId ? companyNavigationItems : navigationItems;

  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="h-full">
        <SidebarMenu className="h-full">
          {navigationItems.map((item) => {
            const itemHref = item.href;

            const isActive =
              pathname === itemHref ||
              (pathname.startsWith(itemHref) && itemHref !== "/");

            return (
              <SidebarMenuItem
                key={typeof itemHref === "string" ? itemHref : item.title}
              >
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "" : " "
                  )}
                >
                  <Link href={itemHref}>
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
