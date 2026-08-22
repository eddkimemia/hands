"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { ShopOrder } from "@/types";

const STATUS_STYLES: Record<ShopOrder["status"], string> = {
  new: "bg-gold-100 text-gold-800",
  confirmed: "bg-royal-50 text-royal-700",
  fulfilled: "bg-leaf-100 text-leaf-800",
  cancelled: "bg-red-50 text-red-600",
};

export function OrderDetail({ order }: { order: ShopOrder }) {
  const router = useRouter();
  const [status, setStatus] = useState<ShopOrder["status"]>(order.status);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const currency = order.currency ?? "KES";
  const fee = currency === "USD" ? order.deliveryFeeUsd ?? 0 : order.deliveryFeeKes;
  const grand = currency === "USD" ? order.totalUsd ?? order.totalKes : order.totalKes;
  const subtotal = grand - fee;
  const money = (n: number) =>
    currency === "USD"
      ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : `KES ${Math.round(n).toLocaleString()}`;

  async function updateStatus(next: ShopOrder["status"]) {
    setStatus(next);
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Update failed.");
      setNotice(`Status updated to “${next}”.`);
      router.refresh();
    } catch (err) {
      setStatus(order.status);
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function emailReceipt() {
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch(`/api/invoices/${order.id}`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Email failed.");
      setNotice(json.message);
      setStatus("confirmed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-xs font-semibold text-navy-400">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/admin" className="hover:text-gold-700">Admin</Link></li>
              <li aria-hidden="true"><Icon name="arrow-right" size={11} /></li>
              <li><Link href="/admin/orders" className="hover:text-gold-700">Orders</Link></li>
              <li aria-hidden="true"><Icon name="arrow-right" size={11} /></li>
              <li aria-current="page" className="font-mono text-navy-700">{order.id}</li>
            </ol>
          </nav>
          <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Order {order.id}</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy-400">
            Placed {new Date(order.createdAt).toLocaleString("en-KE")}
          </p>
        </div>
        <span className={`chip px-3 py-1.5 capitalize ${STATUS_STYLES[status]}`}>{status}</span>
      </div>

      {(notice || error) && (
        <p
          role="alert"
          className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${
            error ? "bg-red-50 text-red-700" : "bg-leaf-50 text-leaf-800"
          }`}
        >
          {error || notice}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="card overflow-hidden">
          <h2 className="border-b border-navy-100 px-6 py-4 font-display text-lg font-semibold text-navy-900">
            Products bought ({order.items.reduce((s, i) => s + i.qty, 0)})
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-[11px] uppercase tracking-wider text-navy-500">
                <th className="px-6 py-3 font-bold">Product</th>
                <th className="px-3 py-3 font-bold">Qty</th>
                <th className="px-3 py-3 text-right font-bold">Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.productId + String(i)} className="border-b border-navy-50 last:border-0 align-top">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-navy-900">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="mt-0.5 text-xs text-navy-500">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4 tabular-nums text-navy-800">{item.qty}</td>
                  <td className="px-3 py-4 text-right font-bold tabular-nums text-navy-900">
                    {money(item.priceKes * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <dl className="space-y-2.5 border-t border-navy-100 bg-sand/60 px-6 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-navy-600">Subtotal</dt>
              <dd className="font-semibold tabular-nums text-navy-900">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-600">Delivery fee</dt>
              <dd className="font-semibold tabular-nums text-navy-900">{money(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-navy-200 pt-3">
              <dt className="font-display text-base font-semibold text-navy-900">Total</dt>
              <dd className="font-display text-xl font-semibold tabular-nums text-navy-900">
                {money(grand)}
                {order.currency === "USD" && order.totalKes ? (
                  <span className="ml-2 text-xs font-normal text-navy-500">(≈ KES {order.totalKes.toLocaleString()})</span>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
              <Icon name="user" size={18} className="text-gold-600" /> Customer
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-navy-500">Name</dt><dd className="text-right font-semibold text-navy-900">{order.customerName}</dd></div>
              <div className="flex justify-between gap-3"><dt className="shrink-0 text-navy-500">Email</dt><dd className="truncate text-right font-semibold text-navy-900">{order.email}</dd></div>
              {order.phone && <div className="flex justify-between gap-3"><dt className="text-navy-500">Phone</dt><dd className="text-right font-semibold text-navy-900">{order.phone}</dd></div>}
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
              <Icon name="map-pin" size={18} className="text-gold-600" /> Deliver to
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-800">
              {order.deliveryAddress.split(",").map((part) => (
                <span key={part} className="block">{part.trim()}</span>
              ))}
            </p>
            {order.notes && (
              <p className="mt-3 rounded-xl bg-sand px-4 py-3 text-xs leading-relaxed text-navy-700">
                <strong className="font-bold">Notes:</strong> {order.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-navy-900">Manage</h2>
            <label htmlFor="ord-status" className="label mt-4">Fulfilment status</label>
            <select
              id="ord-status"
              value={status}
              onChange={(e) => void updateStatus(e.target.value as ShopOrder["status"])}
              disabled={saving}
              className="input"
            >
              {(["new", "confirmed", "fulfilled", "cancelled"] as const).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-relaxed text-navy-500">
              Mark <strong>confirmed</strong> once stock &amp; payment are verified;{" "}
              <strong>fulfilled</strong> after delivery.
            </p>

            <div className="mt-5 grid gap-3">
              <a href={`/api/invoices/${order.id}`} target="_blank" rel="noopener noreferrer" className="btn-navy btn-sm w-full">
                <Icon name="download" size={15} />
                Download Invoice (PDF)
              </a>
              <button type="button" onClick={() => void emailReceipt()} disabled={saving} className="btn-outline btn-sm w-full">
                <Icon name="mail" size={15} />
                Email receipt to buyer
              </button>
            </div>
            {order.emailedAt && (
              <p className="mt-3 text-[11px] text-leaf-700">
                Last emailed {new Date(order.emailedAt).toLocaleString("en-KE")}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
