"use client";

import { GetFullCompanyByUUID } from "@/actions/Product";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import ConfigTab from "@/components/superadmin/companies/ConfigTab";
import { EditorTab } from "@/components/superadmin/companies/EditTab";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Company } from "@/types/models";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const companyId = String(params.companyId);

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
      <HeaderWithBackButton
        title="Edit Company"
        description={`You are editing the company "${company?.name}"`}
      />

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
          <ConfigTab company={company} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
