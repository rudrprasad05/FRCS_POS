"use client";
import { GetAllBatchesByWarehouse } from "@/actions/ProductBatch";
import { GetOneWarehouseWithBatch } from "@/actions/Warehouse";
import NewSessionDialog from "@/components/company/pos/NewPosSessionDialoge";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, H2, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { WarehouseProductBatchColumn } from "@/components/tables/WarehouseProductBatchColumn";
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
import type { ProductBatch, Warehouse } from "@/types/models";
import { Box, Boxes, Building, MapPin, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export const { Provider: BatchDataProvider, useGenericData: useBatchData } =
  createGenericListDataContext<ProductBatch>();

type PageProps = {
  params: Promise<{
    companyId: string;
    warehouseId: string;
    sessionId: string;
  }>;
};

export default function WarehousePage({ params }: PageProps) {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const { warehouseId } = use(params);

  useEffect(() => {
    const fetchPosTerminal = async () => {
      try {
        const terminal = await GetOneWarehouseWithBatch({
          uuid: String(warehouseId),
        });
        console.log("GetOneWarehouseWithBatch", terminal);
        setWarehouse(terminal.data as Warehouse);
      } catch (error) {
        console.error("Failed to fetch POS terminal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosTerminal();
  }, [warehouseId]);

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showHeader />;
  }

  return (
    <div className="space-y-6">
      <WarehouseInfo wh={warehouse} />

      <BatchDataProvider
        fetchFn={() =>
          GetAllBatchesByWarehouse({
            pageNumber: 1,
            pageSize: 10,
            uuid: warehouseId,
          })
        }
      >
        <PosTerminalDataTabs terminalId={warehouseId} />
      </BatchDataProvider>
    </div>
  );
}

function WarehouseInfo({ wh }: { wh: Warehouse | null }) {
  if (!wh) {
    return <NoDataContainer />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <H1>{wh.name}</H1>
            <Badge variant={wh.isActive ? "default" : "secondary"}>
              {wh.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <NewSessionDialog terminalId={wh.uuid.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.name || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.location || "Not specified"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Batches
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.batches?.length || "0"}
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
      </TabsList>

      <TabsContent value="sessions" className="space-y-4">
        <BatchesSection />
      </TabsContent>
    </Tabs>
  );
}

function BatchesSection() {
  const params = useParams();
  const warehouseId = String(params.warehouseId);
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <H2>Product Batches</H2>
          <P className="text-muted-foreground">
            View all batches in this warehouse
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
          <Button asChild>
            <Link href={`${warehouseId}/batch/new`} className="gap-2">
              <Plus className="h-4 w-4" />
              New Batch
            </Link>
          </Button>
        </div>
      </div>

      <HandleBatchData />
    </div>
  );
}

function HandleBatchData() {
  const { items, loading, pagination, setPagination } = useBatchData();
  const data = items as ProductBatch[];

  if (loading) {
    return <TableSkeleton columns={4} rows={6} showHeader />;
  }

  return (
    <>
      <DataTable columns={WarehouseProductBatchColumn} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
