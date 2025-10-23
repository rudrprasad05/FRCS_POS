"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { GetOneWarehouseWithBatch } from "@/actions/Warehouse";
import ConfigTab from "@/components/company/warehouse/edit/ConfigTab";
import { EditorTab } from "@/components/company/warehouse/edit/EditTab";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { Button } from "@/components/ui/button";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Warehouse } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function WarehouseEditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const warehouseId = String(params.warehouseId);
  const companyName = String(params.companyName);

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
      <div className="flex items-start justify-between">
        <HeaderWithBackButton
          title={"Edit Warehouse"}
          description={`You are editing the Warehouse "${warehouse?.name}"`}
          link={`/${companyName}/warehouse`}
        />

        <Button asChild className="w-24">
          <Link
            prefetch
            href={`view`}
            className="w-24 flex items-center justify-between"
          >
            View
            <Eye className="" />
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
          <EditorTab product={data.data} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab warehouse={data.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
