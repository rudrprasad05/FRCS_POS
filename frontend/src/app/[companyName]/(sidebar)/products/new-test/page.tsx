"use client";

import { CreateProduct, GetNewPageInfo } from "@/actions/Product";
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
import { ProductVariant, Supplier, TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Image as ImageIcon,
  PackagePlus,
  Plus,
  PlusCircle,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z, { uuid } from "zod";

const steps = [
  "Supplier",
  "Details",
  "Expiry",
  "Variants",
  "Review",
  "Confirm",
];
const customExpiryDays = [1, 2, 3, 5, 7, 10];
const customExpiryHours = [6, 12, 24, 48, 72];

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
    barcode: z.string().optional(),
    price: z.string().min(0, "Price must be greater than or equal to 0"),
    taxCategoryId: z.string().optional(),
    supplierId: z.string().optional(),
    isPerishable: z.boolean(),
    image: z
      .any()
      .optional()
      .refine(
        (files: FileList | undefined) =>
          !files || files.length === 0 || files[0]?.type.startsWith("image/"),
        "Please select a valid image file"
      ),
  })
  .refine(
    (data) => {
      if (!data.isPerishable) return true;
      if (
        data.firstWarningInDays == null ||
        data.criticalWarningInHours == null
      )
        return false;
      return data.criticalWarningInHours < data.firstWarningInDays * 24;
    },
    {
      message:
        "Critical warning (hours) must be less than first warning (days x 24)",
      path: ["criticalWarningInHours"],
    }
  );

export type ProductFormData = z.infer<typeof productSchema>;

export default function StepperForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const params = useParams();
  const searchParams = useSearchParams();

  const companyName = params.companyName;
  const step = Number(searchParams.get("step") || undefined);

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(step || 0);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      price: "0",
      taxCategoryId: "",
      supplierId: "",
      isPerishable: false,
      criticalWarningInHours: 24,
      firstWarningInDays: 3,
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = () => {
    return true;
    let newErrors: { [key: string]: string } = {};
    if (currentStep === 0 && form.getValues("supplierId") == "") {
      newErrors.option = "Please select an option.";
    }
    if (currentStep === 1) {
      if (!form.getValues("name")) newErrors.name = "Name is required.";
      if (!form.getValues("name")) newErrors.email = "Email is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => {
        let x = Math.min(prev + 1, steps.length - 1);
        router.push("?step=" + x);
        return x;
      });
    } else toast.info("Complete current step first");
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      let x = Math.max(prev - 1, 0);

      router.push("?step=" + x);
      return x;
    });
  };

  const goToStep = (index: number) => {
    if (index < currentStep || validateStep()) {
      setCurrentStep((prev) => {
        let x = index;

        router.push("?step=" + x);
        return x;
      });
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log(data, variants);
    // return;
    setIsSubmitting(true);

    const formData = new FormData();

    // Main product info
    formData.append("product", JSON.stringify(data));

    // Append variants individually
    variants.forEach((variant, index) => {
      formData.append(
        `variants[${index}]`,
        JSON.stringify({
          name: variant.name,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price,
          firstWarningInDays: variant.firstWarningInDays,
          criticalWarningInHours: variant.criticalWarningInHours,
        })
      );

      if (variant.mediaFile) {
        formData.append(`variantFiles`, variant.mediaFile || "undefined");
      }
    });

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

  const { data } = useQuery({
    queryKey: ["NewProductData", companyName],
    queryFn: () => GetNewPageInfo(companyName?.toString()),
    staleTime: FIVE_MINUTE_CACHE,
  });

  useEffect(() => {
    form.setValue("taxCategoryId", String(data?.data?.taxCategories[0].uuid));
  }, [data]);

  //   useEffect(() => {
  //     if (file && file.type.startsWith("image/")) {
  //       const url = URL.createObjectURL(file);
  //       setPreviewUrl(url);
  //     } else {
  //       setPreviewUrl("");
  //     }
  //   }, [file]);

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

      <div className="flex mb-6 justify-between">
        {steps.map((label, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col cursor-pointer"
            onClick={() => goToStep(index)}
          >
            <div className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full border-2 relative overflow-hidden shrink-0",
                  index <= currentStep && "border-primary",
                  index === currentStep && "bg-primary text-black",
                  index > currentStep && "bg-transparent border-border"
                )}
              >
                <AnimatePresence mode="wait">
                  {index < currentStep ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <Check className="text-primary" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key={`num-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Line */}
              {index !== steps.length - 1 && (
                <motion.div
                  className="h-0.5 flex-1 rounded-full"
                  initial={{ backgroundColor: "var(--border)" }} // muted color
                  animate={{
                    backgroundColor:
                      index < currentStep ? "var(--primary)" : "var(--border)", // primary vs muted
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </div>

            {/* Step Label */}
            <span className="text-xs mt-2">{label}</span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grow flex flex-col"
        >
          {currentStep === 0 && (
            <Step1 form={form} suppliers={data?.data?.suppliers} />
          )}
          {currentStep === 1 && (
            <Step2 form={form} taxes={data?.data?.taxCategories} />
          )}
          {currentStep === 2 && <Step3 form={form} />}
          {currentStep === 3 && (
            <Step4 form={form} variants={variants} setVariants={setVariants} />
          )}
          {currentStep === 4 && <Step5 form={form} />}
          {currentStep === 5 && <Step6 form={form} />}

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
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
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
            <FormLabel>Select suppleir</FormLabel>
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
                    pathname: "/admin/users",
                    query: {
                      open_create: "true",
                      returnUrl: "/admin/companies",
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
                        onChange={(e) => field.onChange(e.target.value)}
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
                        onChange={(e) => field.onChange(e.target.value)}
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

function Step4({
  form,
  variants,
  setVariants,
}: {
  form: UseFormReturn<ProductFormData>;
  variants: ProductVariant[];
  setVariants: Dispatch<SetStateAction<ProductVariant[]>>;
}) {
  const defaultProd: Partial<ProductVariant> = {
    uuid: String(uuid()),
    name: form.getValues("name"),
    sku: form.getValues("sku") + "-1",
    firstWarningInDays: form.getValues("firstWarningInDays"),
    criticalWarningInHours: form.getValues("criticalWarningInHours"),
  };

  const rmVar = (i: string) => {
    setVariants((prev) => prev.filter((x) => x.uuid !== i));
  };
  const addVar = () => {
    setVariants((prev) => [
      ...prev,
      {
        uuid: String(uuid()),
        sku: form.getValues("sku") + "-" + prev.length + 1,
        firstWarningInDays: form.getValues("firstWarningInDays"),
        criticalWarningInHours: form.getValues("criticalWarningInHours"),
      } as ProductVariant,
    ]);
  };

  useEffect(() => {
    setVariants([defaultProd as ProductVariant]);
  }, [setVariants]);
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-between">
        <div>
          <LargeText>Variant Information</LargeText>
          <MutedText>Create and manage variants</MutedText>
        </div>

        <Button type="button" variant={"outline"} onClick={() => addVar()}>
          <PlusCircle />
          Add Variant
        </Button>
      </div>
      {variants.map((v, i) => (
        <div className="relative border border-solid rounded-lg p-6 flex gap-4 items-start">
          <AddMediaDialoge variant={v} setVariants={setVariants} />

          <div className="grid grid-cols-2 grow gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Variant Name</Label>
              <Input id="name" placeholder="variant name" value={v.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sku">Variant SKU</Label>
              <Input id="sku" placeholder="variant sku" value={v.sku} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" placeholder="Barcode" value={v.barcode} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="Price">Price</Label>
              <Input id="Price" placeholder="Price" value={v.barcode} />
            </div>
          </div>
          <div
            onClick={() => {
              if (i == 0) return;
              rmVar(v.uuid);
            }}
            className={cn(
              "bg-muted p-1 rounded-full absolute top-0 right-0 translate-x-[50%] -translate-y-[50%]",
              i == 0 && "hidden"
            )}
          >
            <X className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Step5({ form }: { form: UseFormReturn<ProductFormData> }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <LargeText>Review Product</LargeText>
        <MutedText>Final check before creating product</MutedText>
      </div>
      <div>
        <LargeText>Product Info </LargeText>
        <div>SKU: {form.getValues("sku")}</div>
      </div>
      <div>
        <LargeText>Expiry Info </LargeText>
        <div>SKU: {form.getValues("sku")}</div>
      </div>
      <div>
        <LargeText>Variants</LargeText>
        <div>SKU: {form.getValues("sku")}</div>
      </div>
    </div>
  );
}

function Step6({ form }: { form: UseFormReturn<ProductFormData> }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <LargeText>Confirm Submission</LargeText>
        <MutedText>Are you sure you want to proceed?</MutedText>
      </div>
    </div>
  );
}

function AddMediaDialoge({
  variant,
  setVariants,
}: {
  variant: ProductVariant;
  setVariants: Dispatch<SetStateAction<ProductVariant[]>>;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  const handleFileSelect = (f: File) => {
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setVariants((prev) =>
        prev.map((v) => (v.uuid === variant.uuid ? { ...v, mediaFile: f } : v))
      );
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsDragOver(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
      <DialogContent className="">
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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drop your image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF, WebP, Avif
                </p>
              </div>
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
                  src={previewUrl! || "/placeholder.svg"}
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
                  }}
                >
                  Remove
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => handleSubmit()}
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
