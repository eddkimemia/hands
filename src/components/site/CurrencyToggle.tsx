"use client";

import { formatPrice, useCurrency } from "@/components/cart/CurrencyContext";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

/** Small KES/USD switcher for shop surfaces. */
export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency, hydrated } = useCurrency();
  if (!hydrated) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-navy-200 bg-white p-1 shadow-card",
        className,
      )}
      role="group"
      aria-label="Select currency"
    >
      <Icon name="globe" size={14} className="ml-1.5 text-gold-600" />
      {(["KES", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all",
            currency === c
              ? "bg-gold-400 text-navy-950 shadow-sm"
              : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
          )}
        >
          {c === "KES" ? "KES · Kenya" : "USD · Intl"}
        </button>
      ))}
    </div>
  );
}

export function ShopPriceTag({
  priceKes,
  priceUsd,
  className,
}: {
  priceKes: number;
  priceUsd?: number;
  className?: string;
}) {
  const { currency } = useCurrency();
  return <span className={className}>{formatPrice(priceKes, priceUsd, currency)}</span>;
}
