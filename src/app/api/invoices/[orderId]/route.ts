import { NextResponse } from "next/server";
import { getItem, updateItem } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/invoice";
import { sendOrderReceiptEmail } from "@/lib/mail";
import type { ShopOrder } from "@/types";
import { isAdminRequest } from "../../admin/_guard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ orderId: string }> };

async function loadOrder(orderId: string): Promise<ShopOrder | undefined> {
  return getItem<ShopOrder>("orders", orderId);
}

/**
 * GET — download the invoice PDF.
 * Access: admin session, OR the buyer via ?email= matching the order.
 */
export async function GET(req: Request, ctx: Ctx) {
  const { orderId } = await ctx.params;
  const order = await loadOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const url = new URL(req.url);
  const emailParam = (url.searchParams.get("email") || "").toLowerCase().trim();
  const isAdmin = await isAdminRequest();

  if (!isAdmin && (!emailParam || emailParam !== order.email?.toLowerCase())) {
    return NextResponse.json(
      { error: "Add your order email (?email=…) to download this invoice." },
      { status: 403 },
    );
  }

  const settings = (await import("@/lib/content")).getSettings;
  const pdf = await generateInvoicePdf(order, await settings());

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invoice-${order.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

/** POST — admin re-sends the receipt email to the buyer. */
export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { orderId } = await ctx.params;
  const order = await loadOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const settings = (await import("@/lib/content")).getSettings;
  const result = await sendOrderReceiptEmail(order, await settings());

  if (!result.sent) {
    return NextResponse.json(
      {
        ok: false,
        error:
          result.reason === "not-configured"
            ? "No email service is configured. Set SMTP_HOST / MAIL_FROM in .env to enable emailing receipts."
            : `Email failed: ${result.reason}`,
      },
      { status: 200 },
    );
  }

  updateItem("orders", order.id, { ...order, emailedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, message: `Receipt emailed to ${order.email}.` });
}
