"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { formatKes } from "@/lib/utils";

export interface OrderProduct {
  id: string;
  name: string;
  priceKes: number;
  sizes: string[];
}

export function OrderForm({ product }: { product: OrderProduct }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [status, setStatus] = useState<"form" | "loading" | "done" | "error">("form");
  const [message, setMessage] = useState("");
  const total = useMemo(() => product.priceKes * qty, [product.priceKes, qty]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: [{ productId: product.id, qty, size: size || undefined }],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
      setMessage(json.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="card flex h-full flex-col items-center justify-center p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name="check" size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-semibold text-navy-900">Order received!</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy-700">{message}</p>
        <a href="/shop" className="btn-outline btn-sm mt-7">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />

      {(product.sizes.length ?? 0) > 0 && (
        <fieldset>
          <legend className="label">Size</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`min-w-12 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                  size === s
                    ? "border-gold-400 bg-gold-50 text-gold-900 ring-2 ring-gold-300"
                    : "border-navy-200 text-navy-800 hover:border-gold-300"
                }`}
              >
                {s}
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ord-name" className="label">Your name *</label>
          <input id="ord-name" name="customerName" required maxLength={120} className="input" placeholder="Full name" />
        </div>
        <div>
          <label htmlFor="ord-email" className="label">Email *</label>
          <input id="ord-email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="ord-phone" className="label">Phone *</label>
          <input id="ord-phone" name="phone" required maxLength={40} className="input" placeholder="+254…" />
        </div>
        <div>
          <label htmlFor="ord-address" className="label">Delivery address *</label>
          <input id="ord-address" name="deliveryAddress" required minLength={6} maxLength={500} className="input" placeholder="Town / estate / building" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ord-notes" className="label">Notes (optional)</label>
          <input id="ord-notes" name="notes" maxLength={2000} className="input" placeholder="Delivery preferences, gift note…" />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-5">
        <span className="text-sm font-semibold text-navy-600">Total</span>
        <span className="font-display text-2xl font-semibold text-navy-900">{formatKes(total)}</span>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary btn-lg mt-5 w-full">
        {status === "loading" ? "Placing order…" : "Place Order"}
        <Icon name="arrow-right" size={16} />
      </button>
      <p className="mt-3 text-xs leading-relaxed text-navy-500">
        Our team will confirm availability and arrange payment &amp; delivery by email or phone.
        Every purchase supports our mission, subject to our financial policies.
      </p>
    </form>
  );
}
