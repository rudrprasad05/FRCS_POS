"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Star,
  MessageSquare,
  Cake,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    title: "New Cake",
    description: "Create a new cake",
    icon: Plus,
    href: "/admin/cakes/create",
  },
  {
    title: "View Cakes",
    description: "View current cakes",
    icon: Cake,
    href: "/admin/cakes",
  },
  {
    title: "View Messages",
    description: "Manage customer messages",
    icon: MessageSquare,
    href: "/admin/messages",
  },
  {
    title: "View Media",
    description: "Create and edit media images",
    icon: Database,
    href: "/admin/media",
  },
];

export function QuickActions() {
  const router = useRouter();
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              onClick={() => router.push(action.href)}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 border-gray-200 hover:bg-rose-50 hover:border-rose-200"
            >
              <action.icon className="h-5 w-5 text-rose-600" />
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {action.title}
                </div>
                <div className="text-xs text-gray-500">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
