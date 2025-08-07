"use client";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./CompaniesColumns";
import { DataTable } from "./CompaniesDataTable";
import PaginationSection from "@/components/global/PaginationSection";
import { GetAllCompanies } from "@/actions/Company";
import { Company, MetaData } from "@/types/models";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, MutedText, P } from "@/components/font/HeaderFonts";

export default function CompanySection() {
  return (
    <>
      <Header />
      <HandleDataSection />
    </>
    // <CakeTypeProvider>
    // </CakeTypeProvider>
  );
}

function Header() {
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Companies</H1>
        <P className="text-muted-foreground">Create and manage companies</P>
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

        <Link href={"/admin/category/create"}>
          <div
            className={`${buttonVariants({
              variant: "default",
            })} w-full text-start justify-start px-2 my-2`}
          >
            <Plus />
            New Catgory
          </div>
        </Link>
      </div>
    </div>
  );
}

function HandleDataSection() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Company[]>([]);
  const router = useRouter();
  //   const { list, setList } = useCakeType();
  const [pagination, setPagination] = useState<MetaData>({
    pageNumber: 1,
    totalCount: 1,
    pageSize: 10,
    totalPages: 0,
  });
  useEffect(() => {
    const getData = async () => {
      const res = await GetAllCompanies({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      setList(res.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(
          (res.meta?.totalCount as number) / pagination.pageSize
        ),
      }));

      setLoading(false);
    };
    getData();
  }, [router, pagination.pageNumber, pagination.pageSize, setList]);

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!list) {
    return <>Invalid URL</>;
  }
  if (list.length === 0) {
    return <NoDataContainer />;
  }
  return (
    <>
      <DataTable columns={columns} data={list as Company[]} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
