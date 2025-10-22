"use client";

import { GetEditProductData } from "@/actions/Product";
import ViewProductContainer from "@/components/company/products/view/ViewPage";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Product } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ViewProductPage() {
  const params = useParams();
  const productId = String(params.productId);

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

  console.log(product);

  return <ViewProductContainer product={product} />;
}
