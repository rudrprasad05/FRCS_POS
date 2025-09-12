"use client";

import { GetSuperAdminDashboard } from "@/actions/SuperAdminDashboard";
import { SmallLoadingHorizontialCard } from "@/components/global/LoadingContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notification, NotificationTypes } from "@/types/models";
import { SuperAdminDashboardDTO } from "@/types/res";
import {
  AlertCircle,
  AlertTriangle,
  BuildingIcon,
  CheckCircle,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardStatsCard from "./DashboardStatsCard";
import { QuickActions } from "./QuickActions";

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

export function DashboardStats() {
  const [data, setdata] = useState<SuperAdminDashboardDTO>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      const data = await GetSuperAdminDashboard();
      setdata(data.data);
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardStatsCard
          input={{
            title: "Total Companies",
            val: data?.totalCompanies,
            icon: BuildingIcon,
            isLoading: !data,
          }}
        />
        <DashboardStatsCard
          input={{
            title: "Total Users",
            val: data?.totalUsers ?? 0,
            icon: User,
            isLoading: !data,
          }}
        />
        <DashboardStatsCard
          input={{
            title: "Estimated VAT FJD",
            val: data?.totalVat ?? 0,
            icon: User,
            isLoading: !data,
          }}
        />
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
            <Link href="/admin/notifications">
              <Button
                variant="ghost"
                className="cursor-pointer w-full justify-center text-xs"
              >
                See All Notifications
              </Button>
            </Link>
          </div>
        </Card>
        <QuickActions />
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
