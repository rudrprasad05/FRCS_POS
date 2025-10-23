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
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailConfirmPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "default" | "sent"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      //   if (!code && !userId) {
      //     setStatus("default");
      //     setMessage("Invalid verification link. No token provided.");
      //     return;
      //   }
      //   if (!code || !userId) {
      //     setStatus("default");
      //     setMessage("Invalid verification link. No token provided.");
      //     return;
      //   }
      if (!code || !userId) {
        setStatus("default");
        return;
      }

      const res = await VerifyEmail({ userId: userId, uuid: code });
      console.log(res);
      if (res.success) {
        setStatus("success");
        setMessage(res.message || "Your email has been successfully verified!");
        toast.success("Email verified", { description: "You can now login" });
      } else {
        setStatus("error");
        setMessage(res.message || "Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [code, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await RequestReEmailVerification(email);

    if (res.success) {
      toast.success("Email resent", { description: "Check your spam too" });
      setStatus("sent");
      return;
    } else {
      toast.error("An error occured", { description: res.message });
      setMessage(res.message || "Verification failed. Please try again.");
      setStatus("error");
    }
  };

  if (status == "sent") {
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-balance">
            Email sent
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox and click the link to verify your account.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>;
  }

  if (status == "default") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-balance">
                Verify your email
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                We&apos;ve sent a verification link to your email address.
                Please check your inbox and click the link to verify your
                account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <Button type="submit" className="w-full" size="lg">
                  Resend Verification Link
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already verified?{" "}
              <Link
                href="/auth/login"
                className="text-foreground font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {status === "loading" && (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="w-8 h-8 text-destructive" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-balance">
              {status === "loading" && "Verifying your email..."}
              {status === "success" && "Email verified!"}
              {status === "error" && "Verification failed"}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <Link href="/auth/login">Continue to sign in</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
                asChild
              >
                <Link href="/">Return to home</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button className="w-full" size="lg" asChild>
                <Link href="/auth/verify-email">
                  Request new verification link
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
                asChild
              >
                <Link href="/">Return to home</Link>
              </Button>
            </div>
          )}

          {status === "loading" && (
            <p className="text-center text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
