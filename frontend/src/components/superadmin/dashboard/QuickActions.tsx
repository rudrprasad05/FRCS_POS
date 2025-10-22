"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Plus, Truck, User, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SmallText, XSmallText } from "../../font/HeaderFonts";

export function QuickActions({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  let actions = [];
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const base = `/${segments[0]}`;

  const superadmin = [
    {
      title: "New Company",
      description: "New Company",
      icon: Plus,
      href: "/admin/company",
    },
    {
      title: "New User",
      description: "New Admin User",
      icon: Plus,
      href: "/admin/users",
    },
    {
      title: "New Tax Sales",
      description: "View sales from each company",
      icon: Coins,
      href: "/admin/tax",
    },
    {
      title: "View Reports",
      description: "View Monthly Reports",
      icon: Coins,
      href: "/admin/reports",
    },
  ];

  const admin = [
    {
      title: "New Product",
      description: "Create a new product",
      icon: Plus,
      href: `${base}/products/new`,
    },
    {
      title: "New POS Terminal",
      description: "Create a new pos terminal",
      icon: Plus,
      href: `${base}/pos`,
    },
    {
      title: "View Sales",
      description: "View sales from each company",
      icon: Coins,
      href: `${base}/sales`,
    },
    {
      title: "View Suppliers",
      description: "View Tax Sections",
      icon: Truck,
      href: `${base}/suppliers`,
    },
    {
      title: "Manage Users",
      description: "Create and edit users",
      icon: User,
      href: `${base}/users`,
    },
    {
      title: "Manage Warehouses",
      description: "Create and edit warehouses",
      icon: Warehouse,
      href: `${base}/warehouse`,
    },
  ];

  if (isSuperAdmin) {
    actions = superadmin;
  } else {
    actions = admin;
  }
  const router = useRouter();
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg font-semibold ">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              asChild
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2  "
            >
              <Link href={action.href} prefetch>
                <action.icon className="h-5 w-5 text-primary" />
                <div className="text-center flex flex-col space-y-2">
                  <SmallText className="">{action.title}</SmallText>
                  <XSmallText className="">{action.description}</XSmallText>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
