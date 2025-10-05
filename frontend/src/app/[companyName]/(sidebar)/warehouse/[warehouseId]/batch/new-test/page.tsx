"use client";
import {
  CreateProductBatch,
  LoadPreCreationInfo,
} from "@/actions/ProductBatch";
import { BatchCreationStep1 } from "@/components/company/batch/BatchCreationStep1";
import { BatchCreationStep2 } from "@/components/company/batch/BatchCreationStep2";
import { BatchCreationStep3 } from "@/components/company/batch/BatchCreationStep3";

import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import StepperCircles from "@/components/global/StepperCircles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { NewBatchData, NewBatchDataSchema } from "@/types/forms/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const steps = ["Supplier", "Product", "Expiry", "Review"];

export default function StepperForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const companyName = String(params.companyName);
  const warehouseId = String(params.warehouseId);
  const queryClient = useQueryClient();

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<NewBatchData>({
    resolver: zodResolver(NewBatchDataSchema),
    defaultValues: {
      companyName,
      warehouseId,
      quantity: 1,
      expiryDate: null,
      receiveDate: null,
      supplierId: "",
      productId: "",
    } as Partial<NewBatchData>,
  });

  const supplierId = form.watch("supplierId");

  const { data, error } = useQuery({
    queryKey: ["newBatchData", companyName, supplierId],
    queryFn: () => LoadPreCreationInfo({ companyName, uuid: supplierId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof NewBatchData)[] = [];

    if (currentStep === 0) {
      fieldsToValidate = ["supplierId"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["productId"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["quantity"];
      fieldsToValidate = ["receiveDate"];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => {
      let x = Math.max(prev - 1, 0);
      return x;
    });
  };

  const onSubmit = async (data: NewBatchData) => {
    setIsSubmitting(true);

    const res = await CreateProductBatch(data);

    if (res.success) {
      toast.success("Batch Created");
      queryClient.invalidateQueries({
        queryKey: ["warehouseBatches", warehouseId],
        exact: false,
      });
      router.push(`/${companyName}/warehouse/${warehouseId}`);
    } else {
      toast.error("Error creating batch", { description: res.message });
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
    console.dir(form.getValues());
  }, [form.formState.errors]);

  return (
    <div className="mx-auto p-6 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PackagePlus className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">New Product Batch</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new batch to your inventory system
        </p>
      </div>

      <StepperCircles steps={steps} currentStep={currentStep} />
      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grow flex flex-col"
        >
          {currentStep === 0 && (
            <BatchCreationStep1 form={form} suppliers={data?.data?.suppliers} />
          )}

          {currentStep === 1 && (
            <BatchCreationStep2 form={form} products={data?.data?.products} />
          )}

          {currentStep === 2 && (
            <BatchCreationStep3 form={form} products={data?.data?.products} />
          )}

          {currentStep === 3 && <Step4 form={form} />}

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

function Step4({ form }: { form: UseFormReturn<NewBatchData> }) {
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
            <strong>Supplier:</strong> {values.supplierId || "—"}
          </div>
        </CardContent>
      </Card>

      {/* Expiry Info */}
      <Card>
        <CardHeader>
          <LargeText>Expiry Info</LargeText>
        </CardHeader>
        <CardContent className="space-y-1 text-sm"></CardContent>
      </Card>
    </div>
  );
}
