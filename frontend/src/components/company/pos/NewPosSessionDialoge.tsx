"use client";
import { CreateNewPosSession } from "@/actions/PosSession";
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
import { PosTerminal } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { validate as uuidValidate } from "uuid";

interface NewSessionDialogProps {
  terminal: PosTerminal;
}

export default function NewSessionDialog({ terminal }: NewSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormType) {
    setLoading(true);

    if (!terminal.isActive) {
      toast.error("Activate terminal first");
      setLoading(false);

      return;
    }

    const res = await CreateNewPosSession({
      PosTerminalUUID: terminal.uuid,
      email: values.email,
      password: values.password,
    });

    if (res.success) {
      const url = res.data?.uuid;
      if (uuidValidate(url)) {
        toast.success("Session created. Redirecting");
        router.push(`session/${url}`);
      } else {
        toast.error("Session url was invalid");
        console.error("Invalid UUID:", url);
      }
    } else {
      console.error("Failed to start session:", res.message);
      toast.error("Failed to start session", { description: res.message });
    }

    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!terminal.isActive}>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Start New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Credentials</DialogTitle>
          <DialogDescription>
            To start a new POS Session, enter your credentials
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
                        disabled={loading}
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
                          disabled={loading}
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
