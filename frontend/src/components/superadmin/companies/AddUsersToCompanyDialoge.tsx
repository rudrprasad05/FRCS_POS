"use client";

import { AddUserToCompany, GetFullCompanyByUUID } from "@/actions/Company";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Company, User } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  adminUserId: z.string().min(1, {
    message: "Please select an admin.",
  }),
});

export type AddUsersToCompanyFormType = z.infer<typeof formSchema>;

export default function AddUsersToCompanyDialoge() {
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();

  const companyId = String(params.companyId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["editCompany", companyId],
    queryFn: () => GetFullCompanyByUUID(companyId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  const form = useForm<AddUsersToCompanyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminUserId: searchParams.get("selectedUser") || "",
    },
  });

  const company = data?.data as Company;

  useEffect(() => {
    const getData = async () => {
      const data = await GetUnAssignedUsers();

      setAdminUsers(data.data as User[]);

      setLoading(false);
    };
    getData();
  }, []);

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

  async function onSubmit(values: AddUsersToCompanyFormType) {
    setLoading(true);

    const res = await AddUserToCompany(
      values.adminUserId,
      company?.uuid as string
    );

    if (!res.success) {
      toast.error("Error adding user", { description: res.message });
      setError(res.message);
    } else {
      const innerParams = new URLSearchParams(searchParams.toString());
      innerParams.delete("selectedUser");
      innerParams.delete("open_create");

      toast.success("User added");
      router.replace(`${window.location.pathname}?${innerParams.toString()}`);

      queryClient.invalidateQueries({
        queryKey: ["editCompany", companyId],
        exact: false,
      });
      setOpen(false);
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
                      <Link
                        href={{
                          pathname: "/admin/users",
                          query: {
                            open_create: "true",
                            returnUrl: `/admin/companies/${companyId}/view`,
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
