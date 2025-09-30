"use client";

import { GetAllTaxCategories } from "@/actions/Tax";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  ESortBy,
  QueryObject,
  TaxCategory,
  UserRoles,
} from "@/types/models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { TaxOnlyColumn } from "../../tables/TaxColumns";
import NewTaxCategoryDialoge from "./NewTaxCategoryDialoge";

export const { Provider: TaxDataProvider, useGenericData: useTaxData } =
  createGenericListDataContext<TaxCategory>();

export default function TaxSection() {
  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["adminTax", pagination],
    queryFn: () => GetAllTaxCategories({ ...pagination }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <NewTaxCategoryDialoge />
          </RoleWrapper>
        }
      >
        <H1>Tax Categories</H1>
        <P className="text-muted-foreground">
          Create and manage tax rates for all companies
        </P>
      </Header>

      <HandleDataSection
        query={query}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
  );
}

function HandleDataSection({
  query,
  pagination,
  setPagination,
}: {
  query: UseQueryResult<ApiResponse<TaxCategory[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading tax categories.</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;
  return (
    <>
      <DataTable columns={TaxOnlyColumn} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={{
            ...pagination,
            totalCount: meta?.totalCount ?? 0,
            totalPages: meta?.totalPages ?? 0,
          }}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
