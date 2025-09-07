"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePosSession } from "@/context/PosContext";
import { Search } from "lucide-react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
import SaleItemCard from "./SaleItemCard";
import SelectPaymentOptionDialog from "./SelectPaymentOption";
import { Product } from "@/types/models";
import { useEffect, useRef, useState } from "react";

interface ICheckoutData {
  taxTotal: number;
  subtotal: number;
  total: number;
}

export default function PosTerminal() {
  const { cart, products, moneyValues, loadMore, removeProduct } =
    usePosSession();

  const { taxTotal, total, subtotal } = moneyValues;
  const [isLoadingNewProducts, setIsLoadingNewProducts] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsLoadingNewProducts(true);
          loadMore(); // call context loadMore function
          setIsLoadingNewProducts(false);
        }
      },
      {
        root: null, // viewport
        rootMargin: "200px", // start loading before reaching bottom
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef, loadMore]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PosHeader />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 p-2 min-h-0">
        {/* Product List */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="bg-transparent border-none flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 flex items-center w-full gap-6">
              <CardTitle className="text-primary">Product Catalog</CardTitle>
              <div className="flex items-center gap-2 grow">
                <Input placeholder="Search by barcode or SKU" />
                <Search />
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="grid grid-cols-3 gap-4 pl-6 pb-4">
                {products.map((product) => (
                  <RecentProductCard
                    key={product?.uuid}
                    item={product as Product}
                  />
                ))}
              </div>
              {isLoadingNewProducts && <>i slaoding</>}
              <div ref={loadMoreRef}></div>
            </ScrollArea>
          </Card>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="bg-transparent border-none flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-primary">Current Order</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 min-h-0">
              <div className="flex flex-col flex-1 min-h-0">
                {/* Cart Items - Scrollable */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {products.length === 0 && (
                        <div className="w-full h-80 border border-dashed rounded-lg grid place-items-center">
                          <div className="text-center text-sm">
                            No Items in cart
                          </div>
                        </div>
                      )}

                      {cart.length > 0 &&
                        cart.map((item) => (
                          <SaleItemCard key={item.product.uuid} item={item} />
                        ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Order Summary and Checkout - Fixed at bottom */}
                <div className="flex-shrink-0 pt-4">
                  <Separator className="mb-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (12.5%):</span>
                      <span>${taxTotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>

                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <SelectPaymentOptionDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
