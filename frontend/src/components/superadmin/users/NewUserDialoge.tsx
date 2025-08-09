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
import { User } from "@/types/models";
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
import { CreateUser, GetAllAdmins } from "@/actions/User";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "username must be at least 1 character.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  email: z.email(),
});

export type NewUserForm = z.infer<typeof formSchema>;

export default function NewUserDialoge() {
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<NewUserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "",
      email: "",
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

  async function onSubmit(values: NewUserForm) {
    const res = await CreateUser(values);
    console.log(res);
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={`${buttonVariants({
            variant: "default",
          })} w-full text-start justify-start px-2 my-2`}
        >
          <UserPlus />
          New User
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Select role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value={"SUPERADMIN"}>superadmin</SelectItem>
                      <SelectItem value={"ADMIN"}>admin</SelectItem>
                      <SelectItem value={"CASHIER"}>cashier</SelectItem>
                      <SelectItem value={"USER"}>user</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
