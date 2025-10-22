"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, SquareArrowUpRight, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Product, ProductVariant, UserRoles } from "@/types/models";
import Link from "next/link";
import Barcode from "react-barcode";
import { TableImageCell } from "../global/TableImageCell";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { RoleWrapper } from "../wrapper/RoleWrapper";

export const ProductsOnlyColumns: ColumnDef<Product>[] = [
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
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <Button variant={"outline"} asChild className="">
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
          </RoleWrapper>
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <div>-</div>
          </RoleWrapper>
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
      const pv = row.original;
      return <TableImageCell media={pv.media ?? undefined} />;
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

      return <HandleBarcode barcode={company.barcode as string} />;
    },
  },
  {
    accessorKey: "product.supplier.code",
    header: "Supplier",
    cell: ({ row }) => {
      const company = row.original;
      return <div>{company.supplier?.code}</div>;
    },
  },
  {
    accessorKey: "product.tax.ratePercent",
    header: "Tax",
    cell: ({ row }) => {
      const company = row.original;
      return <div>{company.taxCategory?.ratePercent}%</div>;
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
          <Button variant={"outline"} asChild className="">
            <Link
              href={`products/${prodv.product.uuid}/edit`}
              className=" flex items-center justify-between"
            >
              <Edit className="" />
            </Link>
          </Button>

          <Button variant={"outline"} asChild className="">
            <Link
              href={`products/${prodv.product.uuid}/view`}
              className=" flex items-center justify-between"
            >
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
      <div className="border-2 border-dashed rounded-sm p-1 text-xs text-center text-muted-foreground">
        Invalid
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline mx-auto flex items-center gap-1">
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
