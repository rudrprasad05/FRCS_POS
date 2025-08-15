"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePosSession } from "@/context/PosContext";
import { Product, SaleItem, SaleItemOmitted } from "@/types/models";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

export default function SaleItemCard({ item }: { item: SaleItemOmitted }) {
  const { products, addProduct, deleteProduct, removeProduct } =
    usePosSession();

  const handleAddProduct = (product: Product) => {
    let sI: SaleItemOmitted = {
      productId: product.id,
      product: product,
      quantity: 1,
      unitPrice: product.price,
      taxRatePercent: 0.125,
      lineTotal: 0,
    };
    addProduct(sI);
  };

  const handleRemoveProduct = (product: Product) => {
    removeProduct(product.uuid);
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.uuid);
  };

  return (
    <div
      key={item?.product?.id}
      className="bg-card/20 text-card-foreground flex rounded-xl border shadow-smflex items-center justify-between py-4 px-5"
    >
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item?.product?.name}</h4>
        <p className="text-primary font-semibold">
          ${item.product?.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRemoveProduct(item.product as Product)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddProduct(item.product as Product)}
        >
          <Plus className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteProduct(item.product)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
