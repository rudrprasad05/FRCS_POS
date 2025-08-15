"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { PosTerminal, User } from "@/types/models";
import Link from "next/link";
// import { DeleteCompanyDialoge } from "./DeleteCompaniesDialoge";

export const columns: ColumnDef<PosTerminal>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => {
      return <div className="flex gap-2">{+row.id + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
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
            <Link href="/" className="w-24 flex items-center justify-between">
              Edit
              <Edit className="" />
            </Link>
          </Button>
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`pos/${company.uuid}`}
              className="w-24 flex items-center justify-between"
            >
              View
              <Edit className="" />
            </Link>
          </Button>
          {/* <DeleteCompanyDialoge data={company} /> */}
          {/* <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/${encodeURI(company.name)}`}
              className="w-24 flex items-center justify-between"
            >
              View
              <Eye className="" />
            </Link>
          </Button> */}
        </div>
      );
    },
  },
];
