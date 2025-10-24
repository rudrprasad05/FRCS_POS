"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { PosTerminal } from "@/types/models";

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
];
