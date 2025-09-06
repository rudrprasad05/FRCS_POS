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
import { PosTerminal, UserRoles } from "@/types/models";
import { Search } from "lucide-react";

import { GetAllCompanyPosTerminals } from "@/actions/PosTerminal";
import { DataTable } from "@/components/global/DataTable";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import NewPosDialoge from "./NewPosDialoge";
import { columns } from "./PosTerminalDataColumns";
import { useParams } from "next/navigation";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { Header } from "@/components/global/GenericSortableHeader";

export const { Provider: PosTerminalProvider, useGenericData: usePosTerminal } =
  createGenericListDataContext<PosTerminal>();

export default function POSSection() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  return (
    <PosTerminalProvider
      fetchFn={(q) => GetAllCompanyPosTerminals({ ...q, companyName })}
    >
      <Header<PosTerminal>
        useHook={usePosTerminal}
        newButton={
          <RoleWrapper allowedRoles={[UserRoles.ADMIN]}>
            <NewPosDialoge companyName={companyName} />
          </RoleWrapper>
        }
      >
        <H1>Pos Terminals</H1>
        <P className="text-muted-foreground">
          Create and manage your pos terminals
        </P>
      </Header>
      <HandleDataSection />
    </PosTerminalProvider>
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

  console.log("HandleDataSection", items);

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
