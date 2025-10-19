"use client";

import { EmailReceiptAsync } from "@/actions/Sale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { EmailReceipt, EmailReceiptSchemaType } from "@/types/forms/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function EmailReceiptDialog() {
  const params = useParams();
  const checkoutId = String(params.checkoutId);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailReceiptSchemaType>({
    resolver: zodResolver(EmailReceipt),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: EmailReceiptSchemaType) {
    setLoading(true);

    const res = await EmailReceiptAsync(checkoutId, values.email);

    if (res.success) {
      toast.success("Email sent");
    } else {
      console.dir(res.message);
      toast.error("Failed to start session", { description: res.message });
    }

    setLoading(false);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger type="button" asChild>
        <div className="bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 rounded-full p-2">
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Receipt</DialogTitle>
          <DialogDescription>
            Enter an email to send the recipt to
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            <DialogFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="button"
                variant={"secondary"}
                className="font-medium"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="font-medium" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
