"use client";

import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, P } from "@/components/font/HeaderFonts";
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
import { PosTerminal } from "@/types/models";
import { Search } from "lucide-react";

import { GetAllCompanyPosTerminals } from "@/actions/PosTerminal";
import { DataTable } from "@/components/global/DataTable";
import { createGenericDataContext } from "@/context/GenericDataTableContext";
import NewPosDialoge from "./NewPosDialoge";
import { columns } from "./PosTerminalDataColumns";
import { useParams } from "next/navigation";

export const { Provider: PosTerminalProvider, useGenericData: usePosTerminal } =
  createGenericDataContext<PosTerminal>();

export default function POSSection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  return (
    <PosTerminalProvider
      fetchFn={() =>
        GetAllCompanyPosTerminals(
          { pageNumber: 1, pageSize: 10 },
          companyName
        ).then((res) => ({
          data: res.data ?? [],
          meta: res.meta,
        }))
      }
    >
      <Header />
      <HandleDataSection />
    </PosTerminalProvider>
  );
}

function Header() {
  return (
    <div>
      <div className="space-b-2">
        <H1 className="">Pos Terminals</H1>
        <P className="text-muted-foreground">Create and manage pos terminals</P>
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

        <NewPosDialoge />
      </div>
    </div>
  );
}

function HandleDataSection() {
  const { items, loading, pagination, setPagination } = usePosTerminal();

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!items) {
    return <>Invalid URL</>;
  }

  return (
    <>
      <DataTable columns={columns} data={items as PosTerminal[]} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
