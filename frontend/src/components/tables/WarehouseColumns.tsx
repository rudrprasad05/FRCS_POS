"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserRoles, Warehouse } from "@/types/models";
import Link from "next/link";
import { RoleWrapper } from "../wrapper/RoleWrapper";

export const WarehouseOnlyColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      return (
        <div
          className={cn(
            "rounded-full w-2 h-2 mx-auto",
            isDeleted ? "bg-rose-500" : "bg-green-500"
          )}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div>{company.location}</div>;
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
            <Button variant={"outline"} asChild className="w-24">
              <Link
                prefetch
                href={`warehouse/${company.uuid}/edit`}
                className="w-24 flex items-center justify-between"
              >
                Edit
                <Edit className="" />
              </Link>
            </Button>

            <Button variant={"outline"} asChild className="w-24">
              <Link
                prefetch
                href={`warehouse/${company.uuid}/view`}
                className="w-24 flex items-center justify-between"
              >
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
