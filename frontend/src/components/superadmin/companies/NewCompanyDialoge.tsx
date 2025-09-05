"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryObject, User, UserRoles } from "@/types/models";
import { HousePlus, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAllAdmins } from "@/actions/User";
import { useCompanyData } from "./CompaniesSection";
import { CreateCompany } from "@/actions/Company";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "name must be at least 1 character.",
  }),
  adminUserId: z.string().min(1, {
    message: "Please select an admin.",
  }),
});

export type NewCompanyFormType = z.infer<typeof formSchema>;

export default function NewCompanyDialoge() {
  const { refresh } = useCompanyData();

  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const form = useForm<NewCompanyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      adminUserId: "",
    },
  });

  useEffect(() => {
    const getData = async () => {
      const data = await GetAllAdmins({ role: UserRoles.ADMIN } as QueryObject);
      console.log(data);
      setAdminUsers(data.data as User[]);

      setLoading(false);
    };
    getData();
  }, []);

  async function onSubmit(values: NewCompanyFormType) {
    setLoading(true);
    const res = await CreateCompany(values);
    console.log(res);

    if (!res.success) {
      toast.error("Error creating user", { description: res.message });
      setError(res.message);
    } else {
      toast.success("Company created");
      refresh();
      setOpen(false);
    }

    setLoading(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div
          className={`${buttonVariants({
            variant: "default",
          })} w-full text-start justify-start px-2 my-2`}
        >
          <HousePlus />
          New Company
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create new company</DialogTitle>
          <DialogDescription>
            Use this dialoge to create a new company. Ensure you have atleast
            one user before doing so.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the public display name.
                  </FormDescription>
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
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose an admin for this company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <Label className="text-rose-400">{error}</Label>}
            <Button type="submit" disabled={loading}>
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
