"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast, useSonner } from "sonner";
import { ApiResponse, TaxCategory } from "@/types/models";
import { GetAllTaxCategories } from "@/actions/Tax";
import { Asterisk, PackagePlus } from "lucide-react";
import { H3, LargeText, MutedText, P } from "@/components/font/HeaderFonts";

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
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  taxCategoryId: z.number().optional(),
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
  const [taxCategories, setTaxCategories] = useState<TaxCategory[]>([]);
  const [isLoadingTaxCategories, setIsLoadingTaxCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      price: 0,
      taxCategoryId: 0,
      isPerishable: false,
    },
  });

  // Load tax categories on component mount
  useEffect(() => {
    const loadTaxCategories = async () => {
      try {
        const response = await GetAllTaxCategories();
        console.log(response);
        if (response.success && response.data) {
          setTaxCategories(response.data as TaxCategory[]);
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
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Handle image file if selected
      const imageFile = data.image?.[0];

      console.log("Product data:", {
        ...data,
        image: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : null,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast("Failed to upload");

      // Reset form after successful submission
      form.reset();
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
          <h1 className="text-3xl font-bold">New Product</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">
                        Product Name <RedStar />
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
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
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
                      <FormLabel>
                        Barcode <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter barcode" {...field} />
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
                      <FormLabel>
                        Price <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input
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
                    <FormLabel>
                      Tax Category <RedStar />
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
                          {taxCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
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
                name="image"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                      /> */}
                    </FormControl>
                    <FormDescription>
                      Upload an image for this product (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPerishable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Perishable Product <RedStar />
                      </FormLabel>
                      <FormDescription>
                        Check this if the product has an expiration date
                      </FormDescription>
                    </div>
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
