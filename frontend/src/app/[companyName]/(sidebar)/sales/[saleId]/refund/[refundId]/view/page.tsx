"use client";

import { GetRefundByUUID } from "@/actions/Refund";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { RefundStatus } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RefundRequestPage() {
  const params = useParams();
  const refundId = String(params.refundId);
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["viewRefund", refundId],
    queryFn: () => GetRefundByUUID({ uuid: refundId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const refundRequest = data.data;

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case RefundStatus.PENDING:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case RefundStatus.APPROVED:
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case RefundStatus.REJECTED:
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  const calculateRefundTotal = () => {
    if (!refundRequest.items) return 0;
    console.log("ch1", refundRequest.items);
    return refundRequest.items.reduce((total, item) => {
      if (item.saleItem) {
        console.log("ch2", item.saleItem);

        const itemTotal = item.quantity * item.saleItem.productVariant.price;
        const tax = itemTotal * (item.saleItem.taxRatePercent / 100);
        console.log("ch3", itemTotal, tax, total + itemTotal + tax);

        return total + itemTotal + tax;
      }
      return total;
    }, 0);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh or redirect
      router.refresh();
    } catch (error) {
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Refund Request #{refundRequest.id}
              </h1>
              <p className="text-muted-foreground">
                Created on{" "}
                {new Date(refundRequest.createdOn).toLocaleDateString()}
              </p>
            </div>
          </div>
          {getStatusBadge(refundRequest.status)}
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Sale Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {refundRequest.sale?.invoiceNumber}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Requested By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {refundRequest.requestedBy?.username}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {refundRequest.requestedBy?.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Refund Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calculateRefundTotal().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {refundRequest.items?.length || 0} item(s)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Refund Details */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Details</CardTitle>
            <CardDescription>
              Information about this refund request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Reason</h3>
              <p className="text-sm text-muted-foreground">
                {refundRequest.reason || "No reason provided"}
              </p>
            </div>

            {refundRequest.approvedBy && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-1">Approved By</h3>
                  <p className="text-sm text-muted-foreground">
                    {refundRequest.approvedBy.username} (
                    {refundRequest.approvedBy.email})
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Refund Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Items</CardTitle>
            <CardDescription>Items requested for refund</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Tax Rate</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundRequest.items?.map((item) => {
                  const saleItem = item.saleItem;
                  if (!saleItem) return null;

                  const subtotal = item.quantity * saleItem.unitPrice;
                  const tax = subtotal * (saleItem.taxRatePercent / 100);
                  const total = subtotal + tax;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {saleItem.productVariant.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {saleItem.productVariant.sku}
                      </TableCell>
                      <TableCell className="text-right">
                        ${saleItem.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {item.quantity} of {saleItem.quantity + item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {saleItem.taxRatePercent}%
                      </TableCell>
                      <TableCell className="text-right">
                        ${subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${tax.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${total.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {item.note || "-"}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <div className="space-y-2 min-w-[300px]">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>
                    $
                    {refundRequest.items
                      ?.reduce((total, item) => {
                        if (item.saleItem) {
                          return (
                            total + item.quantity * item.saleItem.unitPrice
                          );
                        }
                        return total;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>
                    $
                    {refundRequest.items
                      ?.reduce((total, item) => {
                        if (item.saleItem) {
                          const subtotal =
                            item.quantity * item.saleItem.unitPrice;
                          return (
                            total +
                            subtotal * (item.saleItem.taxRatePercent / 100)
                          );
                        }
                        return total;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Refund:</span>
                  <span>${calculateRefundTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {refundRequest.status === RefundStatus.PENDING && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="lg">
              Reject
            </Button>
            <Button
              size="lg"
              onClick={handleApprove}
              disabled={isApproving}
              className="gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {isApproving ? "Approving..." : "Approve Refund"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
