"use client";
import { CreateNewPosSession } from "@/actions/PosSession";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { validate as uuidValidate } from "uuid";

interface NewSessionDialogProps {
  terminalId: string;
}

export default function NewSessionDialog({
  terminalId,
}: NewSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStartSession() {
    setLoading(true);
    try {
      const res = await CreateNewPosSession({
        PosTerminalUUID: terminalId,
      });

      const url = res.data?.uuid;
      if (uuidValidate(url)) {
        toast.success("Session created. Redirecting");
        router.push(`${terminalId}/session/${url}`);
      } else {
        toast.error("Session url was invalid");
        console.error("Invalid UUID:", url);
      }
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Start New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Session</DialogTitle>
          <DialogDescription>
            Start a new POS session for this terminal. This will begin tracking
            sales and transactions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="operator" className="text-right">
              Operator
            </Label>
            <Input
              id="operator"
              placeholder="Enter operator name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Optional session notes"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartSession} disabled={loading}>
            {loading ? "Starting..." : "Start Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
