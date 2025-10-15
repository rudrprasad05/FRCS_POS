import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
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
import { formatDateIntoFormat } from "@/lib/utils";
import { NewBatchData } from "@/types/forms/zod";
import { ProductVariant } from "@/types/models";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export function BatchCreationStep3({
  form,
  products,
}: {
  form: UseFormReturn<NewBatchData>;
  products?: ProductVariant[];
}) {
  const productId = form.watch("productId");
  const product = products?.find((x) => x.uuid == productId);
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Product Information</LargeText>
        <MutedText>Expiry Date Information</MutedText>
      </div>

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
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-6 space-y-6">
        <FormField
          control={form.control}
          name="receiveDate"
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
        {product?.isPerishable && (
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
    </div>
  );
}
