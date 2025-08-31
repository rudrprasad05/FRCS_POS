"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryObject, User, UserRoles } from "@/types/models";
import { HousePlus, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAllAdmins } from "@/actions/User";
import { CreateCompany } from "@/actions/Company";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useWarehouseData } from "./WarehouseSection";
import { useParams } from "next/navigation";
import { CreateWarehouse } from "@/actions/Warehouse";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "name must be at least 1 character.",
  }),
  location: z.string().min(1, {
    message: "Please select an admin.",
  }),
  companyName: z.string().min(1),
});

export type NewWarehouseType = z.infer<typeof formSchema>;

export default function NewWarehouseDialoge() {
  const { refresh } = useWarehouseData();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const companyName = String(params.companyName);

  const form = useForm<NewWarehouseType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      companyName: companyName,
    },
  });

  useEffect(() => {
    form.setValue("companyName", companyName);
  }, []);

  async function onSubmit(values: NewWarehouseType) {
    setLoading(true);
    console.log(values);
    const res = await CreateWarehouse(values);
    console.log(res);

    if (!res.success) {
      toast.error("Error creating user", { description: res.message });
      setError(res.message);
    } else {
      toast.success("Company created");
      refresh();
      setOpen(false);
    }

    setLoading(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div
          className={`${buttonVariants({
            variant: "default",
          })} w-full text-start justify-start px-2 my-2`}
        >
          <HousePlus />
          New Warehouse
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create new warehouse</DialogTitle>
          <DialogDescription>
            Use this dialoge to create a new warehouse for your company. Here
            you can store goods. It can be a virtual warehouse
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Name</FormLabel>
                  <FormControl>
                    <Input placeholder="enter name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Location</FormLabel>
                  <FormControl>
                    <Input placeholder="enter location" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <Label className="text-rose-400">{error}</Label>}
            <Button type="submit" disabled={loading}>
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
