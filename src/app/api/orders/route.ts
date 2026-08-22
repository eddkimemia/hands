import { NextResponse } from "next/server";
import { getProductById, getSettings } from "@/lib/content";
import { id, insertItem } from "@/lib/db";
import { sendOrderReceiptEmail } from "@/lib/mail";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";
import type { ShopOrder } from "@/types";

export const runtime = "nodejs";

interface CartItemInput {
  productId?: unknown;
  qty?: unknown;
  size?: unknown;
  color?: unknown;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many orders submitted. Please try again a little later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isSpam(body)) {
    return NextResponse.json({ ok: true, message: "Order received." });
  }

  const errors = validateFields(body, {
    customerName: { required: true, max: 120, label: "Your name" },
    email: { required: true, email: true, max: 200, label: "Email" },
    phone: { max: 40, label: "Phone" },
    town: { required: true, min: 2, max: 120, label: "Town / City" },
    estate: { required: true, min: 2, max: 200, label: "Estate / Neighbourhood" },
    street: { max: 200, label: "Street / Building" },
    notes: { max: 2000, label: "Notes" },
  });

  const rawItems: CartItemInput[] = Array.isArray(body.items) ? (body.items as CartItemInput[]) : [];
  if (!rawItems.length) errors.items = "Your cart is empty.";

  const settings = await getSettings();

  // Resolve every item against the database — prices are never trusted from the client.
  const items: ShopOrder["items"] = [];
  let totalKesItems = 0;
  let totalUsdItems = 0;
  let allHaveUsd = rawItems.length > 0;

  for (const raw of rawItems.slice(0, 30)) {
    const product = await getProductById(String(raw.productId ?? ""));
    if (!product || !product.inStock) {
      errors.items = "One of the items in your cart is unavailable.";
      break;
    }
    const qty = Math.min(Math.max(Math.floor(Number(raw.qty) || 0), 1), 20);
    const priceUsd = typeof product.priceUsd === "number" ? product.priceUsd : undefined;
    if (typeof priceUsd !== "number") allHaveUsd = false;

    totalKesItems += product.priceKes * qty;
    if (typeof priceUsd === "number") totalUsdItems += priceUsd * qty;

    items.push({
      productId: product.id,
      name: product.name,
      priceKes: product.priceKes,
      priceUsd,
      size: typeof raw.size === "string" ? raw.size.slice(0, 10) : undefined,
      color: typeof raw.color === "string" ? raw.color.slice(0, 30) : undefined,
      qty,
    });
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }

  // Currency preference honoured only when every item carries an admin-set USD price.
  const requestedCurrency = body.currency === "USD" ? "USD" : "KES";
  const currency: ShopOrder["currency"] =
    requestedCurrency === "USD" && allHaveUsd ? "USD" : "KES";

  const deliveryFeeKes = Math.max(0, Math.round(Number(settings.deliveryFeeKes) || 0));
  const deliveryFeeUsd = Math.max(0, Number(settings.deliveryFeeUsd) || 0);

  // Compose the delivery address from its structured parts.
  const street = cleanStr(body.street, 200);
  const estate = cleanStr(body.estate, 200)!;
  const town = cleanStr(body.town, 120)!;
  const deliveryAddress = [street, estate, town].filter(Boolean).join(", ").slice(0, 500);

  const order: ShopOrder = {
    id: id("ord"),
    currency,
    items,
    deliveryFeeKes,
    totalKes: totalKesItems + deliveryFeeKes,
    ...(currency === "USD"
      ? { deliveryFeeUsd, totalUsd: totalUsdItems + deliveryFeeUsd }
      : {}),
    customerName: cleanStr(body.customerName, 120)!,
    email: String(body.email).toLowerCase().trim(),
    phone: cleanStr(body.phone, 40),
    deliveryAddress,
    notes: cleanStr(body.notes, 2000),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await insertItem("orders", order.id, order);

  // Best-effort receipt email (PDF attached) — never blocks or fails the order.
  let emailed = false;
  try {
    const mailResult = await sendOrderReceiptEmail(order, settings);
    emailed = mailResult.sent;
  } catch {
    emailed = false;
  }

  const grandDisplay =
    currency === "USD"
      ? `$${(order.totalUsd ?? 0).toLocaleString()}`
      : `KES ${order.totalKes.toLocaleString()}`;

  return NextResponse.json({
    ok: true,
    reference: order.id,
    currency,
    emailed,
    totalKes: order.totalKes,
    totalUsd: order.totalUsd,
    message: `Order received (${grandDisplay}). Our shop team will confirm availability and arrange payment & delivery by email or phone.`,
  });
}
