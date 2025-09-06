"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { PosTerminal, User, UserRoles } from "@/types/models";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/UserContext";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
// import { DeleteCompanyDialoge } from "./DeleteCompaniesDialoge";

export const columns: ColumnDef<PosTerminal>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => {
      return <div className="flex gap-2">{+row.id + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isActive") as boolean;
      return (
        <div
          className={cn(
            "rounded-full w-2 h-2",
            !isDeleted ? "bg-rose-500" : "bg-green-500"
          )}
        />
      );
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
      const { user } = useAuth();

      return (
        <div className="flex gap-2">
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN, UserRoles.ADMIN]}>
            <Button variant={"outline"} asChild className={cn("w-24")}>
              <Link
                href={`pos/${company.uuid}/edit`}
                className={cn("w-24 flex items-center justify-between")}
              >
                Edit
                <Edit className="" />
              </Link>
            </Button>
          </RoleWrapper>
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`pos/${company.uuid}/view`}
              className="w-24 flex items-center justify-between"
            >
              View
              <Edit className="" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
