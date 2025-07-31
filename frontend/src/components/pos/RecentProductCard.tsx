"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types/models";
import { useState } from "react";
import { ImageIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";

export function RecentProductCard({ item }: { item: Product }) {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {};
  return (
    <div
      key={item.id}
      className="bg-white flex flex-col rounded-xl shadow-md overflow-hidden"
    >
      <div className="relative aspect-square h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {isImageValid ? (
          <>
            <Image
              width={100}
              height={100}
              src={"/image.svg"}
              onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                setIsImageValid(false);
              }}
              onLoad={() => setIsImageLoaded(true)}
              alt={item.taxCategory?.name as string}
              className={cn(
                "w-full h-full object-cover",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
            {!isImageLoaded && (
              <div
                className={cn(
                  "absolute top-0 left-0 w-full h-full object-cover bg-gray-300 animate-pulse"
                )}
              ></div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1/2 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {item.name as string}
          </h3>
          <div className="text-xs text-rose-600 font-bold">
            {"$" + item.price}
          </div>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            disabled={item.batches?.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
