"use client";

import { GetCompanyAdminDashboard } from "@/actions/SuperAdminDashboard";
import { SmallLoadingHorizontialCard } from "@/components/global/LoadingContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminDashboardDTO } from "@/types/res";
import {
  AlertCircle,
  AlertTriangle,
  Box,
  CheckCircle,
  Coins,
  Database,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { QuickActions } from "@/components/superadmin/dashboard/QuickActions";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { formatFileSize } from "@/lib/utils";
import { Notification, NotificationTypes, UserRoles } from "@/types/models";
import { useParams } from "next/navigation";
import CompanyDashboardStatsCard from "./CompanyDashboardStatsCard";

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case NotificationTypes.ERROR:
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case NotificationTypes.WARNING:
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case NotificationTypes.SUCCESS:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

export function CompanyDashboardStats() {
  const [data, setdata] = useState<SuperAdminDashboardDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const companyName = String(params.companyName);

  useEffect(() => {
    const getData = async () => {
      const data = await GetCompanyAdminDashboard({ companyName });

      setdata(data.data);
      setLoading(false);
    };
    getData();
  }, [companyName]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-6">
        <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
          <CompanyDashboardStatsCard
            input={{
              title: "Total Media",
              val: formatFileSize(data?.totalMedia ?? 0),
              icon: Database,
              isLoading: !data,
            }}
          />
          <CompanyDashboardStatsCard
            input={{
              title: "Total Users",
              val: data?.totalUsers ?? 0,
              icon: User,
              isLoading: !data,
            }}
          />
          <CompanyDashboardStatsCard
            input={{
              title: "Total Products",
              val: data?.totalProducts ?? 0,
              icon: Box,
              isLoading: !data,
            }}
          />
          <CompanyDashboardStatsCard
            input={{
              title: "Sales Last Month (FJD)",
              val: data?.totalSales ?? 0,
              icon: Coins,
              isLoading: !data,
            }}
          />
        </RoleWrapper>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className=" pb-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold ">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="space-y-4 grow h-full">
              {loading &&
                Array.from({ length: 4 }, (_, i) => (
                  <SmallLoadingHorizontialCard key={i} />
                ))}

              {data?.notifications &&
                data?.notifications.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(activity.type as NotificationTypes)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm ">
                        <span className="font-medium">
                          {activity.user?.email}
                        </span>
                        {activity.message}
                      </p>
                      <p className="text-xs ">
                        {formatFullDate(activity.createdOn)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <div className="border-t">
            <Link href={`/${companyName}/notifications`}>
              <Button
                variant="ghost"
                className="cursor-pointer w-full justify-center text-xs"
              >
                See All Notifications
              </Button>
            </Link>
          </div>
        </Card>
        <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
          <QuickActions isSuperAdmin={false} />
        </RoleWrapper>
      </div>
    </div>
  );
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
