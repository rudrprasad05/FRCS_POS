"use client";
import { EditProductBatch } from "@/actions/ProductBatch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDateIntoFormat } from "@/lib/utils";
import { EditBatchData, EditBatchDataSchema } from "@/types/forms/zod";
import { ProductBatch, QueryObject } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const customExpiryDays = [1, 2, 3, 5, 7, 10];
const customExpiryHours = [6, 12, 24, 48, 72];

interface IProductBatchEditorPage {
  batch: ProductBatch;
}

export default function EditorTab({ batch }: IProductBatchEditorPage) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const companyName = params.companyName;
  const router = useRouter();
  const batchId = String(params.batchId);
  const warehouseId = String(params.warehouseId);

  const queryClient = useQueryClient();

  const form = useForm<EditBatchData>({
    resolver: zodResolver(EditBatchDataSchema),
    defaultValues: {
      batchId,
      quantity: batch.quantity,
      expiryDate: new Date(
        Date.UTC(
          new Date(batch.expiryDate as string).getFullYear(),
          new Date(batch.expiryDate as string).getMonth(),
          new Date(batch.expiryDate as string).getDate()
        )
      ),
      receivedDate: new Date(
        Date.UTC(
          new Date(batch.recievedDate as string).getFullYear(),
          new Date(batch.recievedDate as string).getMonth(),
          new Date(batch.recievedDate as string).getDate()
        )
      ),
    },
  });

  const backBtn = () => {
    router.push(`/${companyName}/warehouse/${warehouseId}/view`);
  };

  const onSubmit = async (data: EditBatchData) => {
    console.log(data);

    setIsSubmitting(true);
    const query: QueryObject = {
      uuid: batch.uuid,
      companyName: String(companyName),
    };

    const res = await EditProductBatch(data, query);

    if (res.success) {
      toast.success("Product Batch Saved");

      queryClient.invalidateQueries({
        queryKey: ["editBatch", batchId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["warehouseBatches", warehouseId, {}],
        exact: false,
      });
      backBtn();
    } else {
      toast.info("Failed to upload", { description: res.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="grow py-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 grow flex flex-col"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Batch Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = (e.target as HTMLInputElement).value;
                            field.onChange(Number(val));
                          }}
                        />
                      </FormControl>
                      <FormDescription>Quantity number above 0</FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receivedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Receive Date</FormLabel>
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
                {batch.product?.isPerishable && (
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
                )}
              </div>
            </form>
          </Form>

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
