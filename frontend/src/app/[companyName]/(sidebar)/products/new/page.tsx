"use client";
import { CreateProductAsync, GetNewPageInfo } from "@/actions/Product";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import StepperCircles from "@/components/global/StepperCircles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { ProductFormData, productSchema } from "@/types/forms/zod";
import { Supplier, TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Loader2,
  PackagePlus,
  Plus,
  PlusCircle,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

const steps = ["Supplier", "Details", "Expiry", "Variants", "Review"];
const customExpiryDays = [1, 2, 3, 5, 7, 10];
const customExpiryHours = [6, 12, 24, 48, 72];

export default function StepperForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const companyName = params.companyName;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      taxCategoryId: "",
      supplierId: searchParams.get("selectedSupplier") || "",
      isPerishable: false,
      criticalWarningInHours: 24,
      firstWarningInDays: 3,
      variants: [],
    },
  });

  const { data, error } = useQuery({
    queryKey: ["NewProductData", companyName],
    queryFn: () => GetNewPageInfo(companyName?.toString()),
    staleTime: FIVE_MINUTE_CACHE,
  });

  useEffect(() => {
    form.setValue("taxCategoryId", String(data?.data?.taxCategories[0].uuid));
  }, [data, form]);

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProductFormData)[] = [];

    if (currentStep === 0) {
      fieldsToValidate = ["supplierId"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["name", "sku"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["variants"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }

    console.log(form.getValues());
  };
  const prevStep = () => {
    setCurrentStep((prev) => {
      return Math.max(prev - 1, 0);
    });
  };

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup the timeout on unmount or re-run
    return () => clearTimeout(timer);
  }, [currentStep]);

  const onSubmit = async (data: ProductFormData) => {
    if (isLoading) {
      console.log("click2");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    console.log("click");

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
        })
      );

      if (variant.mediaFile) {
        formData.append(`VariantFiles`, variant.mediaFile);
      }
    });

    console.log(formData);

    const res = await CreateProductAsync(formData, {
      companyName: String(companyName),
    });

    if (res.success) {
      toast.success("Uploaded");
      router.back();
    } else {
      toast.info("Failed to upload", { description: res.message });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto p-6 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PackagePlus className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">New Product</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new product to your inventory system
        </p>
      </div>

      <StepperCircles currentStep={currentStep} steps={steps} />

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grow flex flex-col"
        >
          {/* set supplier */}
          {currentStep === 0 && (
            <Step1 form={form} suppliers={data?.data?.suppliers} />
          )}

          {/* set det */}
          {currentStep === 1 && (
            <Step2 form={form} taxes={data?.data?.taxCategories} />
          )}

          {/* set expiry */}
          {currentStep === 2 && <Step3 form={form} />}

          {/* set var 4 */}
          {currentStep === 3 && <Step4 form={form} />}
          {currentStep === 4 && <Step5 form={form} />}

          <Separator className="my-4 mt-auto" />

          <div className="flex gap-4 pt-4 ">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              type="button"
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextStep();
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                disabled={isLoading || isSubmitting}
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                {(isLoading || isSubmitting) && (
                  <Loader2 className="animate-spin" />
                )}
                Finish
              </Button>
            )}
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
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full">
                {suppliers?.map((user) => (
                  <SelectItem key={user.id} value={user.uuid}>
                    {user.name ?? user.email}
                  </SelectItem>
                ))}

                <Link
                  href={{
                    pathname: `/${companyName}/suppliers/new`,
                    query: {
                      open_create: "true",
                      returnUrl: `/${companyName}/products/new`,
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

function Step5({ form }: { form: UseFormReturn<ProductFormData> }) {
  const values = form.getValues();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Review Product</LargeText>
        <MutedText>
          Please review the information below before creating the product.
        </MutedText>
      </div>

      {/* Product Info */}
      <Card>
        <CardHeader>
          <LargeText>Product Info</LargeText>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div>
            <strong>Name:</strong> {values.name}
          </div>
          <div>
            <strong>SKU:</strong> {values.sku}
          </div>
          <div>
            <strong>Tax Category:</strong> {values.taxCategoryId || "—"}
          </div>
          <div>
            <strong>Supplier:</strong> {values.supplierId || "—"}
          </div>
          <div>
            <strong>Perishable:</strong> {values.isPerishable ? "Yes" : "No"}
          </div>
        </CardContent>
      </Card>

      {/* Expiry Info */}
      {values.isPerishable && (
        <Card>
          <CardHeader>
            <LargeText>Expiry Info</LargeText>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>
              <strong>First Warning (days):</strong>{" "}
              {values.firstWarningInDays ?? "—"}
            </div>
            <div>
              <strong>Critical Warning (hours):</strong>{" "}
              {values.criticalWarningInHours ?? "—"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants */}
      <Card>
        <CardHeader>
          <LargeText>Variants</LargeText>
        </CardHeader>
        <CardContent className="space-y-4">
          {values.variants && values.variants.length > 0 ? (
            values.variants.map((variant, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-1">
                <div>
                  <strong>Name:</strong> {variant.name}
                </div>
                <div>
                  <strong>SKU:</strong> {variant.sku}
                </div>
                <div>
                  <strong>Barcode:</strong> {variant.barcode || "—"}
                </div>
                <div>
                  <strong>Price:</strong> ${variant.price ?? "—"}
                </div>
              </div>
            ))
          ) : (
            <MutedText>No variants added</MutedText>
          )}
        </CardContent>
      </Card>
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const f = form.getValues(`variants.${index}.mediaFile`);
    if (f && f.type.startsWith("image/")) {
      setFile(f);

      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  }, [form, index]);

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
          {!file && <Upload className="h-4 w-4" />}
          {file && previewUrl && (
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
  const { control, formState } = useFormContext();
  const errors = formState.errors as FieldErrors<ProductFormData>;

  const getFieldError = (fieldName: string) => {
    const variantErrors = errors.variants?.[index] as
      | Record<string, { message?: string }>
      | undefined;
    return variantErrors?.[fieldName]?.message as string | undefined;
  };

  return (
    <div className="relative border border-solid rounded-lg p-6 flex gap-4 items-start">
      {/* Media dialog remains external */}
      <AddMediaDialoge index={index} form={form} />

      <div className="grid grid-cols-2 grow gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.name`}>Variant Name</Label>
          <Controller
            control={control}
            name={`variants.${index}.name` as const}
            render={({ field, fieldState }) => (
              <Input
                id={`variants.${index}.name`}
                placeholder="Variant name"
                {...field}
                value={field.value || ""} // Ensure value is defined
                className={cn(
                  "w-full",
                  fieldState.error && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
          {getFieldError("name") && (
            <span className="text-red-500 text-sm">
              {getFieldError("name")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.sku`}>Variant SKU</Label>
          <Controller
            control={control}
            name={`variants.${index}.sku` as const}
            render={({ field, fieldState }) => (
              <Input
                id={`variants.${index}.sku`}
                placeholder="Variant sku"
                {...field}
                value={field.value || ""} // Ensure value is defined
                className={cn(
                  "w-full",
                  fieldState.error && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
          {getFieldError("sku") && (
            <span className="text-red-500 text-sm">{getFieldError("sku")}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.barcode`}>Barcode</Label>
          <Controller
            control={control}
            name={`variants.${index}.barcode` as const}
            render={({ field, fieldState }) => (
              <Input
                id={`variants.${index}.barcode`}
                placeholder="Barcode"
                {...field}
                value={field.value || ""} // Ensure value is defined
                className={cn(
                  "w-full",
                  fieldState.error && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
          {getFieldError("barcode") && (
            <span className="text-red-500 text-sm">
              {getFieldError("barcode")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`variants.${index}.price`}>Price</Label>
          <Controller
            control={control}
            name={`variants.${index}.price` as const}
            render={({ field, fieldState }) => (
              <Input
                id={`variants.${index}.price`}
                type="number"
                step="0.01"
                placeholder="Price"
                {...field}
                value={field.value ?? ""} // Handle undefined/null
                onChange={(e) => field.onChange(parseFloat(e.target.value))} // Ensure valid number
                className={cn(
                  "w-full",
                  fieldState.error && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
          {getFieldError("price") && (
            <span className="text-red-500 text-sm">
              {getFieldError("price")}
            </span>
          )}
        </div>
      </div>

      <div
        onClick={() => {
          if (index === 0) return;
          remove(index);
        }}
        className={cn(
          "bg-muted p-1 rounded-full absolute top-0 right-0 translate-x-[50%] -translate-y-[50%] cursor-pointer",
          index === 0 && "hidden"
        )}
      >
        <X className="w-4 h-4" />
      </div>
    </div>
  );
}
