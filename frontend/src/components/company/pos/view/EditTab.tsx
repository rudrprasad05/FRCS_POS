"use client";

import { EditTerminal, GetPosTerminalById } from "@/actions/PosTerminal";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
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

import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Asterisk, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  location: z
    .string()
    .min(1, "location is required")
    .max(50, "location must be less than 50 characters"),
  serialNumber: z
    .string()
    .min(1, "serial is required")
    .max(50, "serial must be less than 50 characters"),
});

export type EditTerminalData = z.infer<typeof productSchema>;

export function EditorTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const params = useParams();
  const posId = String(params.posId);
  const companyName = String(params.companyName);

  const { data } = useQuery({
    queryKey: ["editTerminal", posId],
    queryFn: () => GetPosTerminalById(posId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  const terminal = data?.data;

  const form = useForm<EditTerminalData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: terminal?.name,
      serialNumber: terminal?.serialNumber,
      location: terminal?.locationDescription,
    },
  });

  const onSubmit = async (data: EditTerminalData) => {
    setIsSubmitting(true);

    const res = await EditTerminal(data, terminal?.uuid as string);

    if (res.success) {
      queryClient.invalidateQueries({
        queryKey: ["editTerminal", terminal?.uuid],
      });
      toast.success("Edited successfully");
      router.push(`/${companyName}/pos`);
    } else {
      toast.error("Failed to upload");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="space-y-4">
        <div>
          <LargeText>Terminal Information</LargeText>
          <MutedText>Fill in the details below to edit a terminal</MutedText>
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
                      Terminal Name <RedStar />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter terminal name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter serial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isSubmitting}
                >
                  <Link prefetch href={`/${companyName}/pos`}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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

function RedStar() {
  return <Asterisk className="w-2 h-2 text-rose-500 mb-auto ml-0 mr-auto" />;
}
