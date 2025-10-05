"use client";

import { LoadPreCreationInfo } from "@/actions/ProductBatch";
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
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { NewBatchData } from "@/types/forms/zod";
import { Supplier } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
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
  const companyName = String(params.companyName);
  const supplierId = String(params.supplierId);

  const { data, isLoading } = useQuery({
    queryKey: ["newBatchData", companyName, supplierId],
    queryFn: () => LoadPreCreationInfo({ companyName, uuid: supplierId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

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
                disabled={!suppliers || isLoading} // disable while loading
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select a supplier"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="px-4 py-2 text-muted-foreground">
                      Loading suppliers...
                    </div>
                  ) : suppliers?.length ? (
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
