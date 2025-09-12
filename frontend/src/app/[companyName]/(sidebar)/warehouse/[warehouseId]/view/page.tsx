"use client";
import { GetAllBatchesByWarehouse } from "@/actions/ProductBatch";
import { GetOneWarehouseWithBatch } from "@/actions/Warehouse";
import NewSessionDialog from "@/components/company/pos/NewPosSessionDialoge";
import WarehouseInfo from "@/components/company/warehouse/view/WarehouseInfo";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, H2, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
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
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  ESortBy,
  ProductBatchDTO,
  UserRoles,
  type ProductBatch,
  type QueryObject,
  type Warehouse,
} from "@/types/models";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  Box,
  Boxes,
  Building,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export const { Provider: BatchDataProvider, useGenericData: useBatchData } =
  createGenericListDataContext<ProductBatch>();

export default function WarehousePage() {
  const params = useParams();
  const warehouseId = String(params.warehouseId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editWarehouse", warehouseId],
    queryFn: () => GetOneWarehouseWithBatch({ uuid: warehouseId }),
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
      <WarehouseInfo wh={data?.data as Warehouse} />
      <BatchesSection />
    </div>
  );
}

function BatchesSection() {
  const param = useParams();
  const warehouseId = decodeURIComponent(param.warehouseId as string);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: undefined as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["warehouseBatches", warehouseId, pagination],
    queryFn: () =>
      GetAllBatchesByWarehouse({ ...pagination, uuid: warehouseId }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  useEffect(() => {
    if (
      query.data?.meta?.totalPages &&
      (pagination.pageNumber as number) < query.data.meta.totalPages
    ) {
      queryClient.prefetchQuery({
        queryKey: [
          "warehouseBatches",
          { ...pagination, pageNumber: (pagination.pageNumber as number) + 1 },
        ],
        queryFn: () =>
          GetAllBatchesByWarehouse({
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
          <RoleWrapper allowedRoles={[UserRoles.ADMIN, UserRoles.SUPERADMIN]}>
            <Button asChild>
              <Link href={`batch/new`} className="gap-2">
                <Plus className="h-4 w-4" />
                New Batch
              </Link>
            </Button>
          </RoleWrapper>
        }
      >
        <H1>Warehouses</H1>
        <P className="text-muted-foreground">
          Create and manage your warehouses
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
  query: UseQueryResult<ApiResponse<ProductBatch[]>, Error>;
  pagination: any;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
}) {
  if (query.isLoading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (query.isError) {
    return <div className="text-red-500">Error loading POS terminals.</div>;
  }

  const data = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <DataTable columns={WarehouseProductBatchColumn} data={data} />
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
