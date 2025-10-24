"use client";
import { GetAllWarehouses } from "@/actions/Warehouse";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { WarehouseOnlyColumns } from "@/components/tables/WarehouseColumns";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";

import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  ESortBy,
  QueryObject,
  UserRoles,
  Warehouse,
} from "@/types/models";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewWarehouseDialoge from "./NewWarehouseDialoge";

export default function WarehouseSection() {
  const param = useParams();
  const companyName = decodeURIComponent(param.companyName as string);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: false as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["warehouse", companyName, pagination],
    queryFn: () => GetAllWarehouses({ ...pagination, companyName }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  useEffect(() => {
    if (
      query.data?.meta?.totalPages &&
      (pagination.pageNumber as number) < query.data.meta.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: [
          "warehouse",
          { ...pagination, pageNumber: (pagination.pageNumber as number) + 1 },
        ],
        queryFn: () =>
          GetAllWarehouses({
            ...pagination,
            pageNumber: (pagination.pageNumber as number) + 1,
          }),
      });
    }
  }, [query.data, pagination, queryClient]);

  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <NewWarehouseDialoge />
          </RoleWrapper>
        }
      >
        <H1>Warehouses</H1>
        <P className="text-muted-foreground">
          Create and manage your warehouses
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
  query: UseQueryResult<ApiResponse<Warehouse[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading POS terminals.</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <DataTable columns={WarehouseOnlyColumns} data={data} />
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
