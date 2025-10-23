"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePosSession } from "@/context/PosContext";
import { cn } from "@/lib/utils";
import { ProductVariant, SaleItemOmitted } from "@/types/models";
import { Coins, ImageIcon, Plus, Warehouse } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function RecentProductCard({ item }: { item: ProductVariant }) {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { addProduct, cart } = usePosSession();

  const handleAddProduct = (product: ProductVariant) => {
    const sI: SaleItemOmitted = {
      productVariantId: product.id,
      productVariant: product,
      quantity: 1,
      unitPrice: product.price,
      taxRatePercent: 0.125,
      lineTotal: product.price,
    };
    addProduct(sI);
  };

  return (
    <Card key={item.id} className="bg-card/20 py-0">
      <div className="w-full grow h-full">
        <div className="relative aspect-square h-48  w-full border-b border-solid rounded-t-lg overflow-hidden">
          {isImageValid ? (
            <>
              <Image
                width={100}
                height={100}
                src={item.media?.url as string}
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  setIsImageValid(false);
                }}
                onLoad={() => setIsImageLoaded(true)}
                alt={"image"}
                className={cn(
                  "w-full h-full object-cover",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
              {!isImageLoaded && (
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-full object-cover  animate-pulse"
                  )}
                ></div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center ">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="p-4 flex-1/2 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold mb-2">
              <div>{item.name as string}</div>
              <div className="text-xs font-light">
                SKU: {item.sku as string}
              </div>
              <div className="text-xs font-light">{item.barcode as string}</div>
            </h3>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-light">{"$" + item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <Warehouse className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-light">{item.maxStock}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 mt-auto">
        <Button
          size="sm"
          disabled={
            item.maxStock !== undefined &&
            (cart.find((c) => c.productVariantId === item.id)?.quantity ?? 0) >=
              item.maxStock
          }
          onClick={(e) => {
            e.stopPropagation();
            handleAddProduct(item);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
    </Card>
  );
}
