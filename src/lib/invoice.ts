import "server-only";
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { ShopOrder, SiteSettings } from "@/types";

/* ------------------------------------------------------------------ */
/*  Ishara Charity — pro-forma invoice / receipt PDF                   */
/*  Single A4 page · waves on top · authorised stamp with date         */
/* ------------------------------------------------------------------ */

const NAVY = "#0B2145";
const ROYAL = "#1D6FE0";
const GOLD = "#E8A33D";
const INK = "#23324A";
const MUTED = "#5F6E85";
const LINE = "#DFE6F0";
const ZEBRA = "#F6F8FB";

function money(n: number, currency: "KES" | "USD"): string {
  return currency === "USD"
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `KES ${n.toLocaleString("en-Kenya", { maximumFractionDigits: 0 })}`;
}

export async function generateInvoicePdf(
  order: ShopOrder,
  settings: SiteSettings,
): Promise<Buffer> {
  const currency = order.currency ?? "KES";
  const fee = currency === "USD" ? order.deliveryFeeUsd ?? 0 : order.deliveryFeeKes;
  const grand = currency === "USD" ? order.totalUsd ?? order.totalKes : order.totalKes;
  const subtotal = grand - fee;
  const paid = Boolean(order.paidAt) || order.status === "fulfilled";

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 0, left: 48, right: 48 },
      info: {
        Title: `${order.orderNumber ?? order.id} — ${settings.orgName}`,
        Author: settings.orgName,
        Subject: `Merchandise order ${order.orderNumber ?? order.id}`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("error", reject);
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const W = doc.page.width;
    const M = 48;
    const CW = W - M * 2;
    let y = 0;

    /* ---------------------- waves on top (navy+gold) --------------------- */
    doc.save();
    doc.moveTo(0, 0);
    doc.lineTo(W, 0);
    doc.lineTo(W, 30);
    doc.bezierCurveTo(W * 0.72, 50, W * 0.45, 26, W * 0.24, 40);
    doc.bezierCurveTo(W * 0.12, 46, W * 0.05, 43, 0, 35);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(NAVY);

    doc.moveTo(0, 33);
    doc.bezierCurveTo(W * 0.14, 45, W * 0.3, 39, W * 0.5, 47);
    doc.bezierCurveTo(W * 0.68, 54, W * 0.85, 43, W, 49);
    doc.lineTo(W, 60);
    doc.bezierCurveTo(W * 0.8, 55, W * 0.6, 64, W * 0.4, 57);
    doc.bezierCurveTo(W * 0.22, 51, W * 0.1, 55, 0, 47);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(GOLD);
    doc.restore();

    /* --------------------------- identity row ---------------------------- */
    y = 84;
    const logoPath = path.join(process.cwd(), "public", "logo", "hopelogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, M, y - 8, { height: 52 });
    }

    doc
      .fill(NAVY)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("INVOICE", M, y - 2, { align: "right", width: CW });
    doc
      .fill("#5F6E85")
      .font("Helvetica")
      .fontSize(9)
      .text(`Ref: ${order.orderNumber ?? order.id}`, M, y + 24, { align: "right", width: CW })
      .text(`Issued: ${new Date(order.createdAt).toLocaleDateString("en-KE")}`, {
        align: "right",
        width: CW,
      });

    // Payment status — small coloured line, never overlapping the ref text
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fill(paid ? "#1E9E5A" : "#D64545")
      .text(paid ? "STATUS: PAID ✓" : "STATUS: PAYMENT DUE", M, y + 44, { align: "right", width: CW });

    y += 92;

    /* ------------------------------ parties ------------------------------ */
    const colW = (CW - 24) / 2;

    doc.fill(MUTED).font("Helvetica-Bold").fontSize(7.5).text("BILLED TO", M, y, { characterSpacing: 1 });
    doc
      .fill(INK)
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(order.customerName, M, y + 13)
      .font("Helvetica")
      .fontSize(9)
      .fill("#3D4C63")
      .text(order.email, M, y + 28)
      .text(order.phone ?? "", M, y + 42);

    const rx = M + colW + 24;
    doc.fill(MUTED).font("Helvetica-Bold").fontSize(7.5).text("DELIVER TO", rx, y, { characterSpacing: 1 });
    doc.fill(INK).font("Helvetica-Bold").fontSize(10.5).text(order.deliveryAddress.split(",")[0]?.trim() || order.deliveryAddress, rx, y + 13, { width: colW });
    doc.fill("#3D4C63").font("Helvetica").fontSize(9).text(order.deliveryAddress, rx, y + 28, { width: colW });

    y += 74;
    doc.moveTo(M, y).lineTo(W - M, y).lineWidth(1).strokeColor(LINE).stroke();
    y += 16;

    /* ------------------------------- items ------------------------------- */
    const cols = {
      idx: M,
      item: M + 26,
      variant: M + 252,
      qty: M + 358,
      unit: M + 404,
      amount: W - M,
    };

    doc.rect(M, y, CW, 22).fill(NAVY);
    doc.fill("#FFFFFF").font("Helvetica-Bold").fontSize(8);
    doc.text("#", cols.idx + 8, y + 7);
    doc.text("ITEM", cols.item, y + 7);
    doc.text("OPTIONS", cols.variant, y + 7);
    doc.text("QTY", cols.qty, y + 7, { width: 38, align: "right" });
    doc.text("UNIT", cols.unit, y + 7, { width: 72, align: "right" });
    doc.text("AMOUNT", cols.amount - 82, y + 7, { width: 82, align: "right" });
    y += 22;

    const many = order.items.length > 6;
    const rowFont = many ? 8 : 9;
    const rowH = many ? 17 : Math.max(20, 12);

    order.items.forEach((item, i) => {
      const unit = currency === "USD" ? item.priceUsd ?? item.priceKes : item.priceKes;
      const lineTotal = unit * item.qty;
      const variant = [item.size, item.color].filter(Boolean).join(" · ");
      const h = rowH;

      if (i % 2 === 1) doc.rect(M, y, CW, h).fill(ZEBRA);

      doc.fill(INK).font("Helvetica").fontSize(rowFont);
      doc.text(String(i + 1), cols.idx + 8, y + (h - rowFont) / 2 - 1);
      doc.text(item.name, cols.item, y + (h - rowFont) / 2 - 1, {
        width: cols.variant - cols.item - 10,
        ellipsis: true,
      });
      if (variant)
        doc.fill(MUTED).text(variant, cols.variant, y + (h - rowFont) / 2 - 1, {
          width: cols.qty - cols.variant - 10,
          ellipsis: true,
        });
      doc
        .fill(INK)
        .text(String(item.qty), cols.qty, y + (h - rowFont) / 2 - 1, { width: 38, align: "right" })
        .text(money(unit, currency), cols.unit, y + (h - rowFont) / 2 - 1, { width: 72, align: "right" })
        .font("Helvetica-Bold")
        .text(money(lineTotal, currency), cols.amount - 82, y + (h - rowFont) / 2 - 1, {
          width: 82,
          align: "right",
        });

      doc
        .moveTo(M, y + h)
        .lineTo(W - M, y + h)
        .lineWidth(0.6)
        .strokeColor(LINE)
        .stroke();

      y += h;
    });

    /* ------------------------- totals + stamp ---------------------------- */
    y += 14;
    const tx = W - M - 236;

    const label = (t: string, ty: number) =>
      doc.fill(MUTED).font("Helvetica").fontSize(9).text(t, tx, ty, { width: 130 });
    const value = (v: string, ty: number) =>
      doc.fill(INK).font("Helvetica-Bold").fontSize(9).text(v, tx + 132, ty, { width: 104, align: "right" });

    label(`Subtotal (${currency})`, y); value(money(subtotal, currency), y); y += 15;
    label("Delivery fee", y); value(money(fee, currency), y); y += 19;

    doc.roundedRect(tx - 12, y, 248, 30, 6).fill(NAVY);
    doc
      .fill("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("TOTAL", tx, y + 9, { width: 126 })
      .fontSize(11.5)
      .text(money(grand, currency), tx + 132, y + 8, { width: 104, align: "right" });
    y += 42;

    // Secondary recorded total (both currencies are stored, never converted)
    if (order.currency === "USD" && order.totalKes) {
      label("Recorded total (KES)", y);
      value(`KES ${order.totalKes.toLocaleString()}`, y);
    } else if (currency !== "USD" && order.totalUsd) {
      label("Listed price (USD)", y);
      value(`$${order.totalUsd.toLocaleString()}`, y);
    }

    /* ------------------------ authorised stamp --------------------------- */
    const stampPath = path.join(process.cwd(), "public", "stamp.png");
    if (fs.existsSync(stampPath)) {
      const sw = 150;
      const sh = sw * (425 / 586); // ≈ 108.8
      const sx = W - M - sw - 6;
      const sy = y - sh + 34;

      doc.save();
      doc.rotate(-12, { origin: [sx + sw / 2, sy + sh / 2] });
      doc.fillOpacity(paid ? 1 : 0.88);
      doc.image(stampPath, sx, sy, { width: sw, height: sh });

      // Date centred in the stamp's empty middle band
      const dateStr = new Date(order.createdAt)
        .toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase();
      doc
        .fill(NAVY)
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(dateStr, sx, sy + sh * 0.42, { width: sw, align: "center" });
      doc.restore();
    }

    /* ------------------------------- note -------------------------------- */
    doc
      .fill(MUTED)
      .font("Helvetica-Oblique")
      .fontSize(8)
      .text(
        paid
          ? "Payment verified with thanks. This document serves as an official receipt."
          : "This document is a pro-forma receipt — payment is arranged personally by our shop team and confirmed once verified.",
        M,
        y - 6,
        { width: CW - 180 },
      );

    /* -------------------- footer: dark navy, white text ------------------- */
    const fy = doc.page.height - 66;
    doc.rect(0, fy, W, doc.page.height - fy).fill(NAVY);
    doc.rect(0, fy - 3, W, 3).fill(GOLD);

    doc
      .fill("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Thank you for supporting hope.", M, fy + 12);
    doc
      .fill("#C9D6EA")
      .font("Helvetica")
      .fontSize(8)
      .text(
        `${settings.orgName} \u00b7 ${settings.location}` +
          (settings.emailGeneral ? ` \u00b7 ${settings.emailGeneral}` : "") +
          (settings.phone ? ` \u00b7 ${settings.phone}` : ""),
        M,
        fy + 29,
      )
      .fill("#8CA0BC")
      .fontSize(7)
      .text(
        `${order.orderNumber ?? order.id} \u00b7 generated ${new Date().toLocaleString("en-KE")}`,
        { align: "right", width: CW },
      );

    doc.end();
  });
}
