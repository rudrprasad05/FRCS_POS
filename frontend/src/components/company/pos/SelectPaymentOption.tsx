"use client";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePosSession } from "@/context/PosContext";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SelectPaymentOptionDialog() {
  const [open, setOpen] = useState(false);
  const { cart, isSaving, checkout } = usePosSession();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isSaving || cart.length == 0}
          className="gap-2 w-full mt-2"
        >
          <CheckCircle className="h-4 w-4" />
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Payment Option</DialogTitle>
          <DialogDescription>Select a payment option below</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup defaultValue="cash">
            <Card className="flex flex-row items-center space-x-2 px-4 gap-2">
              <RadioGroupItem value="cash" id="cash" />
              <div className="flex flex-col gap-2">
                <LargeText>Cash</LargeText>
                <MutedText>Allow users to pay by cash</MutedText>
              </div>
            </Card>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={checkout} disabled={isSaving || cart.length == 0}>
            Finish Checkout {isSaving && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
