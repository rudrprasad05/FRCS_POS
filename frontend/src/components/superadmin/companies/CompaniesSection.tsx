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
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { Company } from "@/types/models";
import { Search } from "lucide-react";
import { CompanyOnlyColumn } from "../../tables/CompaniesColumns";
import NewCompanyDialoge from "./NewCompanyDialoge";

export const { Provider: CompanyDataProvider, useGenericData: useCompanyData } =
  createGenericListDataContext<Company>();

export default function CompanySection() {
  return (
    <CompanyDataProvider
      fetchFn={() => GetAllCompanies({ pageNumber: 1, pageSize: 10 })}
    >
      <CompanyDataProvider
        fetchFn={() => GetAllCompanies({ pageNumber: 1, pageSize: 10 })}
      >
        <Header />
        <HandleDataSection />
      </CompanyDataProvider>
    </CompanyDataProvider>
  );
}

function Header() {
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Companies</H1>
        <P className="text-muted-foreground">Create and manage companies</P>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input placeholder="Search posts..." className="pl-10 " />
          </div>

          <Select>
            <SelectTrigger className="w-32 ">
              <SelectValue defaultValue={"all"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cake">Cakes</SelectItem>
              <SelectItem value="feature">Features</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32 ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <NewCompanyDialoge />
      </div>
    </div>
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
  if (data.length === 0) {
    return <NoDataContainer />;
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
