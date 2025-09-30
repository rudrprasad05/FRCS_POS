"use client";

import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { RedStar } from "@/components/global/RedStart";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewBatchData } from "@/types/forms/zod";
import { Supplier } from "@/types/models";
import { useParams } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

export function BatchCreationStep1({
  form,
  suppliers,
}: {
  form: UseFormReturn<NewBatchData>;
  suppliers?: Supplier[];
}) {
  const params = useParams();
  const companyName = params.companyName;
  console.log(suppliers);
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
          <FormItem className="grow">
            <FormLabel>
              Select Supplier <RedStar />
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={(val) => field.onChange(val)}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((product) => (
                    <SelectItem key={product.uuid} value={product.uuid}>
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
    </div>
  );
}
