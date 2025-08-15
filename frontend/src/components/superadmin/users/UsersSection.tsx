"use client";
import { GetAllCompanies } from "@/actions/Company";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, P } from "@/components/font/HeaderFonts";
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
import { Company, MetaData, User } from "@/types/models";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { columns } from "./CompaniesColumns";
// import { DataTable } from "./CompaniesDataTable";
import NewUserDialoge from "./NewUserDialoge";
import { GetAllAdmins } from "@/actions/User";
import { columns } from "./UserColumns";
import { UserDataProvider, useUsers } from "@/context/UserDataContext";
import { DataTable } from "@/components/global/DataTable";

export default function CompanySection() {
  return (
    <UserDataProvider>
      <Header />
      <HandleDataSection />
    </UserDataProvider>
  );
}

function Header() {
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Users</H1>
        <P className="text-muted-foreground">Create and manage user accounts</P>
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

        <NewUserDialoge />
      </div>
    </div>
  );
}
function HandleDataSection() {
  const { users, loading, pagination, setPagination } = useUsers();

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!users) {
    return <>Invalid URL</>;
  }

  return (
    <>
      <DataTable columns={columns} data={users} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
