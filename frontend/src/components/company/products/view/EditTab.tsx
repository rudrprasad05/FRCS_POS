"use client";
import { EditProduct, GetNewPageInfo } from "@/actions/Product";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { Product, QueryObject, Supplier, TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  PlusCircle,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import z from "zod";

const customExpiryDays = [1, 2, 3, 5, 7, 10];
const customExpiryHours = [6, 12, 24, 48, 72];

const productVariantSchema = z.object({
  uuid: z.uuid(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  barcode: z.string(),
  price: z.number().min(0, "Price must be >= 0"),
  mediaFile: z.any().optional(),
});

export const productSchema = z
  .object({
    firstWarningInDays: z.number().optional(),
    criticalWarningInHours: z.number().optional(),
    name: z
      .string()
      .min(1, "Product name is required")
      .max(100, "Name must be less than 100 characters"),
    sku: z
      .string()
      .min(1, "SKU is required")
      .max(50, "SKU must be less than 50 characters"),
    taxCategoryId: z.uuid("select a tax"),
    supplierId: z.uuid("select a supplier"),
    isPerishable: z.boolean(),
    variants: z.array(productVariantSchema),
  })
  .refine(
    (data) => {
      if (!data.isPerishable) return true;
      if (
        data.firstWarningInDays == null ||
        data.criticalWarningInHours == null
      )
        return false;
      return (
        Number(data.criticalWarningInHours) <
        Number(data.firstWarningInDays) * 24
      );
    },
    {
      message:
        "Critical warning (hours) must be less than first warning (days x 24)",
      path: ["criticalWarningInHours"],
    }
  );

export type ProductFormData = z.infer<typeof productSchema>;

interface IProductEditorPage {
  product: Product;
  taxes: TaxCategory[];
}

export default function EditorTab({ product, taxes }: IProductEditorPage) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const companyName = params.companyName;
  const router = useRouter();
  const productId = String(params.productId);

  const queryClient = useQueryClient();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      taxCategoryId: product.taxCategory?.uuid,
      supplierId: product.supplier?.uuid,
      isPerishable: product.isPerishable,
      criticalWarningInHours: 24,
      firstWarningInDays: 3,
      variants: product.variants,
    },
  });

  const { data } = useQuery({
    queryKey: ["NewProductData", companyName],
    queryFn: () => GetNewPageInfo(companyName?.toString()),
    staleTime: FIVE_MINUTE_CACHE,
  });

  useEffect(() => {
    if (!product) return;

    form.reset({
      name: product.name ?? "",
      sku: product.sku ?? "",
      taxCategoryId: product.taxCategory?.uuid ?? "",
      supplierId: product.supplier?.uuid ?? "",
      isPerishable: product.isPerishable ?? false,
      variants: product.variants?.map((v) => ({
        uuid: v.uuid ?? crypto.randomUUID(),
        name: v.name ?? "",
        sku: v.sku ?? "",
        barcode: v.barcode ?? "",
        price: Number(v.price ?? 0),
        mediaFile: v.media,
      })),
    });

    const values = form.getValues();
    console.log(values);
  }, [product, form]);

  const backBtn = () => {
    router.push(`/${companyName}/products`);
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log(data);
    // return;
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("Product", JSON.stringify(data));

    data.variants.forEach((variant) => {
      formData.append(
        `Variants`,
        JSON.stringify({
          name: variant.name,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price,
          uuid: variant.uuid,
        })
      );

      if (variant.mediaFile) {
        formData.append(`VariantFiles`, variant.mediaFile);
      }
    });

    console.log(formData);

    const query: QueryObject = {
      uuid: product.uuid,
      companyName: String(companyName),
    };

    const res = await EditProduct(formData, query);

    if (res.success) {
      toast.success("Product Saved");

      queryClient.invalidateQueries({
        queryKey: ["editProduct", productId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["products", companyName, {}],
        exact: false,
      });
      backBtn();
    } else {
      toast.info("Failed to upload", { description: res.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grow py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grow flex flex-col"
        >
          <Step1 form={form} suppliers={data?.data?.suppliers} />
          <Step2 form={form} taxes={taxes} />
          <Step3 form={form} />
          <Step4 form={form} />

          <Separator className="my-4 mt-auto" />

          <div className="flex gap-4 pt-4 ">
            <Button onClick={backBtn} type="button" variant={"secondary"}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit" variant={"default"}>
              {isSubmitting && <Loader2 className="animate-spin" />}Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Step1({
  form,
  suppliers,
}: {
  form: UseFormReturn<ProductFormData>;
  suppliers?: Supplier[];
}) {
  const params = useParams();
  const companyName = params.companyName;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <LargeText>Supplier Information</LargeText>
        <MutedText>select a supplier</MutedText>
      </div>

      <FormField
        control={form.control}
        name="supplierId"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Select supplier</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value ? field.value.toString() : ""}
            >
              <FormControl className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full">
                {suppliers?.map((user) => (
                  <SelectItem key={user.uuid} value={user.uuid}>
                    {user.name ?? user.email}
                  </SelectItem>
                ))}

                <Link
                  href={{
                    pathname: `/${companyName}/suppliers/new`,
                    query: {
                      open_create: "true",
                      returnUrl: `/${companyName}/products/new-test`,
                    },
                  }}
                >
                  <div className="hover:bg-accent focus:bg-accent focus:text-accent-foreground  relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none ">
                    <Plus className="w-4 h-4" /> New Supplier
                  </div>
                </Link>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step2({
  form,
  taxes,
}: {
  form: UseFormReturn<ProductFormData>;
  taxes?: TaxCategory[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Product Information</LargeText>
        <MutedText>Basic product info</MutedText>
      </div>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="">Product Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormDescription>
              Choose a supplier for this product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="">Product SKU</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormDescription>
              Product name abbreviated to 3 letters (eg. bread - BRD)
            </FormDescription>

            <FormMessage />
          </FormItem>
        )}
      />
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select VAT"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taxes?.map((category) => (
                    <SelectItem
                      key={category.uuid}
                      value={String(category.uuid)}
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
    </div>
  );
}

function Step3({ form }: { form: UseFormReturn<ProductFormData> }) {
  const [isSelectCustom, setIsSelectCustom] = useState({
    customExpiryDays: false,
    customExpiryHours: false,
  });
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Expiry Information</LargeText>
        <MutedText>set warning times or set it as non-perishable</MutedText>
      </div>
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
              <FormLabel>Perishable Product</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {form.watch("isPerishable") && (
        <div className="flex gap-4 items-center">
          {/* Days Select */}
          <FormField
            control={form.control}
            name="firstWarningInDays"
            render={({ field }) => {
              const value = Number(field.value);

              return (
                <FormItem>
                  <FormLabel>First Warning (Days)</FormLabel>
                  <FormControl>
                    {isSelectCustom.customExpiryDays ? (
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter days"
                        value={value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        onBlur={(e) => {
                          if (!e.target.value) field.onChange(""); // reset if cleared
                        }}
                      />
                    ) : (
                      <Select
                        onValueChange={(val) => {
                          if (val === "custom") {
                            field.onChange("");
                            setIsSelectCustom((prev) => ({
                              ...prev,
                              customExpiryDays: true,
                            }));
                          } else {
                            field.onChange(val);
                          }
                        }}
                        value={value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          {customExpiryDays.map((d) => (
                            <SelectItem key={d} value={d.toString()}>
                              {d} day{d !== 1 && "s"}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormDescription>
                    When to send the first expiry warning.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Hours Select */}
          <FormField
            control={form.control}
            name="criticalWarningInHours"
            render={({ field }) => {
              const value = Number(field.value);
              const isCustom = !customExpiryHours.includes(value);

              return (
                <FormItem>
                  <FormLabel>Critical Warning (Hours)</FormLabel>
                  <FormControl>
                    {isCustom ? (
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter hours"
                        value={value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        onBlur={(e) => {
                          if (!e.target.value) field.onChange(""); // reset if cleared
                        }}
                      />
                    ) : (
                      <Select
                        onValueChange={(val) => {
                          if (val === "custom") {
                            field.onChange(""); // switch to input
                          } else {
                            field.onChange(val);
                          }
                        }}
                        value={value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hours" />
                        </SelectTrigger>
                        <SelectContent>
                          {["12", "24", "48", "72"].map((h) => (
                            <SelectItem key={h} value={h}>
                              {h} hours
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormDescription>
                    When to send the critical expiry warning.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

function Step4({ form }: { form: UseFormReturn<ProductFormData> }) {
  const { control, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Default variant
  useEffect(() => {
    if (fields.length === 0) {
      append({
        uuid: uuid(),
        name: getValues("name"),
        sku: getValues("sku") + "-default",
        price: 0,
        barcode: "",
      });
    }
  }, [append, fields.length, getValues]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-between">
        <div>
          <LargeText>Variant Information</LargeText>
          <MutedText>Create and manage variants</MutedText>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              uuid: String(uuid()),
              name: getValues("name"),
              sku: getValues("sku") + "-" + (fields.length + 1),
              price: 0,
              barcode: "",
            })
          }
        >
          <PlusCircle />
          Add Variant
        </Button>
      </div>

      {fields.map((field, index) => (
        <VariantCard key={field.id} form={form} index={index} remove={remove} />
      ))}
    </div>
  );
}

function AddMediaDialoge({
  index,
  form,
}: {
  index: number;
  form: UseFormReturn<ProductFormData>;
}) {
  const existingMedia = form.getValues(`variants.${index}.mediaFile`);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingMedia?.url ?? null
  );
  const [file, setFile] = useState<File>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (f: File) => {
    if (f && f.type.startsWith("image/")) {
      setFile(f);

      form.setValue(`variants.${index}.mediaFile`, f, { shouldDirty: true });

      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger type="button" asChild>
        <div className="w-14 h-14 aspect-square grid grid-cols-1 place-items-center outline outline-border rounded-lg">
          {!previewUrl && <Upload className="h-4 w-4" />}
          {previewUrl && (
            <Image
              className="w-full h-full object-cover rounded-lg"
              alt="image"
              src={previewUrl}
              height={50}
              width={50}
            />
          )}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Product Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }
              `}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">
                Drop your image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, WebP, Avif
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.avif"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border">
                <Image
                  width={200}
                  height={200}
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setFile(undefined);
                    setPreviewUrl(null);
                    form.setValue(`variants.${index}.mediaFile`, null, {
                      shouldDirty: true,
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Submit Image
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type VariantCardProps = {
  form: UseFormReturn<ProductFormData>;
  index: number;
  remove: (index: number) => void;
};

function VariantCard({ form, index, remove }: VariantCardProps) {
  const { control } = form;

  return (
    <div className="relative border border-solid rounded-lg p-6 flex gap-4 items-start">
      {/* Example: media dialog still external */}
      <AddMediaDialoge index={index} form={form} />

      <div className="grid grid-cols-2 grow gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.name`}>Variant Name</Label>
          <Controller
            control={control}
            name={`variants.${index}.name`}
            render={({ field }) => (
              <Input
                id={`variants.${index}.name`}
                placeholder="variant name"
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.sku`}>Variant SKU</Label>
          <Controller
            control={control}
            name={`variants.${index}.sku`}
            render={({ field }) => (
              <Input
                id={`variants.${index}.sku`}
                placeholder="variant sku"
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.barcode`}>Barcode</Label>
          <Controller
            control={control}
            name={`variants.${index}.barcode`}
            render={({ field }) => (
              <Input
                id={`variants.${index}.barcode`}
                placeholder="Barcode"
                {...field}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.price`}>Price</Label>
          <Controller
            control={control}
            name={`variants.${index}.price`}
            render={({ field }) => (
              <Input
                id={`variants.${index}.price`}
                type="number"
                step="0.01"
                placeholder="Price"
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
              />
            )}
          />
        </div>
      </div>

      <div
        onClick={() => {
          if (index === 0) return;
          remove(index);
        }}
        className={cn(
          "bg-muted p-1 rounded-full absolute top-0 right-0 translate-x-[50%] -translate-y-[50%]",
          index === 0 && "hidden"
        )}
      >
        <X className="w-4 h-4" />
      </div>
    </div>
  );
}
