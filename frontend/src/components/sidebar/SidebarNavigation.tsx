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
  Building2,
  Flag,
  LayoutDashboard,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function SidebarNavigation() {
  const pathname = usePathname();

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
