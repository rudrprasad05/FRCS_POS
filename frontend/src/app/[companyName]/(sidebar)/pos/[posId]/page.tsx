"use client";
import { GetPosTerminalById } from "@/actions/PosTerminal";
import NewSessionDialog from "@/components/company/pos/NewPosSessionDialoge";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, H2, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { PosSessionColumns } from "@/components/tables/PosSessionColumns";
import { PosTerminalSalesColumns } from "@/components/tables/PosTerminalSalesColumns";
import { Badge } from "@/components/ui/badge";
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
import type {
  ApiResponse,
  PosSession,
  PosTerminal,
  QueryObject,
  Sale,
} from "@/types/models";
import { Building, Hash, MapPin, Search } from "lucide-react";
import { use, useEffect, useState } from "react";

export const { Provider: SessionDataProvider, useGenericData: useSessionData } =
  createGenericListDataContext<PosSession>();

export const { Provider: SalesDataProvider, useGenericData: useSalesData } =
  createGenericListDataContext<Sale>();

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const [posTerminal, setPosTerminal] = useState<PosTerminal | null>(null);
  const [loading, setLoading] = useState(true);
  const { posId } = use(params);

  useEffect(() => {
    const fetchPosTerminal = async () => {
      try {
        const terminal = await GetPosTerminalById(posId);
        console.log("fetchPosTerminal", terminal);
        setPosTerminal(terminal.data as PosTerminal);
      } catch (error) {
        console.error("Failed to fetch POS terminal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosTerminal();
  }, [posId]);

  function GetPosTerminalSessionsMock(
    query?: QueryObject
  ): Promise<ApiResponse<PosSession[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let a: ApiResponse<PosSession[]> = {
          ...posTerminal,
          success: true,
          statusCode: 200,
          timestamp: Date.now.toString(),
          data: posTerminal?.session as PosSession[],
        };
        console.log(a);
        resolve(a);
      }, 0);
    });
  }

  function GetPosTerminalSalesMock(
    query?: QueryObject
  ): Promise<ApiResponse<Sale[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let a: ApiResponse<Sale[]> = {
          ...posTerminal,
          success: true,
          statusCode: 200,
          timestamp: Date.now.toString(),
          data: posTerminal?.sales as Sale[],
        };
        resolve(a);
      }, 0);
    });
  }

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showHeader />;
  }

  return (
    <div className="space-y-6">
      <PosTerminalInfo posTerminal={posTerminal} />

      <SessionDataProvider
        fetchFn={() =>
          GetPosTerminalSessionsMock({
            pageNumber: 1,
            pageSize: 10,
          })
        }
      >
        <SalesDataProvider
          fetchFn={() =>
            GetPosTerminalSalesMock({
              pageNumber: 1,
              pageSize: 10,
            })
          }
        >
          <PosTerminalDataTabs terminalId={posId} />
        </SalesDataProvider>
      </SessionDataProvider>
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
            <Badge variant={posTerminal.isActive ? "default" : "secondary"}>
              {posTerminal.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

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
        <SessionsSection />
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <SalesSection />
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
