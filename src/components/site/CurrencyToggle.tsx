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
        "inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Currency"
    >
      <Icon name="globe" size={13} className="ml-2 text-gold-300" />
      {(["KES", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold transition-all",
            currency === c ? "bg-gold-400 text-navy-950" : "text-white/80 hover:text-white",
          )}
        >
          {c}
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
