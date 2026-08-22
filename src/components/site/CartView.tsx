"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice, useCurrency } from "@/components/cart/CurrencyContext";
import { Icon } from "@/components/Icon";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export function CartView() {
  const { items, totalKes, totalUsd, count, updateQty, removeItem, clear, hydrated } = useCart();
  const { currency, setCurrency } = useCurrency();

  /* ------------------------------ empty state ----------------------------- */
  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card flex flex-col items-center p-12 text-center sm:p-16">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-50 text-navy-300">
            <Icon name="shopping-bag" size={30} />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold text-navy-900">
            Your cart is empty
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy-600">
            Fill it with something meaningful — every purchase supports community programs across Kenya.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Browse the Shop
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  const showUsd = currency === "USD";

  /* ------------------------------- cart view ------------------------------ */
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
      {/* Items */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-navy-500">
            {count} item{count === 1 ? "" : "s"}
          </p>
          <button onClick={clear} className="text-xs font-semibold text-red-500 hover:text-red-600">
            Clear cart
          </button>
        </div>

        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.key} className="card flex gap-4 p-4 sm:gap-5 sm:p-5">
              <Link href={`/shop/${item.slug}`} className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-28 sm:w-28">
                <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/shop/${item.slug}`} className="link-underline font-display font-semibold text-navy-900">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="mt-1 text-xs font-medium text-navy-500">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm font-bold text-gold-700">
                      {formatPrice(item.priceKes, item.priceUsd, currency)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-100 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      <Icon name="minus" size={13} />
                    </button>
                    <span aria-live="polite" className="w-8 text-center text-sm font-bold tabular-nums text-navy-900">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      <Icon name="plus" size={13} />
                    </button>
                  </div>
                  <p className="font-display text-lg font-semibold tabular-nums text-navy-900">
                    {formatPrice(item.priceKes * item.qty, item.priceUsd ? item.priceUsd * item.qty : undefined, currency)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/shop" className="btn-outline btn-sm mt-6">
          <Icon name="arrow-left" size={14} />
          Continue Shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="space-y-5 lg:sticky lg:top-28">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Order Summary</h2>

          {/* Currency selector */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-full bg-navy-50 p-1.5">
            {(["KES", "USD"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  currency === c ? "bg-navy-900 text-white shadow-card" : "text-navy-600 hover:text-navy-900"
                }`}
              >
                {c === "KES" ? "🇰🇪 KENYA — KES" : "🌍 INTERNATIONAL — USD"}
              </button>
            ))}
          </div>
          {showUsd && (
            <p className="mt-2 text-[11px] leading-relaxed text-navy-400">
              USD prices are set by our team. Items without a USD price still show KES.
            </p>
          )}

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-600">Subtotal</dt>
              <dd className="font-bold tabular-nums text-navy-900">
                {showUsd
                  ? formatPrice(0, totalUsd || undefined, "USD")
                  : `KES ${totalKes.toLocaleString()}`}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-600">Delivery</dt>
              <dd className="text-navy-600">Added at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-navy-100 pt-3">
              <dt className="font-bold text-navy-900">Items total</dt>
              <dd className="font-display text-xl font-semibold tabular-nums text-navy-900">
                {showUsd
                  ? formatPrice(0, totalUsd || undefined, "USD")
                  : `KES ${totalKes.toLocaleString()}`}
              </dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary btn-lg mt-6 w-full">
            Proceed to Checkout
            <Icon name="arrow-right" size={17} />
          </Link>

          <a
            href={buildWhatsAppOrderUrl(items)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp btn-lg mt-3 w-full"
          >
            <Icon name="whatsapp" size={19} />
            Order on WhatsApp
          </a>
          <p className="mt-2.5 text-center text-xs leading-relaxed text-navy-500">
            Opens WhatsApp with your order pre-filled — we confirm payment &amp; delivery in chat.
          </p>
        </div>
      </aside>
    </div>
  );
}
