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
  BookText,
  Box,
  Building2,
  Coins,
  Computer,
  Container,
  File,
  Flag,
  Info,
  LayoutDashboard,
  Loader2,
  LucideIcon,
  User,
  UsersIcon,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavArr {
  title: string;
  href: string;
  icon: LucideIcon;
}

export function SideBarNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const base = `/${segments[0]}`;

  const superAdminItems: INavArr[] = [
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

  const cashierNavigationItems: INavArr[] = [
    {
      title: "Point of Sale",
      href: `${base}/pos`,
      icon: Computer,
    },
    {
      title: "Notifications",
      href: `${base}/notifications`,
      icon: Info,
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

  if (!user) {
    return (
      <div className="p-2">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  let navArr: INavArr[];

  if (user?.role?.toUpperCase() === UserRoles.CASHIER)
    navArr = cashierNavigationItems;
  else if (user?.role?.toUpperCase() === UserRoles.ADMIN)
    navArr = adminNavigationItems;
  else navArr = superAdminItems;

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
