"use client";

import { GetEditProductData } from "@/actions/Product";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Product, TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters"),
  barcode: z.string().optional(),
  price: z.string().min(0, "Price must be greater than or equal to 0"),
  taxCategoryId: z.string().optional(),
  isPerishable: z.boolean(),
  image: z
    .any()
    .optional()
    .refine(
      (files: FileList | undefined) =>
        !files || files.length === 0 || files[0]?.type.startsWith("image/"),
      "Please select a valid image file"
    ),
});

export type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
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
  const taxCategories = data.data.taxCategories as TaxCategory[];

  return <MainSection product={product} taxCategories={taxCategories} />;
}

function MainSection({
  product,
  taxCategories,
}: {
  product: Product;
  taxCategories: TaxCategory[];
}) {
  const previewUrl = product.media?.url;
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name,
      sku: product?.sku,
      barcode: product?.barcode as string,
      price: String(product?.price),
      taxCategoryId: String(product?.id),
      isPerishable: product?.isPerishable,
    },
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-primary h-6 w-6" />
            <h1 className="text-3xl font-bold">View Product</h1>
          </div>
          <p className="text-muted-foreground">
            You are veiwing the product &quot;{product?.name}&quot;
          </p>
        </div>
        <Button asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <LargeText>Product Information</LargeText>
          <MutedText>
            Fill in the details below to create a new product
          </MutedText>
        </div>

        <div>
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Product Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter product name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormDescription>
                        Stock Keeping Unit - unique identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter barcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="taxCategoryId"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel>Tax Category</FormLabel>
                    <div className="gap-2 flex items-center">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? field.value.toString() : ""}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taxCategories.map((category) => (
                            <SelectItem
                              key={category.id as number}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {previewUrl && (
                <div className="w-[200px]">
                  <Image
                    width={100}
                    height={100}
                    src={previewUrl! || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="isPerishable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Perishable Product</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
