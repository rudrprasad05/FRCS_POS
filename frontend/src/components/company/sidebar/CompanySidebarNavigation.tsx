"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { UserRoles } from "@/types/models";
import {
  Box,
  Coins,
  Computer,
  Container,
  File,
  Info,
  LayoutDashboard,
  LucideIcon,
  User,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavArr {
  title: string;
  href: string;
  icon: LucideIcon;
}

export function CompanySidebarNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const base = `/${segments[0]}`;

  const cashierNavigationItems: INavArr[] = [
    {
      title: "Dashboard",
      href: `${base}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Point of Sale",
      href: `${base}/pos`,
      icon: Computer,
    },
  ];

  const adminNavigationItems = [
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
      title: "Suppliers",
      href: `${base}/suppliers`,
      icon: Container,
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
    {
      title: "Notifications",
      href: `${base}/notifications`,
      icon: Info,
    },
  ];

  const navArr =
    user?.role?.toUpperCase() === UserRoles.ADMIN
      ? adminNavigationItems
      : cashierNavigationItems;
  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="h-full">
        <SidebarMenu className="h-full">
          {navArr.map((item) => {
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
