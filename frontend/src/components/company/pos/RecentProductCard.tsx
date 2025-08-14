"use client";

<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePosSession } from "@/context/PosContext";
import { cn } from "@/lib/utils";
import { Product, SaleItemOmitted } from "@/types/models";
import { ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
=======
import { cn } from "@/lib/utils";
import { Product } from "@/types/models";
import { ImageIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)

export function RecentProductCard({ item }: { item: Product }) {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
<<<<<<< HEAD
  const { addProduct } = usePosSession();

  const handleAddProduct = (product: Product) => {
    let sI: SaleItemOmitted = {
      productId: product.id,
      product: product,
      quantity: 1,
      unitPrice: product.price,
      taxRatePercent: 0.125,
      lineTotal: product.price,
    };
    addProduct(sI);
  };

  return (
    <Card key={item.id} className="bg-card/20">
      <div className="w-full grow h-full">
        <div className="relative aspect-square h-48  w-full border-b border-solid rounded-t-lg overflow-hidden">
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
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold mb-2">
              {item.name as string}
            </h3>
            <div className="text-xs text-primary-foreground font-bold">
              {"$" + item.price}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 mt-auto">
        <Button
          size="sm"
          //   disabled={item.batches?.length === 0}
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
=======

  const addToCart = (product: Product) => {
    console.log(product);
  };
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
              alt={"image"}
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
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
  );
}
