"use client";

import type React from "react";

import { PasswordReset, RequestPasswordReset } from "@/actions/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/types/forms/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "default" | "reset"
  >("loading");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await RequestPasswordReset(email);

    if (res.success) {
      toast.success("Reset email sent", { description: "Check your spam too" });
      setStatus("success");
      return;
    } else {
      toast.error("An error occured", { description: res.message });
      setStatus("error");
      setMessage(res.message as string);
    }
  };

  useEffect(() => {
    if (!code || !userId) {
      setStatus("error");
      setMessage("Invalid verification link. Missing code or user ID.");
      return;
    }
    setStatus("reset");
    setMessage(""); // Clear message when link is valid
  }, [code, userId]);

  if (status == "success") {
    return <Success email={email} />;
  }

  if (status == "reset") {
    return <ResetPassword />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-balance">
              Reset your password
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Enter your email address and we'll send you instructions to reset
              your password
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Button
                disabled={status == "loading"}
                type="submit"
                className="w-full"
                size="lg"
              >
                {status == "loading" && <Loader2 className="animate-spin" />}
                Send reset instructions
              </Button>
              <Button variant="ghost" className="w-full" size="lg" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ResetPassword() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      userId: userId as string,
      code: code as string,
    },
  });
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "default"
  >("default");

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setStatus("loading");
    const res = await PasswordReset(data);

    if (res.success) {
      toast.success("Reset email sent", { description: "Check your spam too" });
      setStatus("success");
      toast.success("Password reset successfully");
      return;
    } else {
      toast.error("An error occured", { description: res.message });
      setStatus("default");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-balance">
              Enter your new password
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Enter a new password to reset access to your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {status == "success" && (
            <>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your password has been reset
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="ghost" className="w-full" size="lg" asChild>
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </>
          )}

          {status != "success" && (
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={status == "loading"}
                    type="submit"
                    className="w-full"
                    size="lg"
                  >
                    {status == "loading" && (
                      <Loader2 className="animate-spin" />
                    )}
                    Reset Password
                  </Button>
                </form>
              </Form>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Try another email
                </Button>
                <Button variant="ghost" className="w-full" size="lg" asChild>
                  <Link href="/auth/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Success({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-balance">
              Check your email
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              We've sent password reset instructions to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you don't receive an email within a few minutes, please check
              your spam folder or try again.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              Try another email
            </Button>
            <Button variant="ghost" className="w-full" size="lg" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
