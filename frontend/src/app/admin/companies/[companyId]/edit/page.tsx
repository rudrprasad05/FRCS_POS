"use client";

import { ActivateCompany, SoftDeleteCompany } from "@/actions/Company";
import { GetFullCompanyByUUID } from "@/actions/Product";
import NoDataContainer from "@/components/containers/NoDataContainer";
import ConfigTab from "@/components/global/ConfigTab";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";

import { EditorTab } from "@/components/superadmin/companies/EditTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Company } from "@/types/models";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const companyId = String(params.companyId);
  const queryClient = useQueryClient();

  const deleteFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await SoftDeleteCompany(uuid);

    queryClient.invalidateQueries({
      queryKey: ["editCompany", companyId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["adminCompanies", {}],
      exact: false,
    });
    return { success: res.success };
  };

  const activateFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await ActivateCompany(uuid);

    queryClient.invalidateQueries({
      queryKey: ["editCompany", companyId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["adminCompanies", {}],
      exact: false,
    });

    return { success: res.success };
  };

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

  return (
    <div>
      <div className="flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title="Edit Company"
          description={`You are editing the company "${company?.name}"`}
          link="/admin/companies"
        />
        <Button variant={"secondary"} asChild>
          <Link href={`view`}>
            <Eye />
            View Company
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="edit"
        className="w-full overflow-hidden relative h-screen p-4 flex flex-col"
      >
        <TabsPrimitive.List className="w-full border-solid border-b flex flex-row">
          <TabsPrimitive.Trigger
            onClick={() => setState("edit")}
            className={cn(
              "text-sm border-b-primary flex-grow px-8 cursor-pointer py-4 text-center border-solid hover:border-b transition",
              state == "edit" ? "border-b" : "border-none"
            )}
            value="edit"
          >
            Edit
          </TabsPrimitive.Trigger>
          <TabsPrimitive.Trigger
            onClick={() => setState("config")}
            className={cn(
              "text-sm border-b-primary flex-grow px-8 cursor-pointer py-2 text-center border-solid hover:border-b transition",
              state == "config" ? "border-b" : "border-none"
            )}
            value="config"
          >
            Config
          </TabsPrimitive.Trigger>
        </TabsPrimitive.List>
        <TabsContent value="edit">
          <EditorTab company={company} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab
            entity={company}
            deleteFn={deleteFn}
            activateFn={activateFn}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
