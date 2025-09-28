"use client";

import { CreateUser } from "@/actions/User";
import { Button } from "@/components/ui/button";
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
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { generateStrongPassword } from "@/lib/utils";
import { User, UserRoles } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, CopyCheck, File, Loader2, RotateCw } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export default function NewUserDialoge({
  children,
  onSuccess,
}: {
  onSuccess?: (newUser: User) => void;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

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

  async function onSubmit(values: NewUserForm) {
    setLoading(true);

    let cName = undefined;
    let isComany = false;
    if (companyName && companyName.trim().length > 0) {
      cName = companyName;
      isComany = true;
    }

    const res = await CreateUser(values, { companyName: cName });
    console.log(res);

    if (!res.success) {
      toast.error("Error creating user", { description: res.message });
      setError(res.message);
    } else {
      toast.success("User created");
      const newUser = res.data as User;

      if (onSuccess) onSuccess(res.data as User);
      if (searchParams.get("returnUrl")) {
        router.replace(
          `${searchParams.get("returnUrl")}?selectedUser=${
            newUser.id
          }&open_create=true`
        );
      }

      if (isComany) {
        queryClient.invalidateQueries({
          queryKey: ["companyUsers", companyName, {}],
          exact: false,
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["adminUsers", {}],
          exact: false,
        });
      }

      setOpen(false);
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
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
                      <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
                        <SelectItem value={"SUPERADMIN"}>superadmin</SelectItem>
                      </RoleWrapper>
                      <SelectItem value={"ADMIN"}>admin</SelectItem>
                      <SelectItem value={"CASHIER"}>cashier</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <Label className="text-rose-400">{error}</Label>}
            <Button type="submit" disabled={loading}>
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
            <Button
              onClick={handleDownloadCredentials}
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
