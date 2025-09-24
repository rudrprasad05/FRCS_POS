"use client";
import { GetAllAdmins } from "@/actions/User";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { buttonVariants } from "@/components/ui/button";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  ESortBy,
  QueryObject,
  User,
  UserRoles,
} from "@/types/models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import NewUserDialoge from "./NewUserDialoge";
import { columns } from "./UserColumns";

export default function UsersSection() {
  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["adminUsers", pagination],
    queryFn: () => GetAllAdmins({ ...pagination }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <NewUserButton />
          </RoleWrapper>
        }
      >
        <H1>Users</H1>
        <P className="text-muted-foreground">Create and manage your users</P>
      </Header>

      <HandleDataSection
        query={query}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
  );
}

function NewUserButton() {
  return (
    <NewUserDialoge>
      <div
        className={`${buttonVariants({
          variant: "default",
        })} w-full text-start justify-start px-2 my-2`}
      >
        <UserPlus />
        New User
      </div>
    </NewUserDialoge>
  );
}

function HandleDataSection({
  query,
  pagination,
  setPagination,
}: {
  query: UseQueryResult<ApiResponse<User[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading users.</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;

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
