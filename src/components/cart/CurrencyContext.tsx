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

export type Currency = "KES" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  hydrated: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "hh-currency";

/** Kenya → local KES pricing; anywhere else → admin-set USD pricing. */
function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz === "Africa/Nairobi" ? "KES" : "USD";
  } catch {
    return "KES";
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("KES");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial = detectCurrency();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "KES" || saved === "USD") initial = saved;
    } catch {
      /* ignore */
    }
    setCurrencyState(initial);
    setHydrated(true);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, hydrated }),
    [currency, setCurrency, hydrated],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

/**
 * Formats a product price in the active currency.
 * Falls back to KES when an admin-set USD price doesn't exist yet.
 */
export function formatPrice(
  amountKes: number,
  amountUsd: number | undefined | null,
  currency: Currency,
): string {
  if (currency === "USD") {
    if (typeof amountUsd === "number" && amountUsd > 0) {
      return `$${amountUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    return `KES ${Math.round(amountKes).toLocaleString()}`;
  }
  return `KES ${Math.round(amountKes).toLocaleString()}`;
}
