"use client";

import { SoftDeleteProduct } from "@/actions/Product";
import { Button } from "@/components/ui/button";
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
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SoftDeleteDialoge({ uuid }: { uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsLoading(true);

    const res = await SoftDeleteProduct(uuid);

    if (res.success) {
      toast.success("Product Deleted");
      router.back();
    } else {
      toast.error("Error Occured");
    }

    setIsOpen(false);
    setIsLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-24 flex items-center justify-between"
        >
          Delete <Trash className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the cake?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete()}
            className=""
            variant={"destructive"}
          >
            Delete
            {isLoading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
