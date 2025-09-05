"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type {
  PosSession,
  Product,
  ProductBatch,
  Sale,
  User,
} from "@/types/models";
import { P } from "../font/HeaderFonts";
import { Button } from "../ui/button";
import { Pause, Play, Square, SquarePauseIcon } from "lucide-react";
import ResumeSessionDialoge from "../company/pos/ResumePosSessionDialoge";

export const WarehouseProductBatchColumn: ColumnDef<ProductBatch>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const user = row.getValue("product") as Product;
      if (!user) return <P>N/A</P>;
      return <P>{user.name}</P>;
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
    header: "Expiry",
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
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <div className="flex gap-2">
          {isActive && (
            <div className="flex items-center gap-2">
              <Button
                variant={"destructive"}
                className=""
                onClick={() => {
                  // call your stop session logic here
                  console.log("Stopping session:", row.original.id);
                }}
              >
                <Pause />
              </Button>
              <ResumeSessionDialoge uuid={row.original.uuid} />
            </div>
          )}
        </div>
      );
    },
  },
];
