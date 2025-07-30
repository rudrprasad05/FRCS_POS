"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Plus,
  Minus,
  Trash2,
  QrCode,
  ImageIcon,
  Maximize,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    price: 2.99,
    category: "Produce",
    stock: 50,
  },
  {
    id: "2",
    name: "Whole Milk (1 Gallon)",
    price: 4.49,
    category: "Dairy",
    stock: 25,
  },
  {
    id: "3",
    name: "Sourdough Bread",
    price: 3.99,
    category: "Bakery",
    stock: 15,
  },
  {
    id: "4",
    name: "Ground Coffee",
    price: 12.99,
    category: "Beverages",
    stock: 30,
  },
  { id: "5", name: "Greek Yogurt", price: 5.99, category: "Dairy", stock: 20 },
  { id: "6", name: "Chicken Breast", price: 8.99, category: "Meat", stock: 12 },
  { id: "7", name: "Pasta Sauce", price: 2.49, category: "Pantry", stock: 40 },
  { id: "8", name: "Olive Oil", price: 7.99, category: "Pantry", stock: 18 },
  {
    id: "9",
    name: "Fresh Spinach",
    price: 3.49,
    category: "Produce",
    stock: 35,
  },
  {
    id: "10",
    name: "Cheddar Cheese",
    price: 4.99,
    category: "Dairy",
    stock: 22,
  },
];

export default function PosTerminal() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

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
      {/* Header */}
      <Header />

      {/* Main Content */}
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
                  {sampleProducts.map((product) => (
                    <ItemCard
                      item={product}
                      key={product.id}
                      addToCart={addToCart}
                    />
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
                      <p className="text-gray-500 text-center py-8">
                        No items in cart
                      </p>
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

      {/* Floating Barcode Scanner Button */}
      <Dialog
        open={isBarcodeScannerOpen}
        onOpenChange={setIsBarcodeScannerOpen}
      >
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full p-4"
            size="lg"
          >
            <Camera className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-700">
              Connect Barcode Scanner
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">QR Code will appear here</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Generate QR Code
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Download the barcode scanner app on your mobile phone</li>
                <li>Click "Generate QR Code" above</li>
                <li>Scan the QR code with your mobile app</li>
                <li>Your phone is now connected as a barcode scanner</li>
                <li>Scan product barcodes to add items to the cart</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setIsBarcodeScannerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  alert("Barcode scanner connected successfully!");
                  setIsBarcodeScannerOpen(false);
                }}
              >
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Header() {
  function enterFullscreen() {
    const element = document.documentElement; // or specific element

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  // Exit fullscreen
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-center">
          POINT OF SALE TERMINAL
        </h1>
      </div>
      <div onClick={toggleFullscreen}>
        <Maximize />
      </div>
    </header>
  );
}

function ItemCard({
  item,
  addToCart,
}: {
  item: Product;
  addToCart: (i: Product) => void;
}) {
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
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
              src={item.url || "/image.svg"}
              onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                setIsImageValid(false);
              }}
              onLoad={() => setIsImageLoaded(true)}
              alt={item.category}
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
            disabled={item.stock === 0}
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
