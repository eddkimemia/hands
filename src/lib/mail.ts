import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import type { ShopOrder, SiteSettings } from "@/types";
import { generateInvoicePdf } from "./invoice";

/* ------------------------------------------------------------------ */
/*  Transactional email (receipts). Configure via .env:                */
/*    SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / MAIL_FROM        */
/*  Works with any provider (Gmail app-password, Zoho, Brevo, etc.).   */
/* ------------------------------------------------------------------ */

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);
}

function transporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

export interface MailResult {
  sent: boolean;
  reason?: string;
}

/** Sends the order receipt (HTML + PDF invoice attached) to the buyer. */
export async function sendOrderReceiptEmail(
  order: ShopOrder,
  settings: SiteSettings,
): Promise<MailResult> {
  if (!isMailConfigured()) {
    return { sent: false, reason: "not-configured" };
  }
  if (!order.email) {
    return { sent: false, reason: "no-recipient" };
  }

  const currency = order.currency ?? "KES";
  const money = (n: number) =>
    currency === "USD"
      ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : `KES ${Math.round(n).toLocaleString()}`;
  const grand = currency === "USD" ? order.totalUsd ?? order.totalKes : order.totalKes;
  const fee = currency === "USD" ? order.deliveryFeeUsd ?? 0 : order.deliveryFeeKes;
  const subtotal = grand - fee;

  const itemRows = order.items
    .map((it) => {
      const unit = currency === "USD" ? it.priceUsd ?? it.priceKes : it.priceKes;
      const variant = [it.size, it.color].filter(Boolean).join(", ");
      return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #E5EAF2;">
          <strong>${it.name}</strong>${variant ? `<br><span style="color:#5F6E85;font-size:12px;">${variant}</span>` : ""}
        </td>
        <td style="padding:8px 10px;border-bottom:1px solid #E5EAF2;text-align:center;">${it.qty}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E5EAF2;text-align:right;">${money(unit * it.qty)}</td>
      </tr>`;
    })
    .join("");

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:620px;margin:auto;color:#0B2145;">
    <div style="background:#0B2145;padding:24px 28px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#FFFFFF;font-size:20px;">${settings.orgName}</h1>
      <p style="margin:4px 0 0;color:#E8A33D;font-size:13px;">${settings.tagline}</p>
    </div>
    <div style="border:1px solid #E5EAF2;border-top:none;padding:28px;border-radius:0 0 12px 12px;">
      <h2 style="margin:0 0 8px;font-size:17px;">Thank you for your order, ${order.customerName}!</h2>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#3D4C63;">
        Reference <strong>${order.id}</strong> — our shop team will confirm availability and arrange
        payment &amp; delivery with you personally.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr><th align="left" style="padding:8px 10px;background:#0B2145;color:#fff;">Item</th>
          <th style="padding:8px 10px;background:#0B2145;color:#fff;text-align:center;">Qty</th>
          <th align="right" style="padding:8px 10px;background:#0B2145;color:#fff;">Amount</th></tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr><td colspan="2" align="right" style="padding:8px 10px;color:#5F6E85;">Subtotal</td><td align="right" style="padding:8px 10px;">${money(subtotal)}</td></tr>
          <tr><td colspan="2" align="right" style="padding:8px 10px;color:#5F6E85;">Delivery fee</td><td align="right" style="padding:8px 10px;">${money(fee)}</td></tr>
          <tr><td colspan="2" align="right" style="padding:10px;font-weight:bold;">TOTAL</td><td align="right" style="padding:10px;font-weight:bold;font-size:15px;">${money(grand)}</td></tr>
        </tfoot>
      </table>
      <p style="margin:18px 0 0;font-size:13px;color:#3D4C63;">
        Deliver to: ${order.deliveryAddress}
      </p>
      <p style="margin:16px 0 0;font-size:12px;color:#5F6E85;">
        The official PDF invoice is attached. Questions? Reply to this email or contact
        ${settings.emailGeneral}.
      </p>
    </div>
  </div>`;

  try {
    const attachment = await generateInvoicePdf(order, settings);
    await transporter().sendMail({
      from: process.env.MAIL_FROM,
      to: order.email,
      subject: `Order ${order.id} — ${settings.orgName}`,
      html,
      attachments: [
        {
          filename: `Invoice-${order.id}.pdf`,
          content: attachment,
          contentType: "application/pdf",
        },
      ],
    });
    return { sent: true };
  } catch (err) {
    console.error("[mail] order receipt failed:", err);
    return { sent: false, reason: err instanceof Error ? err.message : "send-failed" };
  }
}

/** Reads the bundled logo (used by the PDF generator). Safe no-op helper. */
export function logoExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "logo", "hopelogo.png"));
}
