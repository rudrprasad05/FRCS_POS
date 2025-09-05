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
import { Company, ESortBy } from "@/types/models";
import { Search } from "lucide-react";
import { CompanyOnlyColumn } from "../../tables/CompaniesColumns";
import NewCompanyDialoge from "./NewCompanyDialoge";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/global/GenericSortableHeader";

export const { Provider: CompanyDataProvider, useGenericData: useCompanyData } =
  createGenericListDataContext<Company>();

export default function CompanySection() {
  return (
    <CompanyDataProvider fetchFn={(query) => GetAllCompanies(query)}>
      <Header<Company>
        useHook={useCompanyData}
        newButton={<NewCompanyDialoge />}
      >
        <H1>Companies</H1>
        <P className="text-muted-foreground">Create and manage companies</P>
      </Header>

      <HandleDataSection />
    </CompanyDataProvider>
  );
}

function HandleDataSection() {
  const { items, loading, pagination, setPagination } = useCompanyData();
  const data = items as Company[];

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!data) {
    return <>Invalid URL</>;
  }

  return (
    <>
      <DataTable columns={CompanyOnlyColumn} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
