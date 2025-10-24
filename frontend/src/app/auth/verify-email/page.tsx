"use client";

import { RequestReEmailVerification, VerifyEmail } from "@/actions/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type PageState = "resend" | "sent" | "verifying" | "verified" | "failed";

export default function VerifyEmailPage() {
  const [state, setState] = useState<PageState>("verifying");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  const verifyEmail = useCallback(async () => {
    setState("verifying");

    const res = await VerifyEmail({ userId: userId!, uuid: code! });

    if (res.success) {
      setState("verified");
      toast.success("Email verified", { description: "You can now sign in" });
    } else {
      setState("failed");
      toast.error("Verification failed", { description: res.message });
    }
  }, [userId, code]);

  useEffect(() => {
    if (userId && code) {
      verifyEmail();
    } else {
      setState("resend");
    }
  }, [userId, code, verifyEmail]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState("verifying");
    const res = await RequestReEmailVerification(email);

    if (res.success) {
      setState("sent");
      toast.success("Email sent", { description: "Check your spam too" });
    } else {
      setState("resend");
      toast.error("Failed", { description: res.message });
    }
  };

  // State 1 & 2: Resend / Sent
  if (state === "resend" || state === "sent") {
    return (
      <AuthCard
        icon={Mail}
        title={state === "resend" ? "Verify your email" : "Check your email"}
        description={
          state === "resend"
            ? "Enter your email to receive a verification link"
            : `We sent a verification link to ${email}`
        }
      >
        {state === "resend" ? (
          <form onSubmit={handleResend} className="space-y-4">
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
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!email}
            >
              Resend verification link
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              If you don&apos;t see the email, check your spam folder.
            </div>
          </div>
        )}

        <Button variant="ghost" className="w-full" size="lg" asChild>
          <Link href="/auth/login">Already verified? Sign in</Link>
        </Button>
      </AuthCard>
    );
  }

  // State 3 & 4: Verifying / Verified/Failed
  return (
    <AuthCard
      icon={
        state === "verifying"
          ? Loader2
          : state === "verified"
          ? CheckCircle2
          : XCircle
      }
      iconProps={
        state === "verifying"
          ? { className: "animate-spin" }
          : state === "verified"
          ? { className: "text-green-600" }
          : { className: "text-destructive" }
      }
      title={
        state === "verifying"
          ? "Verifying your email..."
          : state === "verified"
          ? "Email verified!"
          : "Verification failed"
      }
      description={
        state === "verifying"
          ? "Please wait while we verify your email address"
          : state === "verified"
          ? "You can now sign in to your account"
          : "The verification link may have expired. Request a new one."
      }
    >
      <div className="space-y-3">
        {state === "verified" && (
          <>
            <Button className="w-full" size="lg" asChild>
              <Link href="/auth/login">Continue to sign in</Link>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link href="/">Return to home</Link>
            </Button>
          </>
        )}

        {state === "failed" && (
          <>
            <Button className="w-full" size="lg" asChild>
              <Link href="/auth/verify-email">Request new link</Link>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link href="/">Return to home</Link>
            </Button>
          </>
        )}
      </div>
    </AuthCard>
  );
}

// ——————————————————————
// Shared Card Wrapper (Reusable!)
// ——————————————————————
function AuthCard({
  icon: Icon,
  iconProps,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  iconProps?: React.SVGProps<SVGSVGElement>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" {...iconProps} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
