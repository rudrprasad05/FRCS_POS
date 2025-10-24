"use client";

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
import { ResetPasswordSchema } from "@/types/forms/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PageState = "email" | "sent" | "reset" | "loading";

export default function ResetPasswordPage() {
  const [state, setState] = useState<PageState>("loading");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  // Determine initial state based on URL
  useEffect(() => {
    if (code && userId) {
      setState("reset");
    } else {
      setState("email");
    }
  }, [code, userId]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    const res = await RequestPasswordReset(email);

    if (res.success) {
      setState("sent");
      toast.success("Check your email", { description: "Instructions sent." });
    } else {
      toast.error("Failed", { description: res.message });
      setState("email");
    }
  };

  if (state === "sent") {
    return <EmailSentScreen email={email} />;
  }

  if (state === "reset") {
    return <ResetPasswordForm userId={userId!} code={code!} router={router} />;
  }

  return (
    <EmailInputScreen
      email={email}
      setEmail={setEmail}
      onSubmit={handleRequestReset}
      loading={state === "loading"}
    />
  );
}

function EmailInputScreen({
  email,
  setEmail,
  onSubmit,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email to receive reset instructions."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading || !email}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send instructions"
          )}
        </Button>

        <Button variant="ghost" className="w-full" size="lg" asChild>
          <Link href="/auth/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </Button>
      </form>
    </AuthCard>
  );
}

// ——————————————————————
// 2. Email Sent Screen
// ——————————————————————
function EmailSentScreen({ email }: { email: string }) {
  return (
    <AuthCard
      title="Check your email"
      description={`We sent instructions to ${email}`}
    >
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          If you don’t see the email, check your spam folder.
        </div>

        <Button variant="ghost" className="w-full" size="lg" asChild>
          <Link href="/auth/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}

// ——————————————————————
// 3. Reset Password Form
// ——————————————————————
function ResetPasswordForm({
  userId,
  code,
  router,
}: {
  userId: string;
  code: string;
  router: any;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "", userId, code },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await PasswordReset(data);

    if (res.success) {
      toast.success("Password updated!");
      router.push("/auth/login");
    } else {
      toast.error("Failed", { description: res.message });
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set new password"
      description="Choose a strong password for your account."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={loading}
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
                    placeholder="••••••••"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>

          <Button variant="ghost" className="w-full" size="lg" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}

// ——————————————————————
// Shared Card Wrapper
// ——————————————————————
function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

// ——————————————————————
// Loading Placeholder
// ——————————————————————
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
