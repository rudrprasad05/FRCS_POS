"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { Warehouse } from "@/types/models";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const WarehouseOnlyColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive; // Get the entire row data (of type companyType)

      return (
        <div
          className={cn(
            "rounded-full w-3 h-3 ml-4",
            isActive ? "bg-green-500" : "bg-rose-500"
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
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          {/* <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`warehouse/${company.uuid}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button> */}
          {/* <DeleteCompanyDialoge data={company} /> */}
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`warehouse/${company.uuid}`}
              className="w-24 flex items-center justify-between"
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
