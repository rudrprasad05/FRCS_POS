"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESortBy, QueryObject, UserRoles } from "@/types/models";
import { RefreshCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

type HeaderProps = {
  children: React.ReactNode;
  newButton?: React.ReactElement;
  pagination: QueryObject;
  setPagination: React.Dispatch<React.SetStateAction<QueryObject>>;
  showRoleFiler?: boolean;
};

export function Header({
  children,
  newButton,
  pagination,
  setPagination,
  showRoleFiler,
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const NewButton = newButton;

  // ✅ sync search param → local + pagination
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearch(urlSearch);
    if (urlSearch) {
      setPagination((prev) => ({ ...prev, pageNumber: 1, search: urlSearch }));
    }
  }, [searchParams, setPagination]);

  const handleSearch = useCallback(() => {
    const trimmed = search.trim();
    router.push(`?search=${encodeURIComponent(trimmed)}`, { scroll: false });
    setPagination((prev) => ({ ...prev, pageNumber: 1, search: trimmed }));
  }, [search, router, setPagination]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterReset = () => {
    router.push("?");
    setSearch("");
    setPagination({
      pageNumber: 1,
      pageSize: pagination.pageSize,
      search: "",
      sortBy: ESortBy.DSC,
      isDeleted: undefined,
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-4">{children}</div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              value={search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select
            value={pagination.sortBy ?? ESortBy.DSC}
            onValueChange={(value) => {
              setPagination({
                ...pagination,
                sortBy: value as ESortBy,
                pageNumber: 1,
              });
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ESortBy.ASC}>Oldest First</SelectItem>
              <SelectItem value={ESortBy.DSC}>Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Deleted filter */}
          <Select
            value={
              pagination.isDeleted === undefined
                ? "all"
                : pagination.isDeleted
                ? "deleted"
                : "active"
            }
            onValueChange={(value) => {
              setPagination({
                ...pagination,
                isDeleted:
                  value === "all"
                    ? undefined
                    : value === "deleted"
                    ? true
                    : false,
                pageNumber: 1,
              });
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          {showRoleFiler && (
            <Select
              value={pagination.role ?? UserRoles.USER}
              onValueChange={(value) => {
                setPagination({
                  ...pagination,
                  role: value as UserRoles,
                  pageNumber: 1,
                });
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRoles.USER}>All</SelectItem>
                <SelectItem value={UserRoles.SUPERADMIN}>Superadmin</SelectItem>
                <SelectItem value={UserRoles.ADMIN}>Admins</SelectItem>
                <SelectItem value={UserRoles.CASHIER}>Cashier</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Reset */}
          <Button
            variant="outline"
            onClick={handleFilterReset}
            disabled={
              !pagination.search &&
              !pagination.isDeleted &&
              pagination.sortBy === ESortBy.DSC
            }
          >
            <RefreshCcw />
          </Button>

          <div className="ml-auto">{NewButton}</div>
        </div>
      </div>
    </div>
  );
}
