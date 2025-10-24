"use client";

import { GetAllNotificationsAdmin } from "@/actions/Notifications";
// import { GetAllNotificationsSuperAdmin } from "@/actions/Notifications";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { NotificationColumns } from "@/components/tables/NotificationTables";
import { useAuth } from "@/context/UserContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  Notification as AppNotification,
  ESortBy,
  QueryObject,
  UserRoles,
} from "@/types/models";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function NotificationSection() {
  const params = useParams();
  const { user } = useAuth();
  const companyName = decodeURIComponent(params.companyName as string);
  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: ESortBy.DSC,
    role: UserRoles.ADMIN,
    companyName,
    uuid: user?.id,
  });

  const query = useQuery<ApiResponse<AppNotification[]>, Error>({
    queryKey: ["adminNotifications", pagination],
    queryFn: () => GetAllNotificationsAdmin({ ...pagination }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  return (
    <>
      <Header pagination={pagination} setPagination={setPagination}>
        <H1>Notifications</H1>
        <P className="text-muted-foreground">
          View and manage your notifications
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
  query: UseQueryResult<ApiResponse<AppNotification[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading notifications</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;
  return (
    <>
      <DataTable columns={NotificationColumns} data={data} />
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
