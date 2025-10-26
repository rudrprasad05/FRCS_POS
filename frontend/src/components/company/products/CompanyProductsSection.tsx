"use client";
import { GetAllProductVar } from "@/actions/Product";
import { H1, P } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { Header } from "@/components/global/TestHeader";
import { ProductsVariantsColumns } from "@/components/tables/ProductsColumns";
import { Button, buttonVariants } from "@/components/ui/button";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import {
  ApiResponse,
  ESortBy,
  ProductVariant,
  QueryObject,
  UserRoles,
} from "@/types/models";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CompanySection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<QueryObject>({
    pageNumber: 1,
    pageSize: 10,
    search: "",
    sortBy: ESortBy.DSC,
    isDeleted: false as boolean | undefined,
  });

  const query = useQuery({
    queryKey: ["products", companyName, pagination],
    queryFn: () => GetAllProductVar({ ...pagination, companyName }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  //   useEffect(() => {
  //     if (
  //       query.data?.meta?.totalPages &&
  //       (pagination.pageNumber as number) < query.data.meta.totalPages
  //     ) {
  //       queryClient.prefetchQuery({
  //         queryKey: [
  //           "products",
  //           { ...pagination, pageNumber: (pagination.pageNumber as number) + 1 },
  //         ],
  //         queryFn: () =>
  //           GetAllProductVar(
  //             {
  //               ...pagination,
  //               pageNumber: (pagination.pageNumber as number) + 1,
  //             },
  //             false
  //           ),
  //       });
  //     }
  //   }, [query.data, pagination, queryClient]);

  return (
    <>
      <Header
        pagination={pagination}
        setPagination={setPagination}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <NewButton />
          </RoleWrapper>
        }
      >
        <H1>Products</H1>
        <P className="text-muted-foreground">Create and manage your products</P>
      </Header>

      <HandleDataSection
        query={query}
        pagination={pagination}
        setPagination={setPagination}
      />
    </>
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

function HandleDataSection({
  query,
  pagination,
  setPagination,
}: {
  query: UseQueryResult<ApiResponse<ProductVariant[]>, Error>;
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

  console.log("query pv", data);

  return (
    <>
      <DataTable columns={ProductsVariantsColumns} data={data} />
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
