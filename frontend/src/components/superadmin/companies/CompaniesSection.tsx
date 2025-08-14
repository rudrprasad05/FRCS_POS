"use client";
import { GetAllCompanies } from "@/actions/Company";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, P } from "@/components/font/HeaderFonts";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company, MetaData } from "@/types/models";
import { HousePlus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./CompaniesColumns";
import { DataTable } from "./CompaniesDataTable";
import NewCompanyDialoge from "./NewCompanyDialoge";
import { createGenericDataContext } from "@/context/GenericDataTableContext";

export const { Provider: CompanyDataProvider, useGenericData: useCompanyData } =
  createGenericDataContext<Company>();

export default function CompanySection() {
  return (
    <CompanyDataProvider
      fetchFn={() =>
        GetAllCompanies({ pageNumber: 1, pageSize: 10 }).then((res) => ({
          data: res.data ?? [],
          meta: res.meta,
        }))
      }
    >
      <Header />
      <HandleDataSection />
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

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!items) {
    return <>Invalid URL</>;
  }
  if (items.length === 0) {
    return <NoDataContainer />;
  }
  return (
    <>
      <DataTable columns={columns} data={items as Company[]} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
