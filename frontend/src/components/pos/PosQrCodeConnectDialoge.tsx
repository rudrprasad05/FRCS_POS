"use client";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { GenerateQr } from "@/actions/PosSession";
import { usePosSession } from "@/context/PosContext";

export default function PosQrCodeConnectDialoge() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);

  const { qr, setQr } = usePosSession();

  const generateQr = async () => {
    const res = await GenerateQr(sessionId);
    setIsQrGenerated(true);
    setQr(`http://10.22.150.126:3000/quickconnect/${res.data?.uuid}`);
    console.log("hit");
    console.log(res);
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
          <DialogTitle className="text-blue-700">
            Connect Barcode Scanner
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <HandleQr isGenerated={isQrGenerated} />

            <Button
              hidden={qr != undefined && qr?.length > 0}
              onClick={() => generateQr()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Generate QR Code
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
  const { qr, setQr } = usePosSession();

  console.log(qr, isGenerated);

  if (isGenerated && qr && qr?.length > 0)
    return (
      <div>
        <div className="bg-gray-100 my-4 w-min h-min mx-auto border-2 border-dashed border-gray-300 rounded-lg">
          <QRCode
            value={qr as string}
            className="w-64 h-64 mx-auto text-gray-400 rounded-lg p-0.5"
          />
        </div>
        <p className="text-sm underline text-black/60">{qr}</p>
      </div>
    );
  else
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
        <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">QR Code will appear here</p>
      </div>
    );
}
