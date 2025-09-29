"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { User, UserRoles } from "@/types/models";
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
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

      return (
        <Badge
          variant={
            role.toUpperCase() == UserRoles.ADMIN ? "secondary" : "outline"
          }
        >
          {role}
        </Badge>
      );
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
              <Edit className="" />
            </Link>
          </Button>
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`users/${cake.id}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
