"use client";

import { LoadingProductsPosCard } from "@/components/global/LoadingContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePosSession } from "@/context/PosContext";
import { ESortBy, ProductVariant } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { PackageOpen, RefreshCcw, Search } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
import SaleItemCard from "./SaleItemCard";
import SelectPaymentOptionDialog from "./SelectPaymentOption";

export default function PosTerminal() {
  const {
    cart,
    products,
    moneyValues,
    loadMore,
    pagination,
    setPagination,
    isProductsLoading,
  } = usePosSession();
  const { taxTotal, total, subtotal } = moneyValues;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const queryClient = useQueryClient();

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearch(urlSearch);
    if (urlSearch) {
      setPagination((prev) => ({ ...prev, pageNumber: 1, search: urlSearch }));
    }
  }, [searchParams, setPagination]);

  const handleSearch = useCallback(() => {
    const trimmed = search.trim();
    router.push(`?search=${encodeURIComponent(trimmed)}`, { scroll: false });
    setPagination((prev) => ({ ...prev, pageNumber: 1, search: trimmed }));
  }, [search, router, setPagination]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterReset = () => {
    router.push("?");
    setSearch("");
    setPagination((prev) => ({
      ...prev,
      pageNumber: 1,
      search: undefined,
    }));
    queryClient.invalidateQueries({
      queryKey: [
        "posSessionProducts",
        sessionId,
        { ...pagination, search: undefined },
      ],
      exact: false,
    });
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMore(); // call context loadMore function
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

  console.log(products);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PosHeader />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 p-2 min-h-0">
        {/* Product List */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="bg-transparent border-none flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0 flex items-center w-full gap-6">
              <CardTitle className="text-primary">Product Catalog</CardTitle>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                <Input
                  value={search}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleFilterReset}
                disabled={
                  !pagination.search &&
                  !pagination.isDeleted &&
                  pagination.sortBy === ESortBy.DSC
                }
              >
                <RefreshCcw />
              </Button>
            </CardHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="grid grid-cols-3 gap-4 pl-6 pb-4">
                {products.map((product) => (
                  <RecentProductCard
                    key={product?.uuid}
                    item={product as ProductVariant}
                  />
                ))}
                {isProductsLoading &&
                  Array.from({ length: 6 }, (_, i) => (
                    <LoadingProductsPosCard key={i} />
                  ))}
              </div>
              {products.length === 0 && (
                <div className="ml-6 mb-4 w-full h-80 grid place-items-center">
                  <div className="text-center text-xl flex flex-col items-center">
                    <PackageOpen className="w-24 h-24 stroke-1" />
                    No Items to Display
                  </div>
                </div>
              )}
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
                      {cart.length === 0 && (
                        <div className="w-full h-80 border border-dashed rounded-lg grid place-items-center">
                          <div className="text-center text-sm">
                            No Items in cart
                          </div>
                        </div>
                      )}

                      {cart.length > 0 &&
                        cart.map((item) => (
                          <SaleItemCard
                            key={item.productVariant.uuid}
                            item={item}
                          />
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
