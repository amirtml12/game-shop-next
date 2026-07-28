"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

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
  isLoggedIn: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartKey(userId: string | null) {
  return userId ? `cart_${userId}` : "cart_guest";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartGame[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncUserAndCart = async () => {
      let currentUserId: string | null = null;
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        currentUserId = res.data.user?._id ?? null;
      } catch {
        currentUserId = null;
      }

      if (!isMounted) return;

      setUserId((prevUserId) => {
        if (prevUserId !== currentUserId) {
          const key = getCartKey(currentUserId);
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              setCart(JSON.parse(saved));
            } catch {
              setCart([]);
            }
          } else {
            setCart([]);
          }
        }
        return currentUserId;
      });

      setReady(true);
    };

    syncUserAndCart();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, userId, ready]);

  const addToCart = (game: CartGame) => {
    if (!userId) {
      alert("برای افزودن به سبد خرید، ابتدا وارد حساب کاربری خود شوید.");
      router.push("/auth");
      return;
    }
    setCart((prev) => (prev.some((item) => item._id === game._id) ? prev : [...prev, game]));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const isInCart = (id: string) => cart.some((item) => item._id === id);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, isInCart, cartCount: cart.length, isLoggedIn: !!userId }}
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