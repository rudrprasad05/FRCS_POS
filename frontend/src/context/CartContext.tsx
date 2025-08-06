"use client";
import { Product, SaleItem } from "@/types/models";
import { createContext, ReactNode, useContext, useState } from "react";

const CartContext = createContext<{
  items: SaleItem[];
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  handleCheckout: () => void;
}>({
  items: [],
  updateQuantity: () => {},
  removeFromCart: () => {},
  handleCheckout: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<SaleItem[]>([]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevCart) =>
      prevCart.map((item) =>
        (item.product as Product).uuid === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prevCart) =>
      prevCart.filter((item) => (item.product as Product).uuid !== productId)
    );
  };

  const handleCheckout = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, updateQuantity, removeFromCart, handleCheckout }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cake context
export const useCart = () => useContext(CartContext);
