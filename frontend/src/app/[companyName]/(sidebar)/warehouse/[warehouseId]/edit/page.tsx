"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { GetOneWarehouseWithBatch } from "@/actions/Warehouse";
import ConfigTab from "@/components/company/warehouse/edit/ConfigTab";
import { EditorTab } from "@/components/company/warehouse/edit/EditTab";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { createGenericSingleDataContext } from "@/context/GenericDataTableContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Product, Warehouse } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PenBox } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const {
  Provider: ProductEditorProvider,
  useGenericData: useProductEditorProvider,
} = createGenericSingleDataContext<Product>();

export default function WarehouseEditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const warehouseId = String(params.warehouseId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editWarehouse", warehouseId],
    queryFn: () => GetOneWarehouseWithBatch({ uuid: warehouseId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const warehouse = data.data as Warehouse;

  return (
    <div>
      <div className="">
        <div className="flex items-center gap-2 mb-2">
          <PenBox className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Edit Warehouse</h1>
        </div>
        <p className="text-muted-foreground">
          You are editing the Warehouse &quot;{warehouse?.name}&quot;
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
          <EditorTab product={data.data} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab warehouse={data.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
