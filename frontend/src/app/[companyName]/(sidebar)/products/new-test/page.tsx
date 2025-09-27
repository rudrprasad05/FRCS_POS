"use client";

import { CreateProduct } from "@/actions/Product";
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
import { cn } from "@/lib/utils";
import { TaxCategory } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PackagePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const steps = ["Select Option", "Fill Details", "Review", "Confirm"];
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
  const [taxCategories, setTaxCategories] = useState<TaxCategory[]>([]);
  const [isLoadingTaxCategories, setIsLoadingTaxCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSelectCustom, setIsSelectCustom] = useState({
    customExpiryDays: false,
    customExpiryHours: false,
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const params = useParams();
  const companyName = params.companyName;
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
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
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else toast.info("Complete current step first");
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (index: number) => {
    if (index < currentStep || validateStep()) {
      setCurrentStep(index);
    }
  };

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
    formData.append(
      "FirstWarningInDays",
      data?.firstWarningInDays?.toString() || "0"
    );
    formData.append(
      "CriticalWarningInHours",
      data?.criticalWarningInHours?.toString() || "0"
    );
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
    <div className="mx-auto p-6">
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
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    index < currentStep ? "bg-primary" : "bg-border"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ transformOrigin: "left center" }}
                />
              )}
            </div>

            {/* Step Label */}
            <span className="text-xs mt-2">{label}</span>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step Content */}
          {currentStep === 0 && <Step1 form={form} />}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
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

function Step1({ form }: { form: UseFormReturn<ProductFormData> }) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="">Product Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter product name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
