import { NextResponse } from "next/server";
import { id, insertItem } from "@/lib/db";
import { getProductById } from "@/lib/content";
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
    customerName: { required: true, max: 120 },
    email: { required: true, email: true, max: 200 },
    phone: { max: 40 },
    deliveryAddress: { required: true, min: 6, max: 500 },
    notes: { max: 2000 },
  });

  const items: ShopOrder["items"] = [];
  const rawItems = Array.isArray(body.items) ? (body.items as CartItemInput[]) : [];
  if (!rawItems.length) errors.items = "Your cart is empty.";

  for (const raw of rawItems.slice(0, 20)) {
    const product = await getProductById(String(raw.productId ?? ""));
    if (!product || !product.inStock) {
      errors.items = "One of the items in your cart is unavailable.";
      break;
    }
    const qty = Math.min(Math.max(Math.floor(Number(raw.qty) || 0), 1), 20);
    items.push({
      productId: product.id,
      name: product.name,
      priceKes: product.priceKes,
      size: typeof raw.size === "string" ? raw.size.slice(0, 10) : undefined,
      color: typeof raw.color === "string" ? raw.color.slice(0, 30) : undefined,
      qty,
    });
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }

  const totalKes = items.reduce((sum, it) => sum + it.priceKes * it.qty, 0);

  const order: ShopOrder = {
    id: id("ord"),
    items,
    totalKes,
    customerName: cleanStr(body.customerName, 120)!,
    email: String(body.email).toLowerCase().trim(),
    phone: cleanStr(body.phone, 40),
    deliveryAddress: cleanStr(body.deliveryAddress, 500)!,
    notes: cleanStr(body.notes, 2000),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await insertItem("orders", order.id, order);

  return NextResponse.json({
    ok: true,
    reference: order.id,
    totalKes,
    message:
      "Order received! Our shop team will confirm availability and payment/delivery details by email.",
  });
}
