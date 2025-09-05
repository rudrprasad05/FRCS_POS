"use client";
import NoDataContainer from "@/components/containers/NoDataContainer";
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
import { HousePlus, PackagePlus, Search } from "lucide-react";
// import NewCompanyDialoge from "./NewCompanyDialoge";
import { GetAllProducts } from "@/actions/Product";
import { ProductsOnlyColumns } from "@/components/tables/ProductsColumns";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import { ESortBy, Product } from "@/types/models";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/global/GenericSortableHeader";

export const {
  Provider: CompanyProductsSectionProvider,
  useGenericData: useCompanyProductData,
} = createGenericListDataContext<Product>();

export default function CompanySection() {
  return (
    <CompanyProductsSectionProvider fetchFn={(query) => GetAllProducts(query)}>
      <Header<Product>
        useHook={useCompanyProductData}
        newButton={<NewButton />}
      >
        <H1>Products</H1>
        <P className="text-muted-foreground">Create and manage your products</P>
      </Header>

      <HandleDataSection />
    </CompanyProductsSectionProvider>
  );
}

function NewButton() {
  return (
    <Button
      asChild
      className={`${buttonVariants({
        variant: "default",
      })} text-start justify-start px-2 my-2`}
    >
      <Link href="products/new">
        <PackagePlus />
        New Product
      </Link>
    </Button>
  );
}

function HandleDataSection() {
  const { items, loading, pagination, setPagination } = useCompanyProductData();
  const data = items as Product[];

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
      <DataTable columns={ProductsOnlyColumns} data={data} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
