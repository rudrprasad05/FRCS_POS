"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import PosHeader from "./PosHeader";
import { RecentProductCard } from "./RecentProductCard";
import { PosSession } from "@/types/models";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  url?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PosTerminal({ session }: { session: PosSession }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert(`Checkout completed! Total: $${total.toFixed(2)}`);
    setCart([]);
  };

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
                    {cart.length == 0 && (
                      <div className="w-full h-full border border-dashed border-gray-300 rounded-lg grid place-items-center">
                        <div className="text-center text-sm">
                          No Items in cart
                        </div>
                      </div>
                    )}

                    {cart.length > 0 &&
                      cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {item.product.name}
                            </h4>
                            <p className="text-blue-600 font-semibold">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
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
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
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
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
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
