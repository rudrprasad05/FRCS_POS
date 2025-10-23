"use client";

import { RequestPasswordReset } from "@/actions/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/types/models";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PasswordSection({ user }: { user: User }) {
  const [isSending, setIsSending] = useState(false);

  const handleSendResetEmail = async () => {
    setIsSending(true);

    const res = await RequestPasswordReset(user.email);

    if (res.success) {
      toast.success("Email sent");
    } else {
      toast.error("Email not sent");
    }

    setIsSending(false);
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
