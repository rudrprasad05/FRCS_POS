"use client";

import { ActivateProduct, SoftDeleteProduct } from "@/actions/Product";
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
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ActivateDialoge({ uuid }: { uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleDelete() {
    setIsLoading(true);

    const res = await ActivateProduct(uuid);

    if (res.success) {
      toast.success("Product Activated");
      queryClient.invalidateQueries({
        queryKey: ["editProduct", uuid],
      });
      router.back();
    } else {
      toast.error("Error Occured");
    }

    setIsOpen(false);
    setIsLoading(false);
    setConfirmation("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full" asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-24 flex items-center justify-between"
        >
          Activate <Check className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm, please type{" "}
            <span className="font-semibold text-muted-foreground">
              activate
            </span>{" "}
            below.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Type activate to confirm"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="mt-2"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setIsOpen(false);
                setConfirmation("");
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className=""
            variant="default"
            disabled={confirmation !== "activate" || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Activating
              </>
            ) : (
              "Activate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
