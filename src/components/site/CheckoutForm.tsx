"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice, useCurrency } from "@/components/cart/CurrencyContext";
import { Icon } from "@/components/Icon";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface Fees {
  deliveryFeeKes: number;
  deliveryFeeUsd: number;
}

export function CheckoutForm({ fees }: { fees: Fees }) {
  const { items, totalKes, totalUsd, clear, hydrated } = useCart();
  const { currency } = useCurrency();
  const [status, setStatus] = useState<"form" | "loading" | "done" | "error">("form");
  const [message, setMessage] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailed, setEmailed] = useState(false);

  // USD checkout is only possible when every item has an admin-set USD price.
  const usdAvailable = typeof totalUsd === "number" && currency === "USD";
  const effectiveCurrency: "KES" | "USD" = usdAvailable ? "USD" : "KES";

  const feeKes = fees.deliveryFeeKes || 0;
  const feeUsd = fees.deliveryFeeUsd || 0;

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;

    const form = e.currentTarget;
    const get = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? "";

    // Read fields explicitly and trim — nothing silently dropped or padded.
    const town = get("co-town");
    const estate = get("co-estate");
    const street = get("co-street");
    const payload = {
      customerName: get("co-name"),
      email: get("co-email"),
      phone: get("co-phone"),
      town,
      estate,
      street,
      notes: get("co-notes"),
      currency: effectiveCurrency,
      items: items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        size: i.size || undefined,
        color: i.color || undefined,
      })),
    };

    // Pre-flight check with precise, field-named messaging.
    if (!payload.customerName) return fail("co-name", "Please enter your name.");
    if (!payload.email) return fail("co-email", "Please enter your email address.");
    if (!payload.phone) return fail("co-phone", "Please enter your phone number.");
    if (!town) return fail("co-town", "Please enter your town or city.");
    if (!estate) return fail("co-estate", "Please enter your estate or neighbourhood.");

    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429)
          throw new Error("Too many attempts — please wait a few minutes and try again.");
        throw new Error(json.error || "Something went wrong placing your order.");
      }
      setStatus("done");
      setOrderRef(json.reference);
      setMessage(json.message);
      setBuyerEmail(String(payload.email));
      setEmailed(Boolean(json.emailed));
      clear();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function fail(focusId: string, msg: string): false {
    setStatus("error");
    setMessage(msg);
    document.getElementById(focusId)?.focus();
    return false;
  }

  /* ------------------------------ empty guard ----------------------------- */
  if (hydrated && items.length === 0 && status !== "done") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card flex flex-col items-center p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-300">
            <Icon name="shopping-bag" size={26} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">
            There&apos;s nothing to check out yet
          </p>
          <Link href="/shop" className="btn-primary btn-sm mt-6">
            Browse the Shop
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------- success state ---------------------------- */
  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card flex flex-col items-center p-10 text-center sm:p-14">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
            <Icon name="check" size={30} />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold text-navy-900">Order placed!</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-700">{message}</p>
          {orderRef && (
            <p className="mt-3 text-xs text-navy-500">
              Reference:{" "}
              <code className="rounded bg-navy-50 px-2 py-0.5 font-mono font-bold text-navy-900">{orderRef}</code>
            </p>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={`/api/invoices/${orderRef}?email=${encodeURIComponent(buyerEmail)}`}
              className="btn-navy btn-sm"
            >
              <Icon name="download" size={15} />
              Download Invoice (PDF)
            </a>
            <Link href="/shop" className="btn-outline btn-sm">
              Continue Shopping
            </Link>
          </div>
          <p className="mt-3 text-xs text-navy-500">
            {emailed
              ? `A copy of this invoice was emailed to ${buyerEmail}.`
              : "Tip: this same invoice is also available from your email if our mail service has your address on file."}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hello! I just placed order ${orderRef} and would like to arrange delivery.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-4 inline-block text-xs font-bold text-leaf-700"
          >
            Follow up on WhatsApp →
          </a>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white" />;
  }

  /* -------------------------------- checkout ------------------------------ */
  const subtotalDisplay =
    effectiveCurrency === "USD"
      ? formatPrice(0, totalUsd, "USD")
      : `KES ${totalKes.toLocaleString()}`;
  const feeDisplay =
    effectiveCurrency === "USD" ? formatPrice(0, feeUsd, "USD") : `KES ${feeKes.toLocaleString()}`;
  const grandDisplay =
    effectiveCurrency === "USD"
      ? formatPrice(0, (totalUsd ?? 0) + feeUsd, "USD")
      : `KES ${(totalKes + feeKes).toLocaleString()}`;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      {/* Form */}
      <form onSubmit={placeOrder} className="card p-6 sm:p-8">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy-900">
          <Icon name="package" size={19} className="text-gold-600" />
          Delivery details
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="co-name" className="label">Your name *</label>
            <input id="co-name" name="customerName" required maxLength={120} className="input" placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="co-email" className="label">Email *</label>
            <input id="co-email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="co-phone" className="label">Phone *</label>
            <input id="co-phone" name="phone" required maxLength={40} className="input" placeholder="+254…" />
          </div>
          <div>
            <label htmlFor="co-town" className="label">Town / City *</label>
            <input id="co-town" name="town" required minLength={2} maxLength={120} className="input" placeholder="e.g. Nairobi, Nakuru…" />
          </div>
          <div>
            <label htmlFor="co-estate" className="label">Estate / Neighbourhood *</label>
            <input id="co-estate" name="estate" required minLength={2} maxLength={200} className="input" placeholder="e.g. Kilimani, Milimani…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="co-street" className="label">Street / Building (optional)</label>
            <input id="co-street" name="street" maxLength={200} className="input" placeholder="Apartment, house number, street…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="co-notes" className="label">Notes (optional)</label>
            <input id="co-notes" name="notes" maxLength={2000} className="input" placeholder="Landmarks, preferred delivery time…" />
          </div>
        </div>

        {status === "error" && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {message}
          </p>
        )}

        <button type="submit" disabled={status === "loading"} className="btn-primary btn-lg mt-6 w-full">
          {status === "loading" ? "Placing order…" : `Place Order — ${grandDisplay}`}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-navy-500">
          Our shop team will confirm availability, then arrange secure payment and delivery with you personally —
          no prepayment required now.
        </p>
      </form>

      {/* Summary */}
      <aside className="space-y-5 lg:sticky lg:top-28">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-navy-900">Your Order</h2>
          <ul className="mt-4 space-y-3.5">
            {items.map((item) => (
              <li key={item.key} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-navy-900">{item.name}</span>
                  {(item.size || item.color) && (
                    <span className="text-xs text-navy-500">
                      {[item.size, item.color].filter(Boolean).join(" · ")} × {item.qty}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-navy-800">
                  {formatPrice(item.priceKes * item.qty, item.priceUsd ? item.priceUsd * item.qty : undefined, effectiveCurrency)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-navy-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-600">Subtotal</dt>
              <dd className="font-bold tabular-nums text-navy-900">{subtotalDisplay}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-600">Delivery fee</dt>
              <dd className="font-bold tabular-nums text-navy-900">{feeDisplay}</dd>
            </div>
            <div className="flex justify-between border-t border-navy-100 pt-3">
              <dt className="font-bold text-navy-900">Total</dt>
              <dd className="font-display text-xl font-semibold tabular-nums text-navy-900">{grandDisplay}</dd>
            </div>
          </dl>

          <Link href="/cart" className="btn-outline btn-sm mt-5 w-full">
            <Icon name="arrow-left" size={14} />
            Back to Cart
          </Link>
        </div>

        <p className="rounded-2xl bg-leaf-50 px-5 py-4 text-xs leading-relaxed text-leaf-900">
          <Icon name="heart" size={13} className="mr-1.5 inline align-[-2px]" />
          Every purchase supports the organization&apos;s sustainability and community programs across Kenya.
        </p>
      </aside>
    </div>
  );
}
