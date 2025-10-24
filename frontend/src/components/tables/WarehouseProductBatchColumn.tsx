"use client";
import { cn } from "@/lib/utils";
import type { ProductBatch, ProductVariant } from "@/types/models";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { P } from "../font/HeaderFonts";

export const WarehouseProductBatchColumn: ColumnDef<ProductBatch>[] = [
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
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const pv = row.original.product as ProductVariant;

      if (!pv) return <P>N/A</P>;
      return <P>{pv.name}</P>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const user = row.getValue("quantity") as number;
      if (!user) return <P>N/A</P>;
      return <P>{user}</P>;
    },
  },

  {
    accessorKey: "expiryDate",
    header: "Expire Date",
    cell: ({ row }) => {
      const expiry = row.getValue("expiryDate") as string | null | undefined;
      if (!expiry) return <P>N/A</P>;

      // Convert to Date object
      const date = new Date(expiry);

      // Format nicely
      const formatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return <P>{formatted}</P>;
    },
  },

  {
    accessorKey: "expiryDate",
    header: "Expires In",
    cell: ({ row }) => {
      const expiry = row.getValue("expiryDate") as string | null | undefined;
      if (!expiry) return <P>N/A</P>;

      const now = new Date();
      const expiryDate = new Date(expiry);

      // time difference in ms
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        return <P className="text-red-600 font-semibold">Expired</P>;
      }

      // calculate days/hours left
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const diffHours = diffMs / (1000 * 60 * 60);

      let text = "";
      let colorClass = "text-green-600"; // default (safe)

      if (diffDays < 1) {
        text = `${Math.floor(diffHours)}h left`;
        colorClass = "text-red-600 font-semibold";
      } else if (diffDays <= 5) {
        text = `${Math.floor(diffDays)}d left`;
        colorClass = "text-orange-500 font-semibold";
      } else {
        text = `${Math.floor(diffDays)}d left`;
        colorClass = "text-green-600";
      }

      return <P className={colorClass}>{text}</P>;
    },
  },
  {
    accessorKey: "recievedDate",
    header: "Arrival Date",
    cell: ({ row }) => {
      const expiry = row.getValue("recievedDate") as string | null | undefined;
      if (!expiry) return <P>N/A</P>;

      // Convert to Date object
      const date = new Date(expiry);

      // Format nicely
      const formatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return <P>{formatted}</P>;
    },
  },
  {
    accessorKey: "recievedDate",
    header: "Arrives In",
    cell: ({ row }) => {
      const expiry = row.getValue("recievedDate") as string | null | undefined;
      if (!expiry) return <P>N/A</P>;

      const now = new Date();
      const expiryDate = new Date(expiry);

      // time difference in ms
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        return <P className="text-green-600 font-semibold">Arrived</P>;
      }

      // calculate days/hours left
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const diffHours = diffMs / (1000 * 60 * 60);

      let text = "";
      let colorClass = "text-green-600"; // default (safe)

      if (diffDays < 1) {
        text = `${Math.floor(diffHours)}h left`;
        colorClass = "text-green-600 font-semibold";
      } else if (diffDays <= 5) {
        text = `${Math.floor(diffDays)}d left`;
        colorClass = "text-orange-500 font-semibold";
      } else {
        text = `${Math.floor(diffDays)}d left`;
        colorClass = "text-red-600";
      }

      return <P className={colorClass}>{text}</P>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pb = row.original;

      return <ProductLink pb={pb} />;
    },
  },
];

const ProductLink = ({ pb }: { pb: ProductBatch }) => {
  const params = useParams();
  const companyName = String(params.companyName);
  const warehouseId = String(params.warehouseId);
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <Link
          href={`/${companyName}/warehouse/${warehouseId}/batch/${pb.uuid}/edit`}
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
