"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Minus, Plus, Trash2 } from "lucide-react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/models";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PosTerminal() {
  const { items, updateQuantity, handleCheckout, removeFromCart } = useCart();
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product as Product).price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;
  return (
    <div className="min-h-screen flex-col flex min-w-screen">
      <PosHeader />

      <div className="container mx-auto p-2 h-full min-w-screen grow grid grid-cols-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Product List */}
          <div className="lg:col-span-2 grid grid-cols-1">
            <Card className="bg-transparent border-none ">
              <CardHeader>
                <CardTitle className="text-primary">Product Catalog</CardTitle>
              </CardHeader>
              <CardContent className="overflow-scroll">
                <ScrollArea className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_PRODUCTS.map((product) => (
                    <RecentProductCard key={product.uuid} item={product} />
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1 h-full">
            <Card className="sticky top-6 h-full bg-transparent border-none">
              <CardHeader>
                <CardTitle className="text-primary">Current Order</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full flex flex-col">
                  <div className="space-y-3 h-[400px] max-h-4/5 overflow-auto">
                    {items.length == 0 && (
                      <div className="w-full h-full border border-dashed rounded-lg grid place-items-center">
                        <div className="text-center text-sm">
                          No Items in cart
                        </div>
                      </div>
                    )}

                    {items.length > 0 &&
                      items.map((item) => (
                        <div
                          key={item?.product?.id}
                          className="flex items-center justify-between p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {item?.product?.name}
                            </h4>
                            <p className="text-blue-600 font-semibold">
                              ${item.product?.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product?.uuid as string,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product?.uuid as string,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeFromCart(item.product?.uuid as string)
                              }
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Separator className="my-4 mt-auto" />

                  {/* Order Summary */}
                  <div className="space-y-2 ">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full mt-4 font-semibold py-3"
                    size="lg"
                  >
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
