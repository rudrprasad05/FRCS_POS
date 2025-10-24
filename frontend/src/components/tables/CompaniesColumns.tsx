"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Company, CompanyUser, User } from "@/types/models";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const CompanyOnlyColumn: ColumnDef<Company>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "adminUser",
    header: "Admin",
    cell: ({ row }) => {
      return (row.getValue("adminUser") as User).email;
    },
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
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
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/admin/companies/${company.uuid}/view`}
              className="w-24 flex items-center justify-between"
            >
              View
              <Eye className="" />
            </Link>
          </Button>
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/admin/companies/${company.uuid}/edit`}
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

export const CompanyUserColumn: ColumnDef<CompanyUser>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div className="flex gap-2">{company.user?.username}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)
      return <div className="flex gap-2">{company.user?.email}</div>;
    },
  },
  {
    accessorKey: "user.role",
    header: "Role",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)
      return (
        <Badge variant={"outline"} className="flex gap-2">
          {company.user?.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
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
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild>
            <Link
              href={`/admin/users/${encodeURI(company.userId)}/view`}
              className="flex items-center justify-between"
            >
              <Eye className="" />
            </Link>
          </Button>
          {/* <RemoveUserFromCompanyDialoge userId={company.userId} /> */}
        </div>
      );
    },
  },
];
