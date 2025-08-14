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
import {
  Copy,
  CopyCheck,
  File,
  HousePlus,
  Loader2,
  RotateCcw,
  RotateCw,
  UserPlus,
} from "lucide-react";
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
import { generateStrongPassword } from "@/lib/utils";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/context/UserDataContext";
<<<<<<< HEAD
import { Label } from "@/components/ui/label";
import { useUsers } from "@/context/UserDataContext";
=======
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)

const formSchema = z.object({
  username: z.string().min(1, {
    message: "username must be at least 1 character.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export type NewUserForm = z.infer<typeof formSchema>;

export default function NewUserDialoge() {
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { refresh, pagination, setPagination } = useUsers();
=======
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
  const [error, setError] = useState<string | undefined>(undefined);

  const { refresh, pagination, setPagination } = useUsers();

  const form = useForm<NewUserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "",
      email: "",
      password: generateStrongPassword(),
    },
  });

  function handleGenerateNewPassword() {
    const newPass = generateStrongPassword();
    form.setValue("password", newPass, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }
<<<<<<< HEAD
=======

  function handleCopyPassword() {
    navigator.clipboard.writeText(form.getValues("password"));
    setIsPasswordCopied(true);
    toast.success("Password copied");

    setTimeout(() => {
      setIsPasswordCopied(false);
    }, 2000);
  }

  function handleDownloadCredentials() {
    const username = form.getValues("username");
    const email = form.getValues("email");
    const password = form.getValues("password");

    const fileContent = `Username: ${username}\nEmail: ${email}\nPassword: ${password}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "credentials.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const getData = async () => {
      const data = await GetAllAdmins();
      setAdminUsers(data.data as User[]);
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)

  function handleCopyPassword() {
    navigator.clipboard.writeText(form.getValues("password"));
    setIsPasswordCopied(true);
    toast.success("Password copied");

    setTimeout(() => {
      setIsPasswordCopied(false);
    }, 2000);
  }

  function handleDownloadCredentials() {
    const username = form.getValues("username");
    const email = form.getValues("email");
    const password = form.getValues("password");

    const fileContent = `Username: ${username}\nEmail: ${email}\nPassword: ${password}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "credentials.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function onSubmit(values: NewUserForm) {
    setLoading(true);
    const res = await CreateUser(values);
    console.log(res);

    if (!res.success) {
      toast.error("Error creating user", { description: res.message });
      setError(res.message);
    } else {
      toast.success("User created");
      refresh();
      setOpen(false);
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription>
            Use this dialoge to create a new user
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

            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input className="grow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  onClick={handleGenerateNewPassword}
                  variant={"outline"}
                >
                  <RotateCw className="" />
                </Button>
                <Button
                  type="button"
                  onClick={handleCopyPassword}
                  variant={"outline"}
                >
                  {!isPasswordCopied ? <Copy className="" /> : <CopyCheck />}
                </Button>
              </div>
            </div>

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
<<<<<<< HEAD
            {error && <Label className="text-rose-400">{error}</Label>}
            <Button type="submit" disabled={loading}>
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
            <Button
              onClick={handleDownloadCredentials}
=======
            <Button type="submit">Submit</Button>
            <Button
              onClick={handleDownloadCredentials}
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
              variant={"secondary"}
              type="button"
              className="ml-2 items-center "
            >
              <File />
              Download
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
