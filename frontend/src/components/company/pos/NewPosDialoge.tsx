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
import { Computer, Loader2 } from "lucide-react";
import { useState } from "react";

import { CreatePosTerminals } from "@/actions/PosTerminal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function NewPosDialoge({
  companyName,
}: {
  companyName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = async () => {
    setLoading(true);

    const res = await CreatePosTerminals(companyName);

    if (res.success) {
      setOpen(false);
      toast.success("Terminal created");
      queryClient.invalidateQueries({
        queryKey: ["posTerminals", companyName],
      });
    } else {
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
