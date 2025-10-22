"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "@/types/models";
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "isDeleted",
    header: "Active",
    size: 10,
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      return (
        <div className="w-12">
          <div
            className={cn(
              "rounded-full w-2 h-2 mx-auto",
              isDeleted ? "bg-rose-500" : "bg-green-500"
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
      const cake = row.original; // Get the entire row data (of type CakeType)

      return <div className="flex gap-2">{cake.username}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      if (!role || role.trim().length == 0) {
        return <>-</>;
      }

      return <Badge variant={"outline"}>{role}</Badge>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const cake = row.original;
      return <div className="flex gap-2">{cake.email}</div>;
    },
  },

  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => {
      console.log(row.getValue("createdOn"));
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
      const cake = row.original; // Get the entire row data (of type CakeType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`users/${cake.id}/view`}
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
