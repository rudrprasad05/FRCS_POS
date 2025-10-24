"use client";
import { MutedText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePosSession } from "@/context/PosContext";
import { Loader2, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export default function PosQrCodeConnectDialoge() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const { isScannerConnectedToServer } = usePosSession();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://frcs.procyonfiji.com";
  console.log("wewe", baseUrl);

  const { qr, setQr } = usePosSession();

  const generateQr = () => {
    setIsGeneratingQr(true);
    try {
      setQr(`${baseUrl}/quickconnect/${sessionId}`);
      setIsQrGenerated(true);
    } catch (error) {
      toast.error("Error generating QR Code", { description: error as string });
    } finally {
      setIsGeneratingQr(false);
    }
  };

  return (
    <Dialog open={isBarcodeScannerOpen} onOpenChange={setIsBarcodeScannerOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode /> Scan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="">Connect Barcode Scanner</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <HandleQr isGenerated={isQrGenerated} />

            <Button
              hidden={qr != undefined && qr?.length > 0}
              onClick={() => generateQr()}
              className=""
            >
              Generate QR Code{" "}
              {isGeneratingQr && <Loader2 className="animate-spin" />}
            </Button>
          </div>

          <div className="space-y-3">
            <MutedText className="">Instructions:</MutedText>
            <ol className="list-decimal list-inside space-y-2 text-sm ">
              <li>Download the barcode scanner app on your mobile phone</li>
              <li>Click &quot;Generate QR Code&quot; above</li>
              <li>Scan the QR code with your mobile app</li>
              <li>Your phone is now connected as a barcode scanner</li>
              <li>Scan product barcodes to add items to the cart</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setIsBarcodeScannerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!isScannerConnectedToServer}
              className="flex-1 "
              onClick={() => {
                alert("Barcode scanner connected successfully!");
                setIsBarcodeScannerOpen(false);
              }}
            >
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HandleQr({ isGenerated }: { isGenerated: boolean }) {
  const { qr } = usePosSession();

  if (isGenerated && qr && qr?.length > 0)
    return (
      <div>
        <div className=" my-4 w-min h-min mx-auto border-2 border-dashed  rounded-lg">
          <QRCode
            value={qr as string}
            className="w-64 h-64 mx-auto rounded-lg p-0.5"
          />
        </div>
        <p className="text-sm underline ">{qr}</p>
      </div>
    );
  else
    return (
      <div className=" border-2 border-dashed  rounded-lg p-8 mb-4">
        <QrCode className="w-16 h-16 mx-auto mb-4" />
        <p className="">QR Code will appear here</p>
      </div>
    );
}
