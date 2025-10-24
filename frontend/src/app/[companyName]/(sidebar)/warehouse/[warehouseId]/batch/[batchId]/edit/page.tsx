"use client";

import ConfigTab from "@/components/global/ConfigTab";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import {
  ActivateProductBatch,
  GetBatchByUUID,
  SoftDeleteProductBatch,
} from "@/actions/ProductBatch";
import EditorTab from "@/components/company/batch/EditTab";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ViewBatchPage() {
  const params = useParams();
  const companyName = String(params.companyName);
  const warehouseId = String(params.warehouseId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const batchId = String(params.batchId);
  const queryClient = useQueryClient();
  const [state, setState] = useState<"edit" | "config">("edit");

  const { data, isLoading, error } = useQuery({
    queryKey: ["editBatch", batchId],
    queryFn: () => GetBatchByUUID({ companyName, uuid: batchId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const product = data.data.product;
  const batch = data.data;

  const deleteFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await SoftDeleteProductBatch(uuid);

    queryClient.invalidateQueries({
      queryKey: ["editBatch", batchId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["warehouseBatches", warehouseId, {}],
      exact: false,
    });
    return { success: res.success };
  };

  const activateFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await ActivateProductBatch(uuid);

    queryClient.invalidateQueries({
      queryKey: ["editBatch", batchId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["warehouseBatches", warehouseId, {}],
      exact: false,
    });

    return { success: res.success };
  };

  return (
    <div>
      <div className="flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title={"Edit Product Batch"}
          description={`You are editing the batch for "${product?.name}"`}
          link={`/${companyName}/warehouse/${warehouseId}/view`}
        />
      </div>
      <Tabs defaultValue="edit" className="w-full relative  p-4 flex flex-col">
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
          <EditorTab batch={batch} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab
            deleteFn={deleteFn}
            activateFn={activateFn}
            entity={batch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
