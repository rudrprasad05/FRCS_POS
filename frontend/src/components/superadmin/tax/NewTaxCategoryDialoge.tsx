"use client";
import { CreateTaxCategory } from "@/actions/Tax";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tax name required" }),
  percentage: z
    .number()
    .min(0, { message: "Rate cannot be negative" })
    .max(100, { message: "Rate cannot exceed 100" }),
});

export type NewTaxFormType = z.infer<typeof formSchema>;

export default function NewTaxCategoryDialoge() {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<NewTaxFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  async function handleSubmit(values: NewTaxFormType) {
    setIsSaving(true);
    const res = await CreateTaxCategory(values);
    if (!res.success) toast.error("Failed to create tax category");
    else {
      toast.success("Tax category created");

      queryClient.invalidateQueries({
        queryKey: ["adminTax", {}],
        exact: false,
      });

      setOpen(false);
      form.reset();
    }
    setIsSaving(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div
          className={`${buttonVariants({
            variant: "default",
          })} w-full text-start justify-start px-2 my-2`}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Tax
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new tax category</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new tax category.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxName" className="text-right">
              Tax Category Name
            </Label>
            <Input
              {...form.register("name")}
              className="col-span-3"
              placeholder="e.g. VAT"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxPercentage" className="text-right">
              Tax Percentage (%)
            </Label>
            <Input
              {...form.register("percentage", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="col-span-3"
              placeholder="[0-100], e.g. 12.5"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
