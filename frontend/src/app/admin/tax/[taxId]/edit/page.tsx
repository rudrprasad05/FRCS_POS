"use client";

import { GetTaxByUUID, SoftDeleteTax } from "@/actions/Tax";
import NoDataContainer from "@/components/containers/NoDataContainer";
import ConfigTab from "@/components/superadmin/tax/ConfigTab";
import { EditorTab } from "@/components/superadmin/tax/EditTab";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { TaxCategory } from "@/types/models";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PenBox } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const taxId = String(params.taxId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editTax", taxId],
    queryFn: () => GetTaxByUUID({ uuid: taxId }),
    staleTime: FIVE_MINUTE_CACHE,
  });
  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const deleteFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await SoftDeleteTax(uuid);
    return { success: res.success };
  };

  const activateFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await SoftDeleteTax(uuid);
    return { success: res.success };
  };

  const tax = data.data as TaxCategory;

  return (
    <div>
      <div className="">
        <div className="flex items-center gap-2 mb-2">
          <PenBox className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Edit Tax</h1>
        </div>
        <p className="text-muted-foreground">
          You are editing the tax category &quot;{tax?.name}&quot;
        </p>
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
          <EditorTab company={tax} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab entity={tax} deleteFn={deleteFn} activateFn={activateFn} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
