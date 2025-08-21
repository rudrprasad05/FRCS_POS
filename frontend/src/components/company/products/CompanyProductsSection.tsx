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
import { Product } from "@/types/models";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const {
  Provider: CompanyProductsSectionProvider,
  useGenericData: useCompanyProductData,
} = createGenericListDataContext<Product>();

export default function CompanySection() {
  return (
    <CompanyProductsSectionProvider
      fetchFn={() => GetAllProducts({ pageNumber: 1, pageSize: 10 })}
    >
      <Header />
      <HandleDataSection />
    </CompanyProductsSectionProvider>
  );
}

function Header() {
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Products</H1>
        <P className="text-muted-foreground">Create and manage your products</P>
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
        </Button>{" "}
      </div>
    </div>
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
