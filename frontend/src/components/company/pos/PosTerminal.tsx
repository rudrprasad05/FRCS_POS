"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Minus, Plus, Trash2 } from "lucide-react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
import { Product, SaleItem, SaleItemOmitted } from "@/types/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePosSession } from "@/context/PosContext";

export default function PosTerminal() {
  const { products, addProduct, checkout } = usePosSession();
  const subtotal = 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  const handleAddProduct = (product: Product) => {
    let sI: SaleItemOmitted = {
      productId: product.id,
      product: product,
      quantity: 1,
      unitPrice: product.price,
      taxRatePercent: 0.15,
      lineTotal: 0,
    };
    addProduct(sI);
  };
  return (
    <div className="max-h-screen flex-col flex min-w-screen overflow-scroll">
      <PosHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 grow min-w-screen p-2">
        {/* Product List */}
        <div className="lg:col-span-2 grid grid-cols-1 max-h-[90vh]">
          <Card className="bg-transparent border-none grid grid-cols-1">
            <CardHeader>
              <CardTitle className="text-primary">Product Catalog</CardTitle>
            </CardHeader>

            <ScrollArea className="w-full gap-4 overflow-auto">
              <div className="grid grid-cols-3 gap-4 pl-6">
                {MOCK_PRODUCTS.map((product) => (
                  <RecentProductCard key={product.uuid} item={product} />
                ))}
              </div>
            </ScrollArea>
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
                <div className="space-y-3 max-h-4/5 overflow-auto">
                  {products.length == 0 && (
                    <div className="w-full h-full border border-dashed rounded-lg grid place-items-center">
                      <div className="text-center text-sm">
                        No Items in cart
                      </div>
                    </div>
                  )}

                  {products.length > 0 &&
                    products.map((item) => (
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
                              handleAddProduct(item.product as Product)
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
                  onClick={checkout}
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
  );
}
