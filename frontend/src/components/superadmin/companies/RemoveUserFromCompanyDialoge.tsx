"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Loader2 } from "lucide-react";
import { Company } from "@/types/models";
import { useCompanyData } from "./CompaniesSection";
import { RemoveUserFromCompany, SoftDeleteCompany } from "@/actions/Company";
import { toast } from "sonner";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function RemoveUserFromCompanyDialoge({
  userId,
}: {
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const queryClient = useQueryClient();
  const params = useParams();
  const companyId = String(params.companyId);

  async function handleDelete() {
    setIsLoading(true);

    const res = await RemoveUserFromCompany(userId, companyId);
    if (!res.success) {
      toast.error("Error adding user", { description: res.message });
    } else {
      toast.success("User Removed");
      setConfirmationText("");

      queryClient.invalidateQueries({
        queryKey: ["editCompany", companyId],
        exact: false,
      });

      setIsOpen(false);
    }

    setIsLoading(false);
  }

  const isConfirmValid = confirmationText.trim().toLowerCase() === "delete";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between"
        >
          <Trash />
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
