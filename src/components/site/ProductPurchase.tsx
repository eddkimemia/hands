"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice, useCurrency } from "@/components/cart/CurrencyContext";
import { Icon } from "@/components/Icon";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface PurchaseProduct {
  id: string;
  slug: string;
  name: string;
  priceKes: number;
  priceUsd?: number;
  image: string;
  sizes: string[];
  colors: string[];
}

export function ProductPurchase({ product }: { product: PurchaseProduct }) {
  const { addItem, count } = useCart();
  const { currency } = useCurrency();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceKes: product.priceKes,
      priceUsd: product.priceUsd,
      image: product.image,
      qty,
      size: size || undefined,
      color: color || undefined,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  const whatsappUrl = buildWhatsAppOrderUrl([
    { name: product.name, qty, size: size || undefined, color: color || undefined, priceKes: product.priceKes },
  ]);

  return (
    <div className="card p-6 sm:p-8">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />

      {product.sizes.length > 0 && (
        <fieldset>
          <legend className="label">Size</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "min-w-12 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all",
                  size === s
                    ? "border-gold-400 bg-gold-50 text-gold-900 ring-2 ring-gold-300"
                    : "border-navy-200 text-navy-800 hover:border-gold-300",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.colors.length > 0 && (
        <fieldset className="mt-5">
          <legend className="label">
            Color {color && <span className="font-normal text-navy-500">— {color}</span>}
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all",
                  color === c
                    ? "border-gold-400 bg-gold-50 text-gold-900 ring-2 ring-gold-300"
                    : "border-navy-200 text-navy-800 hover:border-gold-300",
                )}
              >
                <ColorDot name={c} />
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5">
        <span className="label">Quantity</span>
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 hover:bg-navy-50"
          >
            <Icon name="minus" size={16} />
          </button>
          <input
            readOnly
            value={qty}
            aria-live="polite"
            aria-label="Quantity"
            className="input w-16 text-center font-bold"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 hover:bg-navy-50"
          >
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center justify-between rounded-2xl bg-sand px-5 py-3.5">
          <span className="text-sm font-semibold text-navy-600">Subtotal</span>
          <span className="font-display text-xl font-semibold text-navy-900">
            {formatPrice(product.priceKes * qty, (product.priceUsd ?? 0) * qty || undefined, currency)}
          </span>
        </div>

        <button type="button" onClick={handleAdd} className={cn("btn btn-lg w-full", added ? "bg-leaf-600 !text-white" : "btn-primary")}>
          {added ? (
            <>
              <Icon name="check" size={18} />
              Added to cart!
            </>
          ) : (
            <>
              <Icon name="shopping-bag" size={18} />
              Add to Cart
            </>
          )}
        </button>

        {added && (
          <Link href="/cart" className="link-underline mx-auto text-sm font-bold text-leaf-700">
            Go to your cart{count > 1 ? ` (${count} items)` : ""} →
          </Link>
        )}

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg w-full">
          <Icon name="whatsapp" size={19} />
          Order on WhatsApp
        </a>

        <p className="text-center text-xs leading-relaxed text-navy-500">
          Prefer to check out here? Add items to your cart and place the order — our team confirms
          availability and arranges payment &amp; delivery.
        </p>
      </div>
    </div>
  );
}

/** Small colored dot approximating common merch color names. */
export function ColorDot({ name }: { name: string }) {
  const map: Record<string, string> = {
    navy: "#0B2145",
    white: "#FFFFFF",
    charcoal: "#33333B",
    black: "#111111",
    natural: "#D9CDB8",
    steel: "#9AA3AB",
    mixed: "linear-gradient(135deg,#0B2145,#E8A33D,#2F9E63)",
    red: "#C0392B",
    green: "#2F9E63",
    gold: "#E8A33D",
    blue: "#1D6FE0",
    grey: "#9AA3AB",
    gray: "#9AA3AB",
    khaki: "#BDA97A",
    olive: "#6B7A3F",
  };
  const value = map[name.toLowerCase()] ?? "#CBD5E1";
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 shrink-0 rounded-full border border-navy-200"
      style={{ background: value }}
    />
  );
}
