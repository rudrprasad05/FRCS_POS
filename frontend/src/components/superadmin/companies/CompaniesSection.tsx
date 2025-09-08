"use client";
import { GetAllCompanies } from "@/actions/Company";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createGenericListDataContext,
  GenericListDataContextType,
} from "@/context/GenericDataTableContext";
import {
  ApiResponse,
  Company,
  ESortBy,
  QueryObject,
  UserRoles,
} from "@/types/models";
import { Search } from "lucide-react";
import { CompanyOnlyColumn } from "../../tables/CompaniesColumns";
import NewCompanyDialoge from "./NewCompanyDialoge";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Header } from "@/components/global/TestHeader";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";

export const { Provider: CompanyDataProvider, useGenericData: useCompanyData } =
  createGenericListDataContext<Company>();

export default function CompanySection() {
  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["adminCompanies", pagination],
    queryFn: () => GetAllCompanies({ ...pagination }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <NewCompanyDialoge />
          </RoleWrapper>
        }
      >
        <H1>Companies</H1>
        <P className="text-muted-foreground">Create and manage the companies</P>
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
  query: UseQueryResult<ApiResponse<Company[]>, Error>;
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
      <DataTable columns={CompanyOnlyColumn} data={data} />
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
