"use client";

import { Button } from "@/components/ui/button";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { cn } from "@/lib/utils";
import { PosTerminal, User, UserRoles } from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<PosTerminal>[] = [
  {
    accessorKey: "isActive",
    header: "Active",
    size: 10,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="w-12">
          <div
            className={cn(
              "rounded-full w-2 h-2 mx-auto",
              !isActive ? "bg-rose-500" : "bg-green-500"
            )}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "lastUsedBy",
    header: "Last Used By",
    cell: ({ row }) => {
      const user = row.getValue("lastUsedBy") as User;

      if (user) return <div>{user.username}</div>;

      return <div>N/A</div>;
    },
  },
  {
    accessorKey: "totalSales",
    header: "Total Sales",
    cell: ({ row }) => {
      const totalSales = row.getValue("totalSales") as number;

      return <div>${totalSales.toFixed(2)}</div>;
    },
  },

  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdOn"));
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original;

      return (
        <div className="flex gap-2">
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN, UserRoles.ADMIN]}>
            <Button variant={"outline"} asChild className={cn("")}>
              <Link
                href={`pos/${company.uuid}/edit`}
                className={cn(" flex items-center justify-between")}
              >
                Edit
                <Edit className="" />
              </Link>
            </Button>
          </RoleWrapper>
          <Button variant={"outline"} asChild className="">
            <Link
              href={`pos/${company.uuid}/view`}
              className=" flex items-center justify-between"
            >
              View
              <Eye className="" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
