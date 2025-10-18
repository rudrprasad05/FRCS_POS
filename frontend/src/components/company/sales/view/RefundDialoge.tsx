"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SaleItem } from "@/types/models";
import { AlertCircle, Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleItems: SaleItem[];
  onRefund: (refundData: RefundData) => void;
}

export interface RefundData {
  items: Array<{
    saleItemId: number;
    quantity: number;
    productName: string;
    unitPrice: number;
  }>;
  reason: string;
  totalAmount: number;
}

export function RefundDialog({
  open,
  onOpenChange,
  saleItems,
  onRefund,
}: RefundDialogProps) {
  const [refundQuantities, setRefundQuantities] = useState<
    Record<number, number>
  >({});
  const [reason, setReason] = useState("");

  // Calculate refund totals
  const refundSummary = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;
    const items: RefundData["items"] = [];

    Object.entries(refundQuantities).forEach(([itemId, quantity]) => {
      if (quantity > 0) {
        const item = saleItems.find((i) => i.id === Number(itemId));
        if (item) {
          const itemSubtotal = item.unitPrice * quantity;
          const itemTax = itemSubtotal * (item.taxRatePercent / 100);
          subtotal += itemSubtotal;
          taxTotal += itemTax;

          items.push({
            saleItemId: item.id,
            quantity,
            productName: item.productVariant.name,
            unitPrice: item.unitPrice,
          });
        }
      }
    });

    return {
      items,
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  }, [refundQuantities, saleItems]);

  const handleQuantityChange = (
    itemId: number,
    newQuantity: number,
    maxQuantity: number
  ) => {
    const clampedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
    setRefundQuantities((prev) => ({
      ...prev,
      [itemId]: clampedQuantity,
    }));
  };

  const handleRefundAll = () => {
    const allQuantities: Record<number, number> = {};
    saleItems.forEach((item) => {
      allQuantities[item.id] = item.quantity;
    });
    setRefundQuantities(allQuantities);
  };

  const handleClearAll = () => {
    setRefundQuantities({});
  };

  const handleSubmit = () => {
    if (refundSummary.items.length === 0) {
      return;
    }

    onRefund({
      items: refundSummary.items,
      reason,
      totalAmount: refundSummary.total,
    });

    // Reset form
    setRefundQuantities({});
    setReason("");
    onOpenChange(false);
  };

  const hasSelectedItems = refundSummary.items.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger type="button" asChild>
        <Button>
          <RotateCcw /> Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Select items and quantities to refund. The items will be
            automatically restocked.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefundAll}>
              Refund All Items
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear Selection
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Select Items to Refund
            </Label>
            <div className="space-y-2">
              {saleItems.map((item) => {
                const refundQty = refundQuantities[item.id] || 0;
                const isSelected = refundQty > 0;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          handleQuantityChange(
                            item.id,
                            checked ? item.quantity : 0,
                            item.quantity
                          );
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.productVariant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.unitPrice.toFixed(2)} × {item.quantity} = $
                          {item.lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              refundQty - 1,
                              item.quantity
                            )
                          }
                          disabled={refundQty === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={refundQty}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              Number.parseInt(e.target.value) || 0,
                              item.quantity
                            )
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              refundQty + 1,
                              item.quantity
                            )
                          }
                          disabled={refundQty >= item.quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-sm text-muted-foreground">
                          Max: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refund Summary */}
          {hasSelectedItems && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Refund Summary
              </h4>
              <div className="space-y-2 text-sm">
                {refundSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${refundSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${refundSummary.taxTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total Refund</span>
                  <span>${refundSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Refund Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for refund (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasSelectedItems}>
            Process Refund{" "}
            {hasSelectedItems && `($${refundSummary.total.toFixed(2)})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
