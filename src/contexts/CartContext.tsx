import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = "bs_marble_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from Supabase when user logs in
  const loadCartFromDb = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      setCart((data || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        quantity: Number(item.quantity),
      })));
      // Clear localStorage cart after migrating
      localStorage.removeItem(CART_KEY);
    } catch (err) {
      console.error("loadCart error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load from localStorage if not authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromDb();
    } else {
      const stored = localStorage.getItem(CART_KEY);
      setCart(stored ? JSON.parse(stored) : []);
    }
  }, [isAuthenticated, user, loadCartFromDb]);

  // Real-time cart subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("cart-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "cart", filter: `user_id=eq.${user.id}` }, () => {
        loadCartFromDb();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadCartFromDb]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    if (isAuthenticated && user) {
      const existing = cart.find(i => i.productId === productId);
      if (existing && existing.id) {
        const newQty = existing.quantity + quantity;
        await supabase.from("cart").update({ quantity: newQty }).eq("id", existing.id);
      } else {
        await supabase.from("cart").insert({ user_id: user.id, product_id: productId, quantity });
      }
      await loadCartFromDb();
    } else {
      setCart(prev => {
        const existing = prev.find(i => i.productId === productId);
        if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { productId, quantity }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && user) {
      const item = cart.find(i => i.productId === productId);
      if (item?.id) await supabase.from("cart").delete().eq("id", item.id);
      await loadCartFromDb();
    } else {
      setCart(prev => prev.filter(i => i.productId !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    if (isAuthenticated && user) {
      const item = cart.find(i => i.productId === productId);
      if (item?.id) await supabase.from("cart").update({ quantity }).eq("id", item.id);
      await loadCartFromDb();
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      await supabase.from("cart").delete().eq("user_id", user.id);
      setCart([]);
    } else {
      setCart([]);
    }
  };

  const getItemCount = () => cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
