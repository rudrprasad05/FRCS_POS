"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

import { Company, CompanyUser, User, Warehouse } from "@/types/models";
import Link from "next/link";
import { DeleteCompanyDialoge } from "../superadmin/companies/DeleteCompaniesDialoge";

export const WarehouseOnlyColumns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div>{company.location}</div>;
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
              href={`/admin/companies/${company.uuid}`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>
          {/* <DeleteCompanyDialoge data={company} /> */}
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/${encodeURI(company.name)}`}
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
