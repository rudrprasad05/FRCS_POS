"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import {
  ActivateSupplier,
  GetOneSupplierWithBatch,
  SoftDeleteSupplier,
} from "@/actions/Supplier";
import { EditorTab } from "@/components/company/suppliers/view/EditTab";
import NoDataContainer from "@/components/containers/NoDataContainer";
import ConfigTab from "@/components/global/ConfigTab";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Supplier } from "@/types/models";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const supplierId = String(params.supplierId);
  const queryClient = useQueryClient();

  const deleteFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await SoftDeleteSupplier({ uuid });
    queryClient.invalidateQueries({
      queryKey: ["editSupplier", supplierId, {}],
      exact: false,
    });
    return { success: res.success };
  };

  const activateFn = async (uuid: string): Promise<{ success: boolean }> => {
    const res = await ActivateSupplier({ uuid });
    queryClient.invalidateQueries({
      queryKey: ["editSupplier", supplierId, {}],
      exact: false,
    });
    return { success: res.success };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["editSupplier", supplierId],
    queryFn: () => GetOneSupplierWithBatch({ uuid: supplierId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const supplier = data.data as Supplier;

  return (
    <div>
      <HeaderWithBackButton
        title={"Edit Supplier"}
        description={`You are editing the supplier "${supplier?.name}"`}
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
          <EditorTab supplier={supplier} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab
            entity={supplier}
            deleteFn={deleteFn}
            activateFn={activateFn}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
