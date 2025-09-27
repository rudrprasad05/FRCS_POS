"use client";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useTaxData } from "./TaxSection";
import { CreateTaxCategory } from "@/actions/Tax";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tax name required" }),
  percentage: z.number().refine(val => val !== undefined, {
    message: "Tax percentage required",
  }),
});

export type NewTaxFormType = z.infer<typeof formSchema>;

export default function NewTaxCategoryDialoge() {
  const { refresh } = useTaxData();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<NewTaxFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", percentage: 0 },
  });

  async function handleSubmit(values: NewTaxFormType) {
    setIsSaving(true);
    const res = await CreateTaxCategory(values);
    if (!res.success) toast.error("Failed to create tax category");
    else {
      toast.success("Tax category created");
      refresh();
      setOpen(false);
      form.reset();
    }
    setIsSaving(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div className={`${buttonVariants({ variant: "default" })} w-full text-start justify-start px-2 my-2`}>
          <Plus className="mr-2 h-4 w-4" />
          New Tax Category
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new tax category</DialogTitle>
          <DialogDescription>Fill in the details below to create a new tax category.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxName" className="text-right">Tax Category Name</Label>
            <Input {...form.register("name")} className="col-span-3" placeholder="e.g. VAT" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxPercentage" className="text-right">Tax Percentage (%)</Label>
            <Input {...form.register("percentage", { valueAsNumber: true })} type="number" step="0.01" className="col-span-3" placeholder="e.g. 12.5" />
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
