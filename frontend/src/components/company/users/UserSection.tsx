"use client";
import { GetUsersByCompany } from "@/actions/User";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import NewUserDialoge from "@/components/superadmin/users/NewUserDialoge";
import { columns } from "@/components/superadmin/users/UserColumns";
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
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserSection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: false as boolean | undefined,
    companyName: companyName,
  });

  const query = useQuery({
    queryKey: ["companyUsers", companyName, pagination],
    queryFn: () => GetUsersByCompany({ ...pagination, companyName }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  useEffect(() => {
    if (
      query.data?.meta?.totalPages &&
      (pagination.pageNumber as number) < query.data.meta.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: [
          "products",
          { ...pagination, pageNumber: (pagination.pageNumber as number) + 1 },
        ],
        queryFn: () =>
          GetUsersByCompany({
            ...pagination,
            pageNumber: (pagination.pageNumber as number) + 1,
          }),
      });
    }
  }, [query.data, pagination, queryClient]);

  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <NewUserButton />
          </RoleWrapper>
        }
      >
        <H1>Users</H1>
        <P className="text-muted-foreground">
          Create and manage your company users
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
    return <div className="text-red-500">Error loading Users</div>;
  }

  const data = query.data?.data ?? [];

  return (
    <div className="mt-8">
      <DataTable columns={columns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
