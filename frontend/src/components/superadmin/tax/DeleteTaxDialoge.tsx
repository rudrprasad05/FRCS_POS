"use client";
import { SoftDeleteTax } from "@/actions/Tax";
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
import { Input } from "@/components/ui/input";
import { TaxCategory } from "@/types/models";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTaxData } from "./TaxSection";

export default function DeleteTaxDialoge({ data }: { data: TaxCategory }) {
  const { refresh } = useTaxData();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmValid = confirmationText.trim().toLowerCase() === "delete";

  async function handleDelete() {
    setIsLoading(true);
    const res = await SoftDeleteTax(data.uuid);
    if (res.success) {
      toast.success("Tax category deleted");
      refresh();
      setIsOpen(false);
      setConfirmationText("");
    } else toast.error("Failed to delete tax category");
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Delete <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tax Category</DialogTitle>
          <DialogDescription>
            Type <b>delete</b> to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Type delete to confirm"
          className="mt-2"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmValid || isLoading}
            variant="destructive"
          >
            Delete{" "}
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
