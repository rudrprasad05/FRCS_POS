"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PasswordSection() {
  const [isSending, setIsSending] = useState(false);

  const handleSendResetEmail = async () => {
    setIsSending(true);

    try {
      // TODO: Call your API to send password reset email
      // await fetch('/api/auth/password-reset', {
      //   method: 'POST',
      //   body: JSON.stringify({ email: userEmail })
      // })

      toast.success("Email sent");
    } catch (error) {
      toast.error("Email not sent");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password by requesting a reset link via email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  Password Reset via Email
                </h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  For security reasons, we&apos;ll send a password reset link to
                  your registered email address. Click the link in the email to
                  create a new password.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSendResetEmail}
            disabled={isSending}
            className="w-full sm:w-auto"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
