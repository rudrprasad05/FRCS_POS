"use client";
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
import { Search } from "lucide-react";
// import NewCompanyDialoge from "./NewCompanyDialoge";
import { CompanyUserColumns } from "@/components/tables/CompanyUserColumns";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { ESortBy, User } from "@/types/models";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { GetUsersByCompany } from "@/actions/User";
import NewWarehouseDialoge from "../warehouse/NewWarehouseDialoge";

export const { Provider: UserSectionProvider, useGenericData: useUserData } =
  createGenericListDataContext<User>();

export default function UserSection() {
  const param = useParams();
  const companyName = String(param.companyName);
  return (
    <UserSectionProvider
      fetchFn={() =>
        GetUsersByCompany({
          pageNumber: 1,
          pageSize: 10,
          sortBy: ESortBy.DSC,
          companyName: companyName,
        })
      }
    >
      <Header />
      <HandleDataSection />
    </UserSectionProvider>
  );
}

function Header() {
  const router = useRouter();
  useEffect(() => {
    console.log("prefecthed");
    router.prefetch("products/new");
  }, [router]);
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Users</H1>
        <P className="text-muted-foreground">
          Create and manage your user here.
        </P>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input placeholder="Search users..." className="pl-10 " />
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
        <NewWarehouseDialoge />
      </div>
    </div>
  );
}

function HandleDataSection() {
  const { items, loading, pagination, setPagination } = useUserData();
  const data = items as User[];

  if (loading) {
    return (
      <div className="mt-8">
        <TableSkeleton columns={3} rows={8} showHeader />;
      </div>
    );
  }

  if (!data) {
    return <>Invalid URL</>;
  }

  return (
    <div className="mt-8">
      <DataTable columns={CompanyUserColumns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
