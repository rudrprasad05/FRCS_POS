"use client";
import { Button } from "@/components/ui/button";
import type { Sale } from "@/types/models";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

export const PosTerminalSalesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id",
    header: "Sale ID",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "FJD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "taxTotal",
    header: "Tax",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("taxTotal"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "FJD",
      }).format(amount);
      return formatted;
    },
  },

  {
    accessorKey: "createdOn",
    header: "Date & Time",
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
      const sale = row.original;

      return <ViewBtn uuid={sale.uuid} />;
    },
  },
];

const ViewBtn = ({ uuid }: { uuid: string }) => {
  const params = useParams();
  const companyName = String(params.companyName);
  return (
    <div className="flex gap-2">
      <Button variant={"outline"} asChild className="w-24">
        <Link
          href={`/${companyName}/sales/${uuid}/view`}
          className="w-24 flex items-center justify-between"
        >
          View
          <Eye className="" />
        </Link>
      </Button>
    </div>
  );
};
