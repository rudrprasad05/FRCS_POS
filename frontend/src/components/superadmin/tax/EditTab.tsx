"use client";

import { EditTaxCategory } from "@/actions/Tax";
import { GetUnAssignedUsers } from "@/actions/User";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { RedStar } from "@/components/global/RedStart";
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

import { QueryObject, TaxCategory, User, UserRoles } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const taxSchema = z.object({
  name: z
    .string()
    .min(1, "Tax name is required")
    .max(50, "Name must be less than 100 characters"),
  percentage: z.coerce
    .number<number>()
    .min(0, "percent to be above 0")
    .max(100, "percent to be below 100"),
});

export type EditTaxData = z.infer<typeof taxSchema>;

export function EditorTab({ tax }: { tax: TaxCategory }) {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<EditTaxData>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      name: tax?.name,
      percentage: tax.ratePercent,
    },
  });

  useEffect(() => {
    const getData = async () => {
      const data = await GetUnAssignedUsers({
        role: UserRoles.ADMIN,
      } as QueryObject);

      const users = data.data ?? [];

      setLoading(false);
    };
    getData();
  }, [form]);

  const onSubmit = async (data: EditTaxData) => {
    setIsSubmitting(true);

    const res = await EditTaxCategory(data, { uuid: tax.uuid });

    if (res.success) {
      queryClient.invalidateQueries({
        queryKey: ["editTax", tax.uuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminTax", {}],
        exact: false,
      });
      toast.success("Uploaded");
      router.push("/admin/tax");
    } else {
      toast.error("Failed to upload");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="space-y-4">
        <div>
          <LargeText>Tax Information</LargeText>
          <MutedText>Fill in the details below to edit tax</MutedText>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      Company Name <RedStar />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      Percent <RedStar />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="enter value between [0-100]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <div className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? "Editing..." : "Edit Product"}
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
