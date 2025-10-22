"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, ImageIcon, SquareArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Supplier } from "@/types/models";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Barcode from "react-barcode";

export const CompanySuppliersColumns: ColumnDef<Supplier>[] = [
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const company = row.original;

      return <div className="flex gap-2">{company.code}</div>;
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
    accessorKey: "taxNumber",
    header: "TIN",
    cell: ({ row }) => {
      const company = row.original;

      return <div className="flex gap-2">{company.taxNumber}</div>;
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
              href={`suppliers/${company.uuid}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>

          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`suppliers/${company.uuid}/view`}
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

export function HandleBarcode({ barcode }: { barcode: string }) {
  if (!barcode || barcode.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-2 text-center text-muted-foreground">
        Invalid
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline flex items-center gap-1">
          {barcode} <SquareArrowUpRight className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center p-6">
        <div className="my-4 border-2 border-dashed rounded-lg p-4 bg-white">
          <Barcode
            value={barcode}
            height={80}
            width={2}
            displayValue={true}
            background="#ffffff"
          />
        </div>
        <p className="text-sm text-muted-foreground">{barcode}</p>
      </DialogContent>
    </Dialog>
  );
}

const CompanyCell = ({ company }: { company: any }) => {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="relative object-cover aspect-square h-16 w-full rounded-md overflow-hidden">
      {isImageValid ? (
        <>
          <Image
            width={100}
            height={100}
            src={company.media?.url as string}
            onError={(e) => {
              e.currentTarget.onerror = null;
              setIsImageValid(false);
            }}
            onLoad={() => setIsImageLoaded(true)}
            alt="image"
            className={cn(
              "w-full h-full object-cover",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {!isImageLoaded && (
            <div className="absolute top-0 left-0 w-full h-full object-cover animate-pulse"></div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center ">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
