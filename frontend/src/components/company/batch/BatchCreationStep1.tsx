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
import { UseFormReturn } from "react-hook-form";

export function BatchCreationStep1({
  form,
  suppliers,
}: {
  form: UseFormReturn<NewBatchData>;
  suppliers?: Supplier[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <LargeText>Supplier Information</LargeText>
        <MutedText>Select a Supplier</MutedText>
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
                disabled={!suppliers}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={"Select a supplier"} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.length ? (
                    suppliers.map((supplier) => (
                      <SelectItem key={supplier.uuid} value={supplier.uuid}>
                        {supplier.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground">
                      No suppliers found
                    </div>
                  )}
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
