"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Coins, Database, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SmallText, XSmallText } from "../../font/HeaderFonts";

const actions = [
  {
    title: "New Company",
    description: "New Company",
    icon: Plus,
    href: "/admin/cakes/create",
  },
  {
    title: "New User",
    description: "New Admin User",
    icon: Plus,
    href: "/admin/cakes",
  },
  {
    title: "View Sales",
    description: "View sales from each company",
    icon: Coins,
    href: "/admin/messages",
  },
  {
    title: "View Taxes",
    description: "View Tax Sections",
    icon: Coins,
    href: "/admin/messages",
  },
  {
    title: "View Media",
    description: "View All Media",
    icon: Database,
    href: "/admin/media",
  },
  {
    title: "Active Sessions",
    description: "View active pos terminals",
    icon: Banknote,
    href: "/admin/media",
  },
];

export function QuickActions() {
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
              key={action.title}
              onClick={() => router.push(action.href)}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2  "
            >
              <action.icon className="h-5 w-5 text-primary" />
              <div className="text-center flex flex-col space-y-2">
                <SmallText className="">{action.title}</SmallText>
                <XSmallText className="">{action.description}</XSmallText>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
