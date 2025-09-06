"use client";

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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ConfirmDialogProps = {
  uuid: string;
  title: string;
  description: string;
  confirmWord: string;
  actionLabel: string; // e.g. "Delete" or "Activate"
  successMessage: string;
  errorMessage: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline";
  queryKeys?: Array<(string | number)[]>;
  onConfirm: (uuid: string) => Promise<{ success: boolean }>;
};

export function ConfirmDialog({
  uuid,
  title,
  description,
  confirmWord,
  actionLabel,
  successMessage,
  errorMessage,
  buttonIcon,
  buttonVariant = "default",
  queryKeys,
  onConfirm,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleAction() {
    setIsLoading(true);
    const res = await onConfirm(uuid);

    if (res.success) {
      toast.success(successMessage);
      if (queryKeys) {
        queryKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      }
      router.back();
    } else {
      toast.error(errorMessage);
    }

    setIsOpen(false);
    setIsLoading(false);
    setConfirmation("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full" asChild>
        <Button
          variant={buttonVariant}
          onClick={() => setIsOpen(true)}
          className="w-24 flex items-center justify-between"
        >
          {actionLabel} {buttonIcon}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} To confirm, please type{" "}
            <span className="font-semibold text-muted-foreground">
              {confirmWord}
            </span>{" "}
            below.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder={`Type ${confirmWord} to confirm`}
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
            onClick={handleAction}
            className=""
            variant={buttonVariant}
            disabled={confirmation !== confirmWord || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> {actionLabel}...
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
