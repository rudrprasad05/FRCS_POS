"use client";

import { EditSupplier } from "@/actions/Supplier";
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

import { Supplier } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const stripNonDigits = (v: unknown) =>
  typeof v === "string" ? v.replace(/\D+/g, "") : v;

const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters")
    .transform((s) => s.trim()),

  code: z
    .string()
    .transform((s) => s.trim().toUpperCase())
    .refine((s) => /^[A-Z]{1,3}$/.test(s), {
      message: "Code must be 1–3 letters (A–Z).",
    }),

  contactName: z
    .string()
    .min(1, "Contact name is required")
    .max(200, "Contact name must be at most 200 characters")
    .transform((s) => s.trim()),

  phone: z
    .preprocess((val) => stripNonDigits(val), z.string())
    .refine((digits) => /^\d{7}$/.test(digits), {
      message: "Phone must contain exactly 7 digits.",
    })
    .transform((digits) => digits), // keep canonical digits-only form

  email: z.email("Please provide a valid email address"),
  companyName: z.string().optional(),

  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must be at most 500 characters")
    .transform((s) => s.trim()),

  taxNumber: z
    .preprocess((val) => stripNonDigits(val), z.string())
    .refine((digits) => /^\d{9,10}$/.test(digits), {
      message: "TIN must be 9 or 10 digits (digits only).",
    })
    .transform((digits) => digits),
});

type SupplierInput = z.input<typeof supplierSchema>;

export function EditorTab({ supplier }: { supplier: Supplier }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const companyName = params.companyName;
  const supplierId = String(params.supplierId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const form = useForm<SupplierInput>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier.name,
      code: supplier.code,
      contactName: supplier.contactName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      taxNumber: supplier.taxNumber,
      companyName: companyName as string,
    },
  });

  const onSubmit = async (data: SupplierInput) => {
    setIsSubmitting(true);
    data.companyName = companyName as string;

    const res = await EditSupplier(data, supplier.uuid || supplierId);

    if (res.success) {
      toast.success("Suppier created");

      queryClient.invalidateQueries({
        queryKey: ["suppliers", companyName, {}],
        exact: false,
      });

      const newUser = res.data as Supplier;

      if (searchParams.get("returnUrl")) {
        queryClient.invalidateQueries({
          queryKey: ["NewProductData", companyName],
          exact: false,
        });
        router.replace(
          `${searchParams.get("returnUrl")}?selectedSupplier=${
            newUser.uuid
          }&open_create=true`
        );
      } else {
        router.back();
      }
    } else {
      toast.error("Failed to upload", { description: res.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">
                        Supplier Name <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code Name <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter code (XXX)" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier Email <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="info@supplier.com" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Person <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="enter contact person" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier address <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 rewa street, suva" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier TIN <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="123-456-7890"
                          {...field}
                          value={(field.value as string) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone contact <RedStar />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="enter phone number"
                          {...field}
                          value={(field.value as string) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild type="button" variant={"secondary"}>
                  <Link href={`/${companyName}/suppliers`}>Cancel</Link>
                </Button>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  variant={"default"}
                >
                  {isSubmitting && <Loader2 className="animate-spin" />}Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
