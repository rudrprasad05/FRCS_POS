"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/models";
import { Computer, HousePlus, Loader2 } from "lucide-react";
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
import { usePosTerminal } from "./POSSection";
import { CreatePosTerminals } from "@/actions/PosTerminal";

export default function NewPosDialoge({
  companyName,
}: {
  companyName: string;
}) {
  const { refresh } = usePosTerminal();

  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await GetAllAdmins();
      setAdminUsers(data.data as User[]);

      setLoading(false);
    };
    getData();
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await CreatePosTerminals(companyName);
      refresh();
      setOpen(false);
      toast.success("Terminal created");
    } catch (error) {
      toast.error("Terminal not created");
    }

    setLoading(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div
          className={`${buttonVariants({
            variant: "default",
          })} w-full text-start justify-start px-2 my-2`}
        >
          <Computer />
          New Terminal
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create new POS Terminal</DialogTitle>
          <DialogDescription>
            Use this dialoge to create a new terminal. All information will be
            auto generated
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => handleClick()}
            type="button"
            disabled={loading}
          >
            Create {loading && <Loader2 className="animate-spin" />}
          </Button>
          <Button type="button" variant={"secondary"} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
