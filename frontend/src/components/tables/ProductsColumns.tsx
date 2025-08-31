"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, ImageIcon } from "lucide-react";

import { Product } from "@/types/models";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const ProductsOnlyColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const company = row.original;
      const [isImageValid, setIsImageValid] = useState(true);
      const [isImageLoaded, setIsImageLoaded] = useState(false);

      console.log(company);

      return (
        <div className="relative object-cover aspect-square h-16 w-full rounded-t-lg overflow-hidden">
          {isImageValid ? (
            <>
              <Image
                width={100}
                height={100}
                src={company.media?.url as string}
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  setIsImageValid(false);
                }}
                onLoad={() => setIsImageLoaded(true)}
                alt={"image"}
                className={cn(
                  "w-full h-full object-cover",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
              {!isImageLoaded && (
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-full object-cover  animate-pulse"
                  )}
                ></div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center ">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const company = row.original;

      return <div className="flex gap-2">{company.name}</div>;
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      const company = row.original;

      return <div className="flex gap-2">{company.sku}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const company = row.original;

      return <div className="flex gap-2">{company.price}</div>;
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
      const company = row.original;

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
