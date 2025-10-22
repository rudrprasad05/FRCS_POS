"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { Dispatch, SetStateAction } from "react";

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

  // Generate page numbers to display
  const getPaginationNumbers = (): (number | string)[] => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.pageNumber;
    const delta = 2; // pages to show on each side of current page
    const left = currentPage - delta;
    const right = currentPage + delta;

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Add ellipsis if there's a gap after page 1
    if (left > 2) {
      pages.push("...");
    }

    // Add pages around current page
    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap before last page
    if (right < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page exists)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (pagination.totalCount === 0) return null;

  const pageNumbers = getPaginationNumbers();

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

          {pageNumbers.map((page, i) => (
            <PaginationItem key={i}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className="cursor-pointer"
                  isActive={pagination.pageNumber === page}
                  onClick={() => handleChangePage(page as number)}
                >
                  {page}
                </PaginationLink>
              )}
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
              pageNumber: 1,
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
