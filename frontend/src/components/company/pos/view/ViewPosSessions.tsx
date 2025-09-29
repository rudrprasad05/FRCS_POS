"use client";
import { GetPosTerminalSessions } from "@/actions/PosTerminal";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { PosSessionColumns } from "@/components/tables/PosSessionColumns";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ESortBy,
  type ApiResponse,
  type PosSession,
  type QueryObject,
} from "@/types/models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SessionsSection() {
  const params = useParams();
  const posId = String(params.posId);

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["getPosSessions", posId, pagination],
    queryFn: () => GetPosTerminalSessions({ ...pagination, uuid: posId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (query.isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (query.error || !query.data?.success || !query.data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  return (
    <>
      <Header pagination={pagination} setPagination={setPagination}>
        <H1>Pos Sessions</H1>
        <P className="text-muted-foreground">Create and manage your sessions</P>
      </Header>

      <HandleSessionDataSection
        query={query}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
  );
}

function HandleSessionDataSection({
  query,
  pagination,
  setPagination,
}: {
  query: UseQueryResult<ApiResponse<PosSession[]>, Error>;
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
      <DataTable columns={PosSessionColumns} data={data} />
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
