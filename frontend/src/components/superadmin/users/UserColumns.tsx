"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Company, User, UserRoles } from "@/types/models";
import { Badge } from "@/components/ui/badge";

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
      console.log(role);

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
