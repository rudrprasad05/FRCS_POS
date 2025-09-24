"use client";

import { CreateProduct } from "@/actions/Product";
import { GetAllTaxCategories } from "@/actions/Tax";
import AddMediaDialoge from "@/components/company/products/new/AddMediaDialoge";
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
import { TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, PackagePlus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [taxCategories, setTaxCategories] = useState<TaxCategory[]>([]);
  const [isLoadingTaxCategories, setIsLoadingTaxCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [file, setFile] = useState<File | undefined>(undefined);
  const params = useParams();
  const companyName = params.companyName;
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      price: "0",
      taxCategoryId: "0",
      isPerishable: false,
    },
  });

  // Load tax categories on component mount
  useEffect(() => {
    const loadTaxCategories = async () => {
      const response = await GetAllTaxCategories();

      if (response.success && response.data) {
        setTaxCategories(response.data as TaxCategory[]);
      } else {
        toast.error("Failed to get tax", { description: response.message });
      }

      setIsLoadingTaxCategories(false);
    };

    loadTaxCategories();
  }, []);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }, [file]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    data.image = file;

    const formData = new FormData();
    formData.append("ProductName", data.name);
    formData.append("SKU", data.sku);
    formData.append("Price", data.price.toString()); // decimal -> string
    formData.append("Barcode", data.barcode as string);
    formData.append("IsPerishable", data.isPerishable ? "true" : "false");
    formData.append("TaxCategoryId", data.taxCategoryId as string);
    formData.append("CompanyName", companyName as string);

    if (data.image) {
      formData.append("File", data.image); // IFormFile
    }

    console.log("Submitting FormData:", formData);

    const res = await CreateProduct(formData);

    if (res.success) {
      console.log(res);
      toast.success("Uploaded");
      router.back();
    } else {
      toast("Failed to upload");
    }

    setIsSubmitting(false);
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
                    <div className="gap-2 flex items-center">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isLoadingTaxCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingTaxCategories
                                  ? "Loading tax categories..."
                                  : "Select VAT"
                              }
                            />
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

              <AddMediaDialoge file={file} setFile={setFile} />
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
