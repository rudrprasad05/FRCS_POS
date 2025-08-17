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
import { Company, CompanyUser, User } from "@/types/models";
import { HousePlus, Loader2, UserPlus } from "lucide-react";
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
import { AddUserToCompany, CreateCompany } from "@/actions/Company";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useCompanyData } from "@/app/admin/companies/[companyId]/page";

const formSchema = z.object({
  adminUserId: z.string().min(1, {
    message: "Please select an admin.",
  }),
});

export type AddUsersToCompanyFormType = z.infer<typeof formSchema>;

export default function AddUsersToCompanyDialoge() {
  const { refresh, setItem, item } = useCompanyData();

  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const form = useForm<AddUsersToCompanyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminUserId: "",
    },
  });

  useEffect(() => {
    const getData = async () => {
      const data = await GetAllAdmins();
      setAdminUsers(data.data as User[]);

      setLoading(false);
    };
    getData();
  }, []);

  async function onSubmit(values: AddUsersToCompanyFormType) {
    setLoading(true);
    console.log(values);
    return;

    const res = await AddUserToCompany(
      values.adminUserId,
      item?.uuid as string
    );
    console.log(res);

    if (!res.success) {
      toast.error("Error adding user", { description: res.message });
      setError(res.message);
    } else {
      toast.success("User added");
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
          <UserPlus />
          Add User
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add User to Company</DialogTitle>
          <DialogDescription>
            Use this dialoge to add a new user to the company. Ensure you have
            atleast one user before doing so.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
