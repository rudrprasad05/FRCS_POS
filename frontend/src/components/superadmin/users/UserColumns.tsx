"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Company, User } from "@/types/models";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => {
      return <div className="flex gap-2">{+row.id + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const cake = row.original; // Get the entire row data (of type CakeType)

      return <div className="flex gap-2">{cake.username}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const cake = row.original; // Get the entire row data (of type CakeType)

      return <div className="flex gap-2">{cake.role}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const cake = row.original; // Get the entire row data (of type CakeType)

      return <div className="flex gap-2">{cake.role}</div>;
    },
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const cake = row.original;
      return <div className="flex gap-2">{cake.email}</div>;
    },
  },

  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cake = row.original; // Get the entire row data (of type CakeType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link href="/" className="w-24 flex items-center justify-between">
              Edit
              <Edit className="" />
            </Link>
          </Button>
          {/* <DeleteModal cakeType={cake} /> */}
        </div>
      );
    },
  },
];

function DeleteModal({ cakeType }: { cakeType: Company }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsLoading(true);
    try {
      //   const res = await DeleteCakeType(cakeType.uuid);
      setIsLoading(false);
      toast.success("Media Deleted");
      setIsOpen(false);
      //   setList((prevList) =>
      //     prevList.filter((item) => item?.uuid !== cakeType.uuid)
      //   );
    } catch (error) {
      setIsLoading(false);
      toast.error("Error Occured");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-24" asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-24 flex items-center justify-between"
        >
          Delete <Trash className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
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
            className="bg-rose-500 hover:bg-red-600"
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
