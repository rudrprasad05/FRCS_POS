"use client";

import { CreateCompany } from "@/actions/Company";
import { GetUnAssignedUsers } from "@/actions/User";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryObject, User, UserRoles } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { HousePlus, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const selectedUser = searchParams.get("selectedUser");

  const form = useForm<NewCompanyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      adminUserId: selectedUser || "",
    },
  });
  useEffect(() => {
    console.log(searchParams.get("open_create"));
    if (searchParams.get("open_create") === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("open_create");
      router.replace(`${window.location.pathname}?${params.toString()}`);
    }
  }

  useEffect(() => {
    const getData = async () => {
      const data = await GetUnAssignedUsers({
        role: UserRoles.ADMIN,
      } as QueryObject);

      const users = data.data;

      setAdminUsers(users as User[]);

      const admin = users?.find((x) => x.id == selectedUser);
      if (admin == null) {
        router.push("/admin/companies");
      }

      setLoading(false);
    };
    getData();
  }, [open, router, selectedUser]);

  async function onSubmit(values: NewCompanyFormType) {
    setLoading(true);
    const res = await CreateCompany(values);

    if (!res.success) {
      toast.error("Error creating user", { description: res.message });
      setError(res.message);
    } else {
      const params = new URLSearchParams(searchParams.toString());

      toast.success("Company created");
      params.delete("selectedUser");
      form.reset();

      queryClient.invalidateQueries({
        queryKey: ["adminCompanies", {}],
        exact: false,
      });

      setAdminUsers((prev) => prev.filter((x) => x.id != values.adminUserId));

      router.push(`/admin/companies?${params.toString()}`);
      handleOpenChange(false);
    }

    setLoading(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
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
                    <Input placeholder="enter name" {...field} />
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

                      <Link
                        href={{
                          pathname: "/admin/users",
                          query: {
                            open_create: "true",
                            returnUrl: "/admin/companies",
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
