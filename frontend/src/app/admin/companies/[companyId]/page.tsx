"use client";

import { GetFullCompanyByUUID } from "@/actions/Company";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1, H3, MutedText } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { LoadingCard } from "@/components/global/LoadingContainer";
import AddUsersToCompanyDialoge from "@/components/superadmin/companies/AddUsersToCompanyDialoge";
import NewCompanyDialoge from "@/components/superadmin/companies/NewCompanyDialoge";
import { CompanyUserColumn } from "@/components/tables/CompaniesColumns";
import { PosTerminalOnlyColumns } from "@/components/tables/PosTerminalColumns";
import { ProductsOnlyColumns } from "@/components/tables/ProductsColumns";
import { WarehouseOnlyColumns } from "@/components/tables/WarehouseColumns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGenericSingleDataContext } from "@/context/GenericDataTableContext";
import {
  Company,
  CompanyUser,
  PosTerminal,
  Product,
  Warehouse,
} from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Monitor,
  Package,
  Plus,
  Users,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export const { Provider: CompanyDataProvider, useGenericData: useCompanyData } =
  createGenericSingleDataContext<Company>();

export default function SuperAdminCompanyPageContainer({ params }: PageProps) {
  const { companyId } = use(params);

  return (
    <CompanyDataProvider fetchFn={() => GetFullCompanyByUUID(companyId)}>
      <DataSection />
    </CompanyDataProvider>
  );
}

function DataSection() {
  const { item } = useCompanyData();
  if (!item) return <NoDataContainer />;
  return (
    <div className="space-y-4">
      <Header />
      <CompanyInfo />

      <GenericSection
        props={{
          title: "Users",
          desc: "List of users associated with the company",
          items: item.users || [],
          columns: CompanyUserColumn,
          dialog: <AddUsersToCompanyDialoge />,
        }}
      />
      <GenericSection
        props={{
          title: "Warehouse",
          desc: "List of warehouses owned by the company",
          items: item.warehouses || [],
          columns: WarehouseOnlyColumns,
          dialog: <NewCompanyDialoge />,
        }}
      />

      <GenericSection
        props={{
          title: "Pos Terminal",
          desc: "List of terminals owned by the company",
          items: item.posTerminals || [],
          columns: PosTerminalOnlyColumns,
          dialog: <NewCompanyDialoge />,
        }}
      />

      <GenericSection
        props={{
          title: "Products",
          desc: "List of top products owned by the company",
          items: item.products || [],
          columns: ProductsOnlyColumns,
          dialog: <NewCompanyDialoge />,
        }}
      />
    </div>
  );
}

function Header() {
  const { item } = useCompanyData();

  if (item == null) {
    return <>loading</>;
  }

  return (
    <div className="flex items-center gap-3">
      <Building2 className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold capitalize">{item.name}</h1>
        <p className="text-muted-foreground">ID: {item.uuid}</p>
      </div>
    </div>
  );
}

interface IGenericProps<T> {
  title: string;
  desc: string;
  items: T[];
  columns: ColumnDef<T, any>[];
  dialog?: React.ReactElement;
}

function GenericSection<T>({ props }: { props: IGenericProps<T> }) {
  const { title, desc, items, columns, dialog } = props;

  const { item } = useCompanyData();
  if (!item) return <NoDataContainer />;

  return (
    <section className="p-4">
      <article className="flex flex-row items-center justify-between">
        <div>
          <H3 className="flex items-center gap-2">{title}</H3>
          <MutedText>{desc}</MutedText>
        </div>

        {dialog && dialog}
      </article>

      <DataTable columns={columns} data={items} />
    </section>
  );
}

function CompanyInfo() {
  const { item } = useCompanyData();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (!item) return <NoDataContainer />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Basic company details and administrative information
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Company Name
          </label>
          <p className="text-lg font-semibold">{item.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Created On
          </label>
          <p className="text-lg">{formatDate(item.createdOn)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Last Updated
          </label>
          <p className="text-lg">{formatDate(item.updatedOn)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Admin User
          </label>
          <p className="text-lg font-semibold">{item.adminUser?.username}</p>
          <p className="text-sm text-muted-foreground">
            {item.adminUser?.email}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            UUID
          </label>
          <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {item.uuid}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
