"use client";
import { CreateNewPosSession } from "@/actions/PosSession";
import { H2, LargeText, MutedText, P } from "@/components/font/HeaderFonts";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { usePosSession } from "@/context/PosContext";
import { CheckCircle, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { validate as uuidValidate } from "uuid";

interface NewSessionDialogProps {
  terminalId: string;
}

export default function SelectPaymentOptionDialog() {
  const [open, setOpen] = useState(false);
  const { products, isSaving, addProduct, checkout, removeProduct } =
    usePosSession();
  const [paymentOption, setPaymentOption] = useState("cash");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isSaving || products.length == 0}
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
          <RadioGroup
            defaultValue="cash"
            onValueChange={(val) => setPaymentOption(val)}
          >
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
          <Button
            onClick={checkout}
            disabled={isSaving || products.length == 0}
          >
            Finish Checkout {isSaving && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
