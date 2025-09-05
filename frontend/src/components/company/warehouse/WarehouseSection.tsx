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
import { Header } from "@/components/global/GenericSortableHeader";

export const {
  Provider: WarehouseSectionProvider,
  useGenericData: useWarehouseData,
} = createGenericListDataContext<Warehouse>();

export default function WarehouseSection() {
  const param = useParams();
  const companyName = String(param.companyName);
  return (
    <WarehouseSectionProvider
      fetchFn={(query) =>
        GetAllWarehouses({ ...query, companyName: companyName })
      }
    >
      <Header<Warehouse>
        useHook={useWarehouseData}
        newButton={<NewWarehouseDialoge />}
      >
        <H1>Warehouses</H1>
        <P className="text-muted-foreground">
          Create and manage your warehouses
        </P>
      </Header>
      <HandleDataSection />
    </WarehouseSectionProvider>
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
