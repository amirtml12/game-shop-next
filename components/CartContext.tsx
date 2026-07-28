// components/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartGame {
  _id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  desc?: string;
  tags?: string[];
}

interface CartContextType {
  cart: CartGame[];
  addToCart: (game: CartGame) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartGame[]>([]);
  const [mounted, setMounted] = useState(false);

  // خواندن سبد از localStorage فقط یک بار، موقع mount شدن Provider
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // اگر دیتای خراب بود نادیده بگیر
      }
    }
    setMounted(true);
  }, []);

  // هر بار cart عوض شد، بنویس تو localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, mounted]);

  const addToCart = (game: CartGame) => {
    setCart((prev) => (prev.some((item) => item._id === game._id) ? prev : [...prev, game]));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const isInCart = (id: string) => cart.some((item) => item._id === id);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, isInCart, cartCount: cart.length }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}