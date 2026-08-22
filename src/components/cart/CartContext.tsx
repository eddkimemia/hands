"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  key: string; // productId + size + color composite
  productId: string;
  slug: string;
  name: string;
  priceKes: number;
  priceUsd?: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalKes: number;
  /** Only set when every item has an admin-set USD price. */
  totalUsd?: number;
  addItem: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hh-cart-v1";

function composeKey(productId: string, size?: string, color?: string): string {
  return [productId, size ?? "-", color ?? "-"].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.productId && i.qty > 0));
      }
    } catch {
      /* corrupted storage — start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full/unavailable */
    }
  }, [items, hydrated]);

  const addItem = useCallback((incoming: Omit<CartItem, "key">) => {
    const key = composeKey(incoming.productId, incoming.size, incoming.color);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(20, i.qty + incoming.qty) } : i,
        );
      }
      return [...prev, { ...incoming, key }];
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(20, qty) } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const totalKes = items.reduce((sum, i) => sum + i.priceKes * i.qty, 0);
    const totalUsd = items.reduce(
      (sum, i) => sum + (typeof i.priceUsd === "number" ? i.priceUsd * i.qty : 0),
      0,
    );
    const allHaveUsd = items.length > 0 && items.every((i) => typeof i.priceUsd === "number" && i.priceUsd > 0);
    return { items, count, totalKes, totalUsd: allHaveUsd ? totalUsd : undefined, addItem, updateQty, removeItem, clear, hydrated };
  }, [items, hydrated, addItem, updateQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
