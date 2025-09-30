"use client";

import { Badge } from "@/components/ui/badge";
import { TaxCategory } from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";

export const TaxOnlyColumn: ColumnDef<TaxCategory>[] = [
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted");
      if (!isDeleted) return <Badge variant="secondary">Active</Badge>;
      return <Badge variant="destructive">Inactive</Badge>;
    },
  },
  {
    accessorKey: "name",
    header: "Tax Name",
  },
  {
    accessorKey: "ratePercent",
    header: "Rate (%)",
  },
];
