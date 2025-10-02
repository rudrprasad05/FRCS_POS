"use client";

import { EditCompany } from "@/actions/Company";
import { GetUnAssignedUsers } from "@/actions/User";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { RedStar } from "@/components/global/RedStart";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryObject, TaxCategory, User, UserRoles } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  adminUserId: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters"),
});

export type EditCompanyData = z.infer<typeof productSchema>;

export function EditorTab({ tax }: { tax: TaxCategory }) {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<EditCompanyData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: tax?.name,
      adminUserId: "",
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

  const onSubmit = async (data: EditCompanyData) => {
    setIsSubmitting(true);

    const res = await EditCompany(data, tax.uuid);

    if (res.success) {
      queryClient.invalidateQueries({
        queryKey: ["editCompany", tax.uuid],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminCompanies"],
        exact: false,
      });
      toast.success("Uploaded");
      router.back();
    } else {
      toast.error("Failed to upload");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="space-y-4">
        <div>
          <LargeText>Company Information</LargeText>
          <MutedText>Fill in the details below to create a new tax</MutedText>
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
                name="adminUserId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Admin</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select an admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {loading && <Loader2 className="animate-spin" />}
                        {adminUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.username ?? user.email}
                          </SelectItem>
                        ))}

                        <Link
                          href={{
                            pathname: "/admin/users",
                            query: {
                              open_create: "true",
                              returnUrl: `/admin/companies/${tax.uuid}/edit`,
                            },
                          }}
                        >
                          <div className="hover:bg-accent focus:bg-accent focus:text-accent-foreground  relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none ">
                            <Plus className="w-4 h-4" /> New User
                          </div>
                        </Link>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose an admin for this tax.
                    </FormDescription>
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
