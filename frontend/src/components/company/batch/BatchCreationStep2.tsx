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
import { ProductVariant } from "@/types/models";
import { UseFormReturn } from "react-hook-form";

export function BatchCreationStep2({
  form,
  products,
}: {
  form: UseFormReturn<NewBatchData>;
  products?: ProductVariant[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Product Information</LargeText>
        <MutedText>Basic product info</MutedText>
      </div>

      <FormField
        control={form.control}
        name="productId"
        render={({ field }) => (
          <FormItem className="grow">
            <FormLabel>
              Select Product <RedStar />
            </FormLabel>
            <FormControl>
              <Select value={field.value?.toString()}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
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
