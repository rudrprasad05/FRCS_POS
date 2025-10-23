"use client";

import { GetFullCompanyByUUID } from "@/actions/Company";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H3, MutedText } from "@/components/font/HeaderFonts";
import { DataTable } from "@/components/global/DataTable";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import AddUsersToCompanyDialoge from "@/components/superadmin/companies/AddUsersToCompanyDialoge";
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
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Company } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Building2, Loader2, PenBox } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function SuperAdminCompanyPageContainer({ params }: PageProps) {
  const { companyId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editCompany", companyId],
    queryFn: () => GetFullCompanyByUUID(companyId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const company = data.data as Company;

  return <DataSection data={company} />;
}

function DataSection({ data }: { data: Company }) {
  return (
    <div className="space-y-4">
      <div className="flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title={data.name}
          description={`ID: ${data.uuid}`}
          link="/admin/companies"
        />
        <Button variant={"secondary"} asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Company
          </Link>
        </Button>
      </div>
      <CompanyInfo data={data} />

      <GenericSection
        props={{
          title: "Users",
          desc: "List of users associated with the company",
          items: data.users || [],
          columns: CompanyUserColumn,
          dialog: <AddUsersToCompanyDialoge />,
        }}
      />
      <GenericSection
        props={{
          title: "Warehouse",
          desc: "List of warehouses owned by the company",
          items: data.warehouses || [],
          columns: WarehouseOnlyColumns,
        }}
      />

      <GenericSection
        props={{
          title: "Pos Terminal",
          desc: "List of terminals owned by the company",
          items: data.posTerminals || [],
          columns: PosTerminalOnlyColumns,
        }}
      />

      <GenericSection
        props={{
          title: "Products",
          desc: "List of top products owned by the company",
          items: data.products || [],
          columns: ProductsOnlyColumns,
        }}
      />
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

  return (
    <section className="p-4">
      <article className="flex flex-row items-center justify-between my-2">
        <div className="space-y-1">
          <H3 className="flex items-center gap-2">{title}</H3>
          <MutedText>{desc}</MutedText>
        </div>

        {dialog && dialog}
      </article>

      <DataTable columns={columns} data={items} />
    </section>
  );
}

function CompanyInfo({ data }: { data: Company }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
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
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Created On
          </label>
          <p className="text-lg">{formatDate(data.createdOn)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Last Updated
          </label>
          <p className="text-lg">{formatDate(data.updatedOn)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Admin User
          </label>
          <p className="text-lg font-semibold">{data.adminUser?.username}</p>
          <p className="text-sm text-muted-foreground">
            {data.adminUser?.email}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            UUID
          </label>
          <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {data.uuid}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
