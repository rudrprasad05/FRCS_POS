"use client";

import { EditWarehouse } from "@/actions/Warehouse";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { RedStar } from "@/components/global/RedStart";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Warehouse } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  location: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters"),
});

export type WarehouseEditData = z.infer<typeof productSchema>;

export function EditorTab({ product }: { product: Warehouse }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
  const queryClient = useQueryClient();

  const form = useForm<WarehouseEditData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name,
      location: product?.location,
    },
  });

  const formValues = form.watch();

  useEffect(() => {
    console.log("Form values changed:", formValues);
  }, [formValues]);

  const onSubmit = async (data: WarehouseEditData) => {
    setIsSubmitting(true);

    const res = await EditWarehouse(data, product.uuid);

    if (res.success) {
      queryClient.invalidateQueries({
        queryKey: ["editWarehouse", product.uuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouse", companyName],
        exact: false,
      });
      toast.success("Uploaded");
    } else {
      toast.error("Failed to upload");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="space-y-4">
        <div>
          <LargeText>Warehouse Information</LargeText>
          <MutedText>
            Fill in the details below to edit an existing warehouse
          </MutedText>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">
                        Warehouse Name <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Location <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <div className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? "Editing..." : "Edit location"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
