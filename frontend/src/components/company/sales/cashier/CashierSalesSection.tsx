"use client";
import { GetSaleByCompany } from "@/actions/Sale";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { ApiResponse, ESortBy, QueryObject, Sale } from "@/types/models";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PosTerminalCashierSalesColumns } from "./PosTerminalCashierSalesColumns";

export default function CashierSalesSection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["sales", companyName, pagination],
    queryFn: () => GetSaleByCompany({ ...pagination, companyName }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  useEffect(() => {
    if (
      query.data?.meta?.totalPages &&
      (pagination.pageNumber as number) < query.data.meta.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: [
          "products",
          { ...pagination, pageNumber: (pagination.pageNumber as number) + 1 },
        ],
        queryFn: () =>
          GetSaleByCompany({
            ...pagination,
            pageNumber: (pagination.pageNumber as number) + 1,
          }),
      });
    }
  }, [query.data, pagination, queryClient]);

  return (
    <>
      <Header pagination={pagination} setPagination={setPagination}>
        <H1>Sales</H1>
        <P className="text-muted-foreground">View your sales</P>
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
  query: UseQueryResult<ApiResponse<Sale[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading sales.</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <DataTable columns={PosTerminalCashierSalesColumns} data={data} />
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
