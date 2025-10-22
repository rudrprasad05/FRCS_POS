"use client";

import { GetEditProductData } from "@/actions/Product";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import ConfigTab from "@/components/company/products/view/ConfigTab";

import EditorTab from "@/components/company/products/view/EditTab";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { Button } from "@/components/ui/button";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Product, TaxCategory } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
  const [state, setState] = useState<"edit" | "config">("edit");
  const params = useParams();
  const productId = String(params.productId);
  const companyName = String(params.companyName);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editProduct", productId],
    queryFn: () => GetEditProductData(productId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const product = data.data.product as Product;
  const taxCategories = data.data.taxCategories as TaxCategory[];

  return (
    <div>
      <div className="flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title={"Edit Product"}
          description={`You are editing the product "${product.name}"`}
          link={`/${companyName}/products`}
        />
        <Button variant={"secondary"} asChild>
          <Link href={`view`}>
            <Eye />
            View Product
          </Link>
        </Button>
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
          <EditorTab product={product} taxes={taxCategories} />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab product={product} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
