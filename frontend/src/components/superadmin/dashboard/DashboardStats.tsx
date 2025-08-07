"use client";

import { GetSuperAdminDashboard } from "@/actions/SuperAdminDashboard";
import { SmallLoadingHorizontialCard } from "@/components/global/LoadingContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminDashboardDTO } from "@/types/res";
import { Box, BuildingIcon, Coins, Database, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardStatsCard from "./DashboardStatsCard";
import { QuickActions } from "./QuickActions";

export function DashboardStats() {
  const [data, setdata] = useState<SuperAdminDashboardDTO>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      const data = await GetSuperAdminDashboard();
      setdata(data.data);
      console.dir(data);
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
            title: "Total Media",
            val: data?.totalMedia ?? 0,
            icon: Database,
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
            title: "Total Products",
            val: data?.totalUsers ?? 0,
            icon: Box,
            isLoading: !data,
          }}
        />
        <DashboardStatsCard
          input={{
            title: "Sales Last Month",
            val: data?.totalUsers ?? 0,
            icon: Coins,
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={activity.user?.email}
                      />
                      <AvatarFallback className="0 text-xs">US</AvatarFallback>
                    </Avatar>
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
