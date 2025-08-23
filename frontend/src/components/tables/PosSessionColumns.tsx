"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { PosSession } from "@/types/models";

export const PosSessionColumns: ColumnDef<PosSession>[] = [
  {
    accessorKey: "id",
    header: "Session ID",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startTime"));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.getValue("endTime");
      if (!endTime) return <Badge variant="secondary">Active</Badge>;
      const date = new Date(endTime as string);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "operator",
    header: "Operator",
  },
  {
    accessorKey: "totalSales",
    header: "Total Sales",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalSales"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
];
