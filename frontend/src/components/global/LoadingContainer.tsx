import { Loader2 } from "lucide-react";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LoadingContainer() {
  return (
    <div className="w-full h-48 rounded-lg grid place-items-center">
      <div className="text-center text-sm">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="flex flex-col space-y-3  bg-white rounded-lg">
      <Skeleton className="h-full aspect-square w-full rounded-t-xl rounded-b-none bg-gray-300" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-full  bg-gray-300" />
        <Skeleton className="h-4 w-full  bg-gray-300" />
        <Skeleton className="h-4 w-3/5  bg-gray-300" />
      </div>
    </div>
  );
}

export function SmallMediaLoadingCard() {
  return (
    <div className="flex flex-col space-y-3  bg-white rounded-lg">
      <Skeleton className="h-full aspect-square w-full rounded-t-xl rounded-b-none bg-gray-300" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-2 w-full  bg-gray-300" />
      </div>
    </div>
  );
}

export function LoadingHorizontialCard() {
  return (
    <div className="flex gap-4 my-4">
      <div>
        <Skeleton className="h-8 rounded-full w-8  bg-gray-300" />
      </div>
      <div className="grow flex flex-col gap-2">
        <Skeleton className="h-4  bg-gray-300" />
        <Skeleton className="h-4  bg-gray-300" />
        <Skeleton className="h-4 w-3/5  bg-gray-300" />
      </div>
    </div>
  );
}

export function SmallLoadingHorizontialCard() {
  return (
    <div className="flex gap-4 my-4">
      <div>
        <Skeleton className="h-6 rounded-full w-6  bg-gray-300" />
      </div>
      <div className="grow flex flex-col gap-2">
        <Skeleton className="h-3  bg-gray-300" />
        <Skeleton className="h-3 w-3/5  bg-gray-300" />
      </div>
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <Table>
      {showHeader && (
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="py-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton
                  className={`h-4 ${
                    colIndex === 0
                      ? "w-[120px]"
                      : colIndex === 1
                      ? "w-[80px]"
                      : colIndex === 2
                      ? "w-[100px]"
                      : "w-[90px]"
                  }`}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
