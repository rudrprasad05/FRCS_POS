"use client";

import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/UserContext";
import { Cable, HandCoins, Wrench } from "lucide-react";
import { useParams } from "next/navigation";

export function CompanySidebarLogo() {
  const { user } = useAuth();
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary ">
        <HandCoins className="h-4 w-4 text-green-950" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold ">
          {companyName.toUpperCase()}
        </span>
        <Label className="text-xs ">{user?.role}</Label>
      </div>
    </div>
  );
}

export function PostSidebarLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <Wrench className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">Crumb Code</span>
        <span className="text-xs text-gray-500">Post Panel</span>
      </div>
    </div>
  );
}
