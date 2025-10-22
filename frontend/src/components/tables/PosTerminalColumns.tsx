"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { PosTerminal, UserRoles } from "@/types/models";
import Link from "next/link";
import { RoleWrapper } from "../wrapper/RoleWrapper";

export const PosTerminalOnlyColumns: ColumnDef<PosTerminal>[] = [
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
              isActive ? "bg-rose-500" : "bg-green-500"
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
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
    accessorKey: "updatedOn",
    header: "Updated On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedOn"));
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
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <Button variant={"outline"} asChild className={cn("w-24")}>
              <Link
                href={`/admin/companies/${company.uuid}`}
                className="w-24 flex items-center justify-between"
              >
                Edit
                <Edit className="" />
              </Link>
            </Button>

            <Button variant={"outline"} asChild className="w-24">
              <Link href={`/admin/companies/${company.uuid}`}>
                View
                <Eye className="" />
              </Link>
            </Button>
          </RoleWrapper>
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <div>-</div>
          </RoleWrapper>
        </div>
      );
    },
  },
];
