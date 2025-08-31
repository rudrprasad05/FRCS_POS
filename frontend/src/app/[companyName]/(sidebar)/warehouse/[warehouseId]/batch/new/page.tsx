"use client";

import { GetAllTaxCategories } from "@/actions/Tax";
import AddMediaDialoge from "@/components/company/products/new/AddMediaDialoge";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
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
import { Product, TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, ImageIcon, PackagePlus, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { CreateProduct } from "@/actions/Product";
import { LoadPreCreationInfo } from "@/actions/ProductBatch";
import { ILoadPreCreationInfo } from "@/types/res";

export const schema = z.object({
  companyId: z.number({ error: "Company is required" }).int(),
  productId: z.number({ error: "Product is required" }).int(),
  warehouseId: z.string({ error: "Warehouse is required" }),
  quantity: z.number({ error: "Quantity is required" }).int().nonnegative(),
  expiryDate: z
    .date({ error: "Expiry date is required" })
    .optional()
    .nullable(),
});

export type NewBatchFormData = z.infer<typeof schema>;

export default function NewProductPage() {
  const [initalFormState, setInitalFormState] = useState<
    ILoadPreCreationInfo | undefined
  >(undefined);

  const [isLoadingTaxCategories, setIsLoadingTaxCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const params = useParams();
  const companyName = String(params.companyName);
  const warehouseId = String(params.warehouseId);

  const form = useForm<NewBatchFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyId: 0,
      productId: 0,
      warehouseId,
      quantity: 0,
      expiryDate: null,
    },
  });

  // Load tax categories on component mount
  useEffect(() => {
    const loadTaxCategories = async () => {
      try {
        const response = await LoadPreCreationInfo({
          companyName: companyName,
        });
        console.log("tax", response);
        if (response.success && response.data) {
          setInitalFormState(response.data as ILoadPreCreationInfo);
        } else {
          toast("Failed to upload");
        }
      } catch (error) {
        toast("Failed to upload");
      } finally {
        setIsLoadingTaxCategories(false);
      }
    };

    loadTaxCategories();
  }, [toast]);

  const formValues = form.watch();
  useEffect(() => {
    console.log("Form values changed:", formValues);
  }, [formValues]);

  const onSubmit = async (data: NewBatchFormData) => {
    setIsSubmitting(true);

    const formData = new FormData();

    try {
      const res = await CreateProduct(formData);
      console.log(res);
      toast("Uploaded");
    } catch (error) {
      toast("Failed to upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PackagePlus className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">New Product Batch</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new product to your inventory system
        </p>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel>
                      Select Product <RedStar />
                    </FormLabel>
                    <div className=" gap-2 flex items-center">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={isLoadingTaxCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingTaxCategories
                                  ? "Loading tax categories..."
                                  : "Select a tax category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {initalFormState?.products.map((category) => (
                            <SelectItem
                              key={category.id as number}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingTaxCategories && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          Loading ...
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel>
                      Select Warehouse <RedStar />
                    </FormLabel>
                    <div className=" gap-2 flex items-center">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={isLoadingTaxCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingTaxCategories
                                  ? "Loading tax categories..."
                                  : "Select a tax category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {initalFormState?.warehouses.map((category) => (
                            <SelectItem
                              key={category.uuid}
                              value={String(category.uuid)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingTaxCategories && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          Loading tax categories...
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        defaultValue={initalFormState?.company.uuid as string}
                        hidden
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoadingTaxCategories}
                >
                  {isSubmitting && (
                    <div className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? "Creating Product..." : "Create Product"}
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

function RedStar() {
  return <Asterisk className="w-2 h-2 text-rose-500 mb-auto ml-0 mr-auto" />;
}

function ImageSelector() {}
