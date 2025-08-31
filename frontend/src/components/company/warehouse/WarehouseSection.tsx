"use client";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackagePlus, Search } from "lucide-react";
// import NewCompanyDialoge from "./NewCompanyDialoge";
import { GetAllWarehouses } from "@/actions/Warehouse";
import { ProductsOnlyColumns } from "@/components/tables/ProductsColumns";
import { Button, buttonVariants } from "@/components/ui/button";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { ESortBy, Product, Warehouse } from "@/types/models";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { WarehouseOnlyColumns } from "@/components/tables/WarehouseColumns";
import NewWarehouseDialoge from "./NewWarehouseDialoge";

export const {
  Provider: WarehouseSectionProvider,
  useGenericData: useWarehouseData,
} = createGenericListDataContext<Warehouse>();

export default function WarehouseSection() {
  const param = useParams();
  const companyName = String(param.companyName);
  return (
    <WarehouseSectionProvider
      fetchFn={() =>
        GetAllWarehouses({
          pageNumber: 1,
          pageSize: 10,
          sortBy: ESortBy.DSC,
          companyName: companyName,
        })
      }
    >
      <Header />
      <HandleDataSection />
    </WarehouseSectionProvider>
  );
}

function Header() {
  const router = useRouter();
  useEffect(() => {
    console.log("prefecthed");
    router.prefetch("products/new");
  }, [router]);
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Warehouses</H1>
        <P className="text-muted-foreground">
          Create and manage your warehouses here
        </P>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input placeholder="Search posts..." className="pl-10 " />
          </div>

          <Select>
            <SelectTrigger className="w-32 ">
              <SelectValue defaultValue={"all"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cake">Cakes</SelectItem>
              <SelectItem value="feature">Features</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32 ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <NewWarehouseDialoge />
      </div>
    </div>
  );
}

function HandleDataSection() {
  const { items, loading, pagination, setPagination } = useWarehouseData();
  const data = items as Warehouse[];

  if (loading) {
    return (
      <div className="mt-8">
        <TableSkeleton columns={3} rows={8} showHeader />;
      </div>
    );
  }

  if (!data) {
    return <>Invalid URL</>;
  }

  return (
    <div className="mt-8">
      <DataTable columns={WarehouseOnlyColumns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
