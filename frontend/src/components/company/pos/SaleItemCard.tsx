"use client";

import { Button } from "@/components/ui/button";
import { usePosSession } from "@/context/PosContext";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function SaleItemCard({ item }: { item: SaleItemOmitted }) {
  const { cart, addProduct, deleteProduct, removeProduct } = usePosSession();

  const handleAddProduct = (product: ProductVariant) => {
    const sI: SaleItemOmitted = {
      productVariantId: product.id,
      productVariant: product,
      quantity: 1,
      unitPrice: product.price,
      taxRatePercent: 0.125,
      lineTotal: 0,
    };
    addProduct(sI);
  };

  const handleRemoveProduct = (product: ProductVariant) => {
    removeProduct(product.uuid);
  };

  const handleDeleteProduct = (product: ProductVariant) => {
    deleteProduct(product.uuid);
  };

  return (
    <div
      key={item?.productVariant?.id}
      className="bg-card/20 text-card-foreground flex rounded-xl border shadow-smflex items-center justify-between py-4 px-5"
    >
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item?.productVariant?.name}</h4>
        <p className="text-primary font-semibold">
          ${item.productVariant?.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handleRemoveProduct(item.productVariant as ProductVariant)
          }
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={
            item.productVariant.maxStock !== undefined &&
            (cart.find((c) => c.productVariantId === item.productVariant.id)
              ?.quantity ?? 0) >= item.productVariant.maxStock
          }
          onClick={() =>
            handleAddProduct(item.productVariant as ProductVariant)
          }
        >
          <Plus className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteProduct(item.productVariant)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
