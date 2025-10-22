"use client";

import { DownloadRecieptFromServer, GetSaleByUUID } from "@/actions/Sale";
import { EmailReceiptDialog } from "@/components/company/pos/EmailReceiptDialog";
import { XSmallText } from "@/components/font/HeaderFonts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sale } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  Check,
  Download,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

// Mock data based on the provided interfaces

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

enum EReceiptPageState {
  LOADING,
  ERROR,
  OK,
}

export default function ReceiptPage() {
  const [sale, setSale] = useState<Sale | undefined>(undefined);
  const [recieptUrl, setRecieptUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const params = useParams();
  const checkoutId = String(params.checkoutId);
  const sessionId = String(params.sessionId);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const queryClient = useQueryClient();

  const [state, setState] = useState<EReceiptPageState>(
    EReceiptPageState.LOADING
  );

  const { date, time } = formatDateTime(
    sale ? sale.createdOn : Date.now.toString()
  );

  const handleDownloadReceipt = async () => {
    if (!sale) return;

    try {
      setIsDownloading(true);

      // Call your API that returns the uploaded S3 PDF URL
      const res = await DownloadRecieptFromServer(sale.invoiceNumber); // or your dedicated endpoint

      if (!res.success || !res.data) {
        toast.error("Failed to fetch receipt");
        return;
      }

      const url = res.data as string;
      setRecieptUrl(url);

      // Automatically trigger browser download
      const link = document.createElement("a");
      link.href = url;
      link.download = `Receipt-${sale.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  const getDate = useCallback(async () => {
    if (!checkoutId) {
      setState(EReceiptPageState.ERROR);
      return;
    }

    const res = await GetSaleByUUID(checkoutId);

    setSale(res.data as Sale);
    setState(EReceiptPageState.OK);
    setRecieptUrl(`${baseUrl}/receipt/` + res.data?.invoiceNumber);
  }, [checkoutId, baseUrl]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["posSessionProducts", sessionId],
      exact: false,
    });
    getDate();
  }, [params, getDate, queryClient, sessionId]);

  if (state == EReceiptPageState.LOADING) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col ">
          <Loader2 className="animate-spin" />
          Loading Reciept
        </div>
      </div>
    );
  }

  if (sale == null || state == EReceiptPageState.ERROR) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex items-center flex-col ">
          <TriangleAlert className="animate-spin" />
          Error during Loading
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Success indicator */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-green-500 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Successful
          </h1>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
        </div>

        {/* Receipt Card */}
        <Card className="p-6 bg-card border border-border">
          {/* Store Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">
              {sale.company?.name.toUpperCase()}
            </h2>
            <p className="text-sm text-muted-foreground">
              Served By: {sale.cashier?.username}
            </p>
          </div>

          <Separator className="mb-1" />

          {/* Transaction Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice #:</span>
              <span className="font-mono">{sale.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Terminal:</span>
              <span>{sale.posSession?.posTerminal?.name}</span>
            </div>
          </div>

          <Separator className="mb-1" />

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Items Purchased</h3>
            {sale?.items?.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-balance">
                      {item.productVariant.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.productVariant.sku}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </span>
                  <span>
                    Tax: {item.productVariant.taxCategory?.ratePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="mb-1" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground/70">Subtotal:</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground/70">Tax Total:</span>
              <span>{formatCurrency(sale.taxTotal)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total:</span>
              <span>{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <Separator className="mb-1" />

          <div className="text-center">
            <QRCode
              value={recieptUrl}
              className="w-64 h-64 mx-auto rounded-lg p-0.5"
            />
            <XSmallText className="text-muted-foreground">
              {recieptUrl}
            </XSmallText>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for shopping with us!</p>
            <p className="mt-1">Please keep this receipt for your records.</p>
          </div>
        </Card>

        <div className="p-4 flex justify-between text-center w-screen absolute top-0 left-0">
          <div className="text-center aspect-square">
            <Button
              variant="outline"
              className=" bg-transparent"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon /> Back
            </Button>
          </div>
          <div className="flex items-start gap-2">
            <div
              onClick={handleDownloadReceipt}
              className="bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 rounded-full p-2"
            >
              {isDownloading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </div>
            <EmailReceiptDialog />
          </div>

          {/* Back to POS Button */}
        </div>
      </div>
    </div>
  );
}
