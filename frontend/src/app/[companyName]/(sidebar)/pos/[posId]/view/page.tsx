"use client";
import {
  GetPosTerminalById,
  GetPosTerminalSales,
  GetPosTerminalSessions,
} from "@/actions/PosTerminal";
import NewSessionDialog from "@/components/company/pos/NewPosSessionDialoge";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, H2, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { PosSessionColumns } from "@/components/tables/PosSessionColumns";
import { PosTerminalSalesColumns } from "@/components/tables/PosTerminalSalesColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import type {
  ApiResponse,
  PosSession,
  PosTerminal,
  QueryObject,
  Sale,
} from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Building, Hash, Loader2, MapPin, PenBox, Search } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export const { Provider: SessionDataProvider, useGenericData: useSessionData } =
  createGenericListDataContext<PosSession>();

export const { Provider: SalesDataProvider, useGenericData: useSalesData } =
  createGenericListDataContext<Sale>();

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const { posId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editTerminal", posId],
    queryFn: () => GetPosTerminalById(posId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  return (
    <div className="space-y-6">
      <PosTerminalInfo posTerminal={data.data} />
      <PosTerminalDataTabs terminalId={posId} />
    </div>
  );
}

function PosTerminalInfo({ posTerminal }: { posTerminal: PosTerminal | null }) {
  if (!posTerminal) {
    return <NoDataContainer />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <H1>{posTerminal.name}</H1>
            <Badge variant={!posTerminal.isActive ? "default" : "secondary"}>
              {!posTerminal.isDeleted ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <Button variant={"secondary"} className="ml-auto mr-2" asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Terminal
          </Link>
        </Button>
        <NewSessionDialog terminalId={posTerminal.uuid.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posTerminal.company?.name || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posTerminal.locationDescription || "Not specified"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serial Number</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posTerminal.serialNumber || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PosTerminalDataTabs({ terminalId }: { terminalId: string }) {
  return (
    <Tabs defaultValue="sessions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="space-y-4">
        <SessionDataProvider
          fetchFn={(query) =>
            GetPosTerminalSessions({ ...query, uuid: terminalId })
          }
        >
          <SessionsSection />
        </SessionDataProvider>
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <SalesDataProvider
          fetchFn={(query) =>
            GetPosTerminalSales({ ...query, uuid: terminalId })
          }
        >
          <SalesSection />
        </SalesDataProvider>
      </TabsContent>
    </Tabs>
  );
}

function SessionsSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <H2>Sessions</H2>
          <P className="text-muted-foreground">
            View all POS terminal sessions
          </P>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input placeholder="Search sessions..." className="pl-10" />
          </div>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <HandleSessionsData />
    </div>
  );
}

function SalesSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <H2>Sales</H2>
          <P className="text-muted-foreground">
            View all sales from this terminal
          </P>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input placeholder="Search sales..." className="pl-10" />
          </div>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <HandleSalesData />
    </div>
  );
}

function HandleSessionsData() {
  const { items, loading, pagination, setPagination } = useSessionData();
  const data = items as PosSession[];

  console.log("HandleSessionsData", items);

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showHeader />;
  }

  if (!data || data.length === 0) {
    return <NoDataContainer />;
  }

  return (
    <>
      <DataTable columns={PosSessionColumns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}

function HandleSalesData() {
  const { items, loading, pagination, setPagination } = useSalesData();
  const data = items as Sale[];

  if (loading) {
    return <TableSkeleton columns={5} rows={6} showHeader />;
  }

  if (!data || data.length === 0) {
    return <NoDataContainer />;
  }

  return (
    <>
      <DataTable columns={PosTerminalSalesColumns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
