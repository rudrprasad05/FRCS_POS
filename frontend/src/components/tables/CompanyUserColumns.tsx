"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { User, UserRoles } from "@/types/models";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const CompanyUserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",

    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div>{company.email}</div>;
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
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/admin/companies/${company.id}`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>
          {/* <DeleteCompanyDialoge data={company} /> */}
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/${encodeURI(company.id)}`}
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
