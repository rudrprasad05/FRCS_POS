"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
    if (++cPage > pagination.totalPages) {
      return;
    }
    setPagination((prev) => ({ ...prev, pageNumber: cPage }));
  };

  const handlePrev = () => {
    let cPage = pagination.pageNumber;
    if (--cPage < 1) {
      return;
    }
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
  if (pagination.totalCount === 0) {
    return;
  }
  return (
    <Pagination className="col-span-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "cursor-pointer",
              disableButton("prev") && "pointer-events-none opacity-50"
            )}
            onClick={() => handlePrev()}
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
            onClick={() => handleNext()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
