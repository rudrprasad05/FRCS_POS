"use client";
import { EndSession } from "@/actions/PosSession";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInForm, SignInFormType } from "@/types/forms/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Pause } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IResumeSession {
  uuid: string;
}

export default function StopPosSessionDialoge({ uuid }: IResumeSession) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const params = useParams();
  const posId = String(params.posId);
  const queryClient = useQueryClient();

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormType) {
    setLoading(true);

    const res = await EndSession(
      {
        PosTerminalUUID: uuid,
        email: values.email,
        password: values.password,
      },
      uuid
    );

    if (res.success) {
      toast.success("Session ended");
      queryClient.invalidateQueries({
        queryKey: ["getPosSessions", posId],
        exact: false,
      });
    } else {
      toast.error("An error occured", { description: res.message });
      setLoading(false);
      setOpen(false);
      //   getPosSessions
      queryClient.invalidateQueries({
        queryKey: ["getPosSessions", posId],
        exact: false,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="gap-2">
          <Pause className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Credentials</DialogTitle>
          <DialogDescription>
            To end a POS Session, enter your credentials
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className=" pr-10"
                          {...field}
                        />
                        <div
                          className="cursor-pointer absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full font-medium"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
