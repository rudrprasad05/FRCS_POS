"use client";

import { GetSaleByUuid } from "@/actions/Sale";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { SaleStatus } from "@/types/enum";
import { ProductVariant, Sale, SaleItem } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  ImageIcon,
  Loader2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RefundData, RefundDialog } from "./RefundDialoge";

const getStatusColor = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.Completed:
      return "default";
    case SaleStatus.Pending:
      return "secondary";
    case SaleStatus.Voided:
      return "destructive";
    case SaleStatus.Refunded:
      return "outline";
    default:
      return "secondary";
  }
};

export default function SaleDetailPage() {
  const params = useParams();
  const saleId = String(params.saleId);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundedItemIds, setRefundedItemIds] = useState<Set<number>>(
    new Set()
  );
  const [refundHistory, setRefundHistory] = useState<
    Array<RefundData & { date: string; id: number }>
  >([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["viewSale", saleId],
    queryFn: () => GetSaleByUuid({ uuid: saleId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  const handleRefund = (refundData: RefundData) => {
    console.log("[v0] Processing refund:", refundData);

    // Add to refund history
    const newRefund = {
      ...refundData,
      date: new Date().toISOString(),
      id: refundHistory.length + 1,
    };
    setRefundHistory((prev) => [...prev, newRefund]);

    // Mark items as refunded
    const newRefundedIds = new Set(refundedItemIds);
    refundData.items.forEach((item) => {
      const saleItem = sale.items?.find((si) => si.id === item.saleItemId);
      if (saleItem && item.quantity === saleItem.quantity) {
        // Fully refunded
        newRefundedIds.add(item.saleItemId);
      }
    });
    setRefundedItemIds(newRefundedIds);

    // TODO: Make API call to backend
    // await fetch(`/api/sales/${id}/refund`, {
    //   method: 'POST',
    //   body: JSON.stringify(refundData)
    // })
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const sale = data.data as Sale;

  console.log("kdkd", sale);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold">Sale Details</h1>
                <div className="text-sm text-muted-foreground">
                  #{sale.invoiceNumber}
                </div>
              </div>
              <p className="text-muted-foreground">
                View and manage sale information
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor(sale.status)} className="text-sm">
            {sale.status}
          </Badge>
        </div>

        {/* Sale Overview */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cashier</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sale.cashier?.username}</div>
              <p className="text-xs text-muted-foreground">
                {sale.cashier?.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(sale.createdOn).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(sale.createdOn).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${sale.total.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Tax: ${sale.taxTotal.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Items and Refunds */}

        <Tabs defaultValue="items" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="items">
                Sale Items ({sale.items?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="refunds">
                Refunds ({sale.refunds?.length || 0})
              </TabsTrigger>
            </TabsList>

            <RefundDialog
              open={isRefundDialogOpen}
              onOpenChange={setIsRefundDialogOpen}
              saleItems={sale.items as SaleItem[]}
              onRefund={handleRefund}
            />
          </div>
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Items Purchased</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Tax Rate</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sale.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <ImageDisplay prod={item.productVariant} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.productVariant.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.productVariant.product.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">
                            {item.productVariant.sku}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.productVariant.product.taxCategory?.ratePercent}
                          %
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.lineTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${sale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${sale.taxTotal.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${sale.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Refund Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {sale.refunds && sale.refunds.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sale.refunds.map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell>
                            {new Date(refund.createdOn).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{refund.reason}</TableCell>
                          <TableCell className="text-right">
                            {/* ${refund.amount.toFixed(2)} */}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{refund.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No Refunds</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      This sale has no refund requests.
                    </p>
                    <Button variant="outline" disabled>
                      Request Refund (Coming Soon)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Company
              </p>
              <p className="text-base">{sale.company?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                POS Session
              </p>
              <p className="text-base">{sale.posSession?.uuid}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p className="text-base">
                {new Date(sale.createdOn).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-base">
                {new Date(sale.updatedOn).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ImageDisplay = ({ prod }: { prod: ProductVariant }) => {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="relative object-cover aspect-square h-16 w-full rounded-md overflow-hidden">
      {isImageValid ? (
        <>
          <Image
            width={100}
            height={100}
            src={prod.media?.url as string}
            onError={(e) => {
              e.currentTarget.onerror = null;
              setIsImageValid(false);
            }}
            onLoad={() => setIsImageLoaded(true)}
            alt="image"
            className={cn(
              "w-full h-full object-cover",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {!isImageLoaded && (
            <div className="absolute top-0 left-0 w-full h-full object-cover animate-pulse"></div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center ">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
