"use client";

import { Badge } from "@/components/ui/badge";
import { TaxCategory, UserRoles } from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { RoleWrapper } from "../wrapper/RoleWrapper";

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
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const tax = row.original;

      return (
        <div className="flex gap-2">
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <Button variant={"outline"} asChild className={"w-24"}>
              <Link
                href={`/admin/tax/${tax.uuid}/edit`}
                className="w-24 flex items-center justify-between"
              >
                Edit
                <Edit className="" />
              </Link>
            </Button>
          </RoleWrapper>
        </div>
      );
    },
  },
];
