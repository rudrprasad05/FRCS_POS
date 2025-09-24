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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div>{company.isActive}</div>;
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
          </RoleWrapper>

          <Button variant={"outline"} asChild className="w-24">
            <Link href={`/admin/companies/${company.uuid}`}>
              View
              <Eye className="" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
