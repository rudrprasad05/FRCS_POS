import { SoftDeleteCompany } from "@/actions/Company";
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
import { Company } from "@/types/models";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteCompanyDialoge({ data }: { data: Company }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  async function handleDelete() {
    setIsLoading(true);

    const res = await SoftDeleteCompany(data.uuid);

    if (res.success) {
      toast.success("Company Deleted");
      setIsOpen(false);
      setConfirmationText("");
    } else {
      toast.error("Error Occurred");
    }
    setIsLoading(false);
  }

  const isConfirmValid = confirmationText.trim().toLowerCase() === "delete";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-24" asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-24 flex items-center justify-between"
        >
          Delete <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type <b>delete</b> below to
            confirm.
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
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmValid || isLoading}
            className="bg-rose-500 hover:bg-red-600"
            variant="destructive"
          >
            Delete
            {isLoading && <Loader2 className="ml-2 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
