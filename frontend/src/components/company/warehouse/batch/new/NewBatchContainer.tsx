"use client";

import { LoadPreCreationInfo } from "@/actions/ProductBatch";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateIntoFormat } from "@/lib/utils";
import { ILoadPreCreationInfo } from "@/types/res";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, CalendarIcon, Loader2, PackagePlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const schema = z.object({
  companyId: z.number({ error: "Company is required" }).int(),
  supplierId: z.number({ error: "Supplier is required" }).int(),
  productId: z.number({ error: "Product is required" }).int(),
  warehouseId: z.string({ error: "Warehouse is required" }),
  quantity: z.number({ error: "Quantity is required" }).int().nonnegative(),
  expiryDate: z
    .date({ error: "Expiry date is required" })
    .optional()
    .nullable(),
});

export type NewBatchFormData = z.infer<typeof schema>;

export default function NewProductBatchContainer() {
  const [initalFormState, setInitalFormState] = useState<
    ILoadPreCreationInfo | undefined
  >(undefined);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingTaxCategories, setIsLoadingTaxCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await LoadPreCreationInfo({
        companyName: companyName,
      });

      if (response.success && response.data) {
        setInitalFormState(response.data as ILoadPreCreationInfo);
        console.log(response.data);
      } else {
        toast.error("Failed to upload", { description: response.message });
      }

      setIsLoadingTaxCategories(false);
    };

    loadTaxCategories();
  }, [companyName]);

  useEffect(() => {
    if (initalFormState) {
      form.reset({
        companyId: initalFormState.company.id, // or UUID if that’s what your backend uses
        warehouseId: warehouseId,
        quantity: 0,
        expiryDate: null,
      });
    }
  }, [initalFormState, form, warehouseId]);

  const onSubmit = async (data: NewBatchFormData) => {
    setIsSubmitting(true);
    console.log(data);

    // const res = await CreateProductBatch(data);

    // if (res.success) {
    //   toast.success("Batch Created");
    //   queryClient.invalidateQueries({
    //     queryKey: ["warehouseBatches", warehouseId],
    //     exact: false,
    //   });
    //   router.back();
    // } else {
    //   toast.error("Error creating batch", { description: res.message });
    // }

    setIsSubmitting(false);
  };

  if (isLoadingTaxCategories)
    return (
      <div className="grow">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PackagePlus className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">New Product Batch</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new product batch to your inventory system
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
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-6">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>
                        Select Supplier <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {initalFormState?.suppliers.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={String(product.id)}
                              >
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>
                        Select Product <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {initalFormState?.products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={String(product.id)}
                              >
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>
                        Select Warehouse <RedStar />
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? field.value.toString() : undefined}
                        disabled={isLoadingTaxCategories}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoadingTaxCategories
                                  ? "Loading warehouses..."
                                  : "Select a warehouses (default current)"
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

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={() => {
                              const num = Number(inputValue) || 0;
                              field.onChange(num);
                              setInputValue(String(num));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <ExpiryConfig formState={initalFormState} form={form} />

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

function ExpiryConfig({
  form,
  formState,
}: {
  form: UseFormReturn<NewBatchFormData>;
  formState?: ILoadPreCreationInfo;
}) {
  if (!formState) return;

  //   if (
  //     !formState?.products.find((x) => x.id == form.watch("productId"))
  //       ?.isPerishable
  //   )
  //     return;

  return (
    <div className="space-y-4">
      <div>
        <LargeText>Expiry Information</LargeText>
        <MutedText>
          Fill in the details below to configure expiry tracking
        </MutedText>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-6 space-y-6">
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        formatDateIntoFormat(field.value.toString())
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function RedStar() {
  return <Asterisk className="w-2 h-2 text-rose-500 mb-auto ml-0 mr-auto" />;
}
