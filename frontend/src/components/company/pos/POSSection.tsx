"use client";

import { GetAllCompanyPosTerminals } from "@/actions/PosTerminal";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import {
  ApiResponse,
  ESortBy,
  PosTerminal,
  QueryObject,
  UserRoles,
} from "@/types/models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import NewPosDialoge from "./NewPosDialoge";
import { columns } from "./PosTerminalDataColumns";

export default function POSSection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  // Pagination state (still local, but could also be query params)
  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: false as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["posTerminals", companyName, pagination],
    queryFn: () => GetAllCompanyPosTerminals({ ...pagination, companyName }),
  });

  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <NewPosDialoge companyName={companyName} />
          </RoleWrapper>
        }
      >
        <H1>POS Terminals</H1>
        <P className="text-muted-foreground">
          Create and manage your pos terminals
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
  query: UseQueryResult<ApiResponse<PosTerminal[]>, Error>;
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

  console.log("333", data);

  return (
    <>
      <DataTable columns={columns} data={data} />
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
