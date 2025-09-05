"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MetaData } from "@/types/models";

interface IPagination {
  pagination: MetaData;
  setPagination: Dispatch<SetStateAction<MetaData>>;
}

export default function PaginationSection({
  pagination,
  setPagination,
}: IPagination) {
  const handleChangePage = (i: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: i }));
  };

  const handleNext = () => {
    let cPage = pagination.pageNumber;
    if (++cPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, pageNumber: cPage }));
  };

  const handlePrev = () => {
    let cPage = pagination.pageNumber;
    if (--cPage < 1) return;
    setPagination((prev) => ({ ...prev, pageNumber: cPage }));
  };

  const disableButton = (t: "next" | "prev"): boolean => {
    switch (t) {
      case "next":
        return pagination.pageNumber === pagination.totalPages;
      case "prev":
        return pagination.pageNumber === 1;
      default:
        return true;
    }
  };

  if (pagination.totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <Pagination className="col-span-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                "cursor-pointer",
                disableButton("prev") && "pointer-events-none opacity-50"
              )}
              onClick={handlePrev}
            />
          </PaginationItem>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                isActive={pagination.pageNumber === i + 1}
                onClick={() => handleChangePage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className={cn(
                "cursor-pointer",
                disableButton("next") && "pointer-events-none opacity-50"
              )}
              onClick={handleNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rows per page:</span>
        <Select
          value={String(pagination.pageSize)}
          onValueChange={(val) =>
            setPagination((prev) => ({
              ...prev,
              pageSize: Number(val),
              pageNumber: 1, // reset to first page when page size changes
            }))
          }
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
