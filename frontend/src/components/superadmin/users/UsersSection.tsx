"use client";
import { H1, P } from "@/components/font/HeaderFonts";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import {
  ApiResponse,
  ESortBy,
  QueryObject,
  User,
  UserRoles,
} from "@/types/models";
import { GetAllAdmins } from "@/actions/User";
import { DataTable } from "@/components/global/DataTable";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import NewUserDialoge from "./NewUserDialoge";
import { columns } from "./UserColumns";
import { buttonVariants } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useState } from "react";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Header } from "@/components/global/TestHeader";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";

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
