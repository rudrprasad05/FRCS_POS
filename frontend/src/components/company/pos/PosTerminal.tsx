"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
=======

>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
import { Separator } from "@/components/ui/separator";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Minus, Plus, Trash2 } from "lucide-react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
<<<<<<< HEAD
import { Product, SaleItem, SaleItemOmitted } from "@/types/models";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePosSession } from "@/context/PosContext";
import SaleItemCard from "./SaleItemCard";
import { useEffect, useState } from "react";

interface ICheckoutData {
  taxTotal: number;
  subtotal: number;
  total: number;
}

export default function PosTerminal() {
  const { products, addProduct, checkout, removeProduct } = usePosSession();
  const [checkoutData, setCheckoutData] = useState<ICheckoutData>({
    taxTotal: 0,
    subtotal: 0,
    total: 0,
  });

  useEffect(() => {
    console.log(products);
    let taxTotal: number = 0,
      subtotal: number = 0,
      total: number = 0;
    products.forEach((i) => {
      taxTotal = taxTotal + i.lineTotal * i.taxRatePercent;
      subtotal = subtotal + i.lineTotal;
    });
    total = taxTotal + subtotal;
    setCheckoutData({ taxTotal, subtotal, total });
  }, [products]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PosHeader />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 p-2 min-h-0">
        {/* Product List */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="bg-transparent border-none flex flex-col flex-1 min-h-0">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-primary">Product Catalog</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="grid grid-cols-3 gap-4 pl-6 pb-4">
                {MOCK_PRODUCTS.map((product) => (
                  <RecentProductCard key={product.uuid} item={product} />
                ))}
              </div>
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
                        <div className="w-full h-48 border border-dashed rounded-lg grid place-items-center">
                          <div className="text-center text-sm">
                            No Items in cart
                          </div>
                        </div>
                      )}

                      {products.length > 0 &&
                        products.map((item) => (
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
                      <span>${checkoutData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (12.5%):</span>
                      <span>${checkoutData.taxTotal.toFixed(2)}</span>
=======
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/models";

export default function PosTerminal() {
  const { items, updateQuantity, handleCheckout, removeFromCart } = useCart();
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product as Product).price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;
  return (
    <div className="min-h-screen bg-gray-50">
      <PosHeader />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Product Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-auto">
                  {MOCK_PRODUCTS.map((product) => (
                    <RecentProductCard key={product.uuid} item={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1 h-full">
            <Card className="sticky top-6 h-full">
              <CardHeader>
                <CardTitle className="text-blue-700">Current Order</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full flex flex-col">
                  <div className="space-y-3 h-[400px] max-h-4/5 overflow-auto">
                    {items.length == 0 && (
                      <div className="w-full h-full border border-dashed border-gray-300 rounded-lg grid place-items-center">
                        <div className="text-center text-sm">
                          No Items in cart
                        </div>
                      </div>
                    )}

                    {items.length > 0 &&
                      items.map((item) => (
                        <div
                          key={item?.product?.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
<<<<<<< HEAD
                      <span className="text-primary">
                        ${checkoutData.total.toFixed(2)}
                      </span>
=======
                      <span className="text-blue-600">${total.toFixed(2)}</span>
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
                    </div>
                  </div>

                  <Button
<<<<<<< HEAD
                    disabled={products.length == 0}
                    onClick={checkout}
                    className="w-full mt-4 font-semibold py-3"
=======
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
                    size="lg"
                  >
                    Checkout
                  </Button>
                </div>
<<<<<<< HEAD
              </div>
            </CardContent>
          </Card>
=======
              </CardContent>
            </Card>
          </div>
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
        </div>
      </div>
    </div>
  );
}
