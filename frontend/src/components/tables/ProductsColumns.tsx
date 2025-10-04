"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  ImageIcon,
  SquareArrowUpRight,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Product, ProductVariant } from "@/types/models";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Barcode from "react-barcode";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ProductsOnlyColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "isDeleted",
    header: "Active",
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
              href={`products/${company.uuid}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>

          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`products/${company.uuid}/view`}
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

export const ProductsVariantsColumns: ColumnDef<ProductVariant>[] = [
  {
    accessorKey: "isDeleted",
    header: "Active",
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const company = row.original;
      return <CompanyCell company={company} />;
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
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => {
      const company = row.original;
      console.log(company);

      return <HandleBarcode barcode={company.barcode as string} />;
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
    accessorKey: "maxStock",
    header: "Stock",
    cell: ({ row }) => {
      const company = row.original as ProductVariant;

      return (
        <div className="flex gap-2 items-center">
          <div>
            {company.isDeleted && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TriangleAlert className="w-3 h-3 text-red-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <span className="">Product no longer available</span>
                </TooltipContent>
              </Tooltip>
            )}

            {company.maxStock === 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TriangleAlert className="w-3 h-3 text-yellow-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <span className="">Low stock</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div>{company.maxStock}</div>
        </div>
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
      const prodv = row.original;

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`products/${prodv.product.uuid}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>

          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`products/${prodv.product.uuid}/view`}
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
