"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { PosSession, Sale, User } from "@/types/models";
import { P } from "../font/HeaderFonts";
import { Button } from "../ui/button";
import { Pause, Play, Square, SquarePauseIcon } from "lucide-react";
import ResumeSessionDialoge from "../company/pos/ResumePosSessionDialoge";

export const PosSessionColumns: ColumnDef<PosSession>[] = [
  {
    accessorKey: "id",
    header: "Session ID",
  },
  {
    accessorKey: "createdOn",
    header: "Start Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdOn"));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) => {
      const endTime = row.getValue("isActive");
      if (endTime) return <Badge variant="secondary">Active</Badge>;
      return <Badge variant="destructive">Inactive</Badge>;
    },
  },
  //   {
  //     accessorKey: "posUser",
  //     header: "Operator",
  //     cell: ({ row }) => {
  //       const user = row.getValue("posUser") as User;
  //       if (!user) return <P>N/A</P>;
  //       return <P>{user.email}</P>;
  //     },
  //   },
  //   {
  //     accessorKey: "sales",
  //     header: "Total Sales",
  //     cell: ({ row }) => {
  //       const sales = row.getValue("sales") as Sale[];
  //       let amount = 0;
  //       sales.forEach((s) => {
  //         amount += s.total;
  //       });
  //       const formatted = new Intl.NumberFormat("en-US", {
  //         style: "currency",
  //         currency: "USD",
  //       }).format(amount);
  //       return formatted;
  //     },
  //   },
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
