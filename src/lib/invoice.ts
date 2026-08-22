import "server-only";
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { ShopOrder, SiteSettings } from "@/types";

/* ------------------------------------------------------------------ */
/*  Ishara Charity — pro-forma invoice / receipt PDF                   */
/*  Single A4 page · waves on top · structured table · status pill     */
/* ------------------------------------------------------------------ */

const NAVY = "#0B2145";
const ROYAL = "#1D6FE0";
const GOLD = "#E8A33D";
const INK = "#23324A";
const MUTED = "#5F6E85";
const LINE = "#DFE6F0";
const CARD = "#F6F8FB";

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
  const ref = order.orderNumber ?? order.id;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 0, left: 44, right: 44 },
      autoFirstPage: true,
      compress: false, // keeps output verifiable; vector/text stays small anyway
      info: {
        Title: `${ref} — ${settings.orgName}`,
        Author: settings.orgName,
        Subject: `Merchandise order ${ref}`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("error", reject);
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const W = doc.page.width; // 595.28
    const H = doc.page.height; // 841.89
    const M = 44;
    const CW = W - M * 2;
    let y = 0;

    /* --------------------------- waves on top --------------------------- */
    doc.save();
    doc.moveTo(0, 0);
    doc.lineTo(W, 0);
    doc.lineTo(W, 26);
    doc.bezierCurveTo(W * 0.72, 46, W * 0.45, 22, W * 0.24, 36);
    doc.bezierCurveTo(W * 0.12, 42, W * 0.05, 39, 0, 31);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(NAVY);

    doc.moveTo(0, 29);
    doc.bezierCurveTo(W * 0.14, 41, W * 0.3, 35, W * 0.5, 43);
    doc.bezierCurveTo(W * 0.68, 50, W * 0.85, 39, W, 45);
    doc.lineTo(W, 54);
    doc.bezierCurveTo(W * 0.8, 49, W * 0.6, 58, W * 0.4, 51);
    doc.bezierCurveTo(W * 0.22, 45, W * 0.1, 49, 0, 43);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(GOLD);
    doc.restore();

    /* ------------------------- identity row ----------------------------- */
    y = 76;
    const logoBottom = y + 54; // logo occupies this band — nothing may enter it
    const logoPath = path.join(process.cwd(), "public", "logo", "hopelogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, M, y - 6, { height: 52 });
    }

    doc
      .fill(NAVY)
      .font("Helvetica-Bold")
      .fontSize(17)
      .text("INVOICE", M, y, { align: "right", width: CW });

    // Clear padding below the logo before any following section
    y = logoBottom + 26;

    /* --------------------- metadata information card -------------------- */
    const metaH = 66;
    doc.roundedRect(M, y, CW, metaH, 8).fill(CARD);
    doc.roundedRect(M, y, CW, metaH, 8).lineWidth(1).stroke(LINE);

    // left half — reference + issued
    const lx = M + 18;
    doc.fill(MUTED).font("Helvetica-Bold").fontSize(7).text("INVOICE REF", lx, y + 12, { characterSpacing: 1 });
    doc.fill(NAVY).font("Helvetica-Bold").fontSize(11).text(ref, lx, y + 23);
    doc.fill(MUTED).font("Helvetica").fontSize(9).text(`Issued ${new Date(order.createdAt).toLocaleDateString("en-KE")}`, lx, y + 42);

    // middle — customer
    doc.fill(MUTED).font("Helvetica-Bold").fontSize(7).text("PREPARED FOR", M + CW * 0.38, y + 12, { characterSpacing: 1 });
    doc.fill(INK).font("Helvetica-Bold").fontSize(10).text(order.customerName, M + CW * 0.38, y + 23);
    doc.fill(MUTED).font("Helvetica").fontSize(9).text(order.email, M + CW * 0.38, y + 42);

    // right half — status pill (isolated, padded)
    const pillW = 118;
    const pillH = 24;
    const pillX = W - M - pillW - 16;
    const pillY = y + 21;
    const statusColor = paid ? "#1E9E5A" : "#D64545";
    doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2).lineWidth(1.2).stroke(statusColor);
    doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2).fillOpacity(0.12).fill(statusColor);
    doc.fillOpacity(1);
    doc
      .fill(statusColor)
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(paid ? "PAID" : "PAYMENT DUE", pillX, pillY + pillH / 2 - 5, {
        width: pillW,
        align: "center",
        characterSpacing: 0.5,
      });
    if (paid) {
      doc
        .fill(MUTED)
        .font("Helvetica")
        .fontSize(8)
        .text(order.paidAt ? new Date(order.paidAt).toLocaleDateString("en-KE") : "", pillX, pillY + pillH + 2, {
          width: pillW,
          align: "center",
        });
    } else {
      doc.fill(MUTED).font("Helvetica").fontSize(8).text("Due on confirmation", pillX, pillY + pillH + 2, {
        width: pillW,
        align: "center",
      });
    }

    y += metaH + 26;

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
    const townLine = order.deliveryAddress.split(",").slice(-1)[0]?.trim() || "";
    doc.fill(MUTED).font("Helvetica-Bold").fontSize(7.5).text("DELIVER TO", rx, y, { characterSpacing: 1 });
    doc
      .fill(INK)
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(order.deliveryAddress.split(",")[0]?.trim() || order.deliveryAddress, rx, y + 13, { width: colW })
      .font("Helvetica")
      .fontSize(9)
      .fill("#3D4C63");
    if (townLine && townLine !== order.deliveryAddress.split(",")[0]?.trim()) {
      doc.text(townLine, rx, y + 28, { width: colW });
    }

    y += 64;
    doc.moveTo(M, y).lineTo(W - M, y).lineWidth(1).strokeColor(LINE).stroke();
    y += 14;

    /* ------------------------------- items ------------------------------- */
    // Column geometry — fixed positions, generous gaps, nothing can push anything.
    const c = {
      itemX: M, // 44
      itemW: 196, // ends 240
      optX: M + 206, // 250
      optW: 96, // ends 346
      qtyX: M + 310, // 354
      qtyW: 42, // centred, ends 396
      unitRight: M + 416, // right edge 460
      unitW: 62, // starts 398
      amountRight: W - M, // right edge 551.28
      amountW: 74, // starts 477.28 — clear 17pt gap from unit column
    };

    doc.rect(M, y, CW, 24).fill(NAVY);
    doc.fill("#FFFFFF").font("Helvetica-Bold").fontSize(8);
    doc.text("ITEM", c.itemX, y + 8);
    doc.text("OPTIONS", c.optX, y + 8);
    doc.text("QTY", c.qtyX, y + 8, { width: c.qtyW, align: "center" });
    doc.text("UNIT PRICE", c.unitRight - c.unitW, y + 8, { width: c.unitW, align: "right" });
    doc.text("AMOUNT", c.amountRight - c.amountW, y + 8, { width: c.amountW, align: "right" });
    y += 24;

    order.items.forEach((item, i) => {
      const unit = currency === "USD" ? item.priceUsd ?? item.priceKes : item.priceKes;
      const lineTotal = unit * item.qty;
      const variant = [item.size, item.color].filter(Boolean).join(", ");

      // Natural wrapping — row grows to fit the longest cell.
      const nameH = doc.heightOfString(item.name, { width: c.itemW });
      const optH = variant ? doc.heightOfString(variant, { width: c.optW }) : 0;
      const pad = 12;
      const rowH = Math.max(20, nameH + pad, optH + pad);

      if (i % 2 === 1) doc.rect(M, y, CW, rowH).fill(CARD);

      const textY = y + (rowH - Math.max(nameH, 9)) / 2 - 1;

      doc.fill(INK).font("Helvetica").fontSize(rowFont(nameH));
      doc.text(item.name, c.itemX, textY, { width: c.itemW });
      doc.fill(MUTED).text(variant || "—", c.optX, y + (rowH - Math.max(optH, 9)) / 2 - 1, { width: c.optW });
      doc.fill(INK).text(String(item.qty), c.qtyX, y + rowH / 2 - 5, { width: c.qtyW, align: "center" });
      doc.text(money(unit, currency), c.unitRight - c.unitW, y + rowH / 2 - 5, { width: c.unitW, align: "right" });
      doc.font("Helvetica-Bold").text(money(lineTotal, currency), c.amountRight - c.amountW, y + rowH / 2 - 5, {
        width: c.amountW,
        align: "right",
      });

      doc
        .moveTo(M, y + rowH)
        .lineTo(W - M, y + rowH)
        .lineWidth(0.6)
        .strokeColor(LINE)
        .stroke();

      y += rowH;
    });

    function rowFont(h: number) {
      return h > 20 ? 8.5 : 9;
    }

    /* ---------------------------- totals block ---------------------------- */
    y += 16;
    const labelX = W - M - 250;
    const valueRight = W - M;
    const valueX = valueRight - 110;

    doc.moveTo(labelX - 12, y).lineTo(valueRight, y).lineWidth(1).strokeColor(LINE).stroke();
    y += 12;

    const totalLine = (label: string, val: string, opts?: { bold?: boolean }) => {
      doc
        .fill(opts?.bold ? NAVY : MUTED)
        .font(opts?.bold ? "Helvetica-Bold" : "Helvetica")
        .fontSize(opts?.bold ? 10 : 9)
        .text(label, labelX, y, { width: 150, align: "left" });
      doc
        .fill(opts?.bold ? NAVY : INK)
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(val, valueX, y - 1, { width: 110, align: "right" });
      y += 17;
    };

    totalLine(`Subtotal (${currency})`, money(subtotal, currency));
    totalLine("Delivery fee", money(fee, currency));

    y += 4;
    doc.roundedRect(labelX - 12, y, valueRight - labelX + 12, 32, 6).fill(NAVY);
    doc
      .fill(GOLD)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("TOTAL", labelX, y + 11);
    doc
      .fill("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(money(grand, currency), valueX, y + 8, { width: 110, align: "right" });
    y += 44;

    // Secondary recorded totals (both stored — never converted)
    if (order.currency === "USD" && order.totalKes) {
      totalLine("Recorded total (KES)", `KES ${order.totalKes.toLocaleString()}`);
    } else if (order.totalUsd) {
      totalLine("Listed price (USD)", `$${order.totalUsd.toLocaleString()}`);
    }

    /* ------------------------------- note --------------------------------- */
    doc
      .fill(MUTED)
      .font("Helvetica-Oblique")
      .fontSize(8)
      .text(
        paid
          ? "Payment verified with thanks. This document serves as an official receipt."
          : "Pro-forma receipt — payment is arranged personally by our shop team and confirmed once verified.",
        M,
        y + 2,
        { width: CW },
      );

    /* ------------------- authorised stamp above footer --------------------- */
    const stampPath = path.join(process.cwd(), "public", "stamp.png");
    if (fs.existsSync(stampPath)) {
      const sw = 148;
      const sh = sw * (425 / 586);
      const sy = H - 64 - sh - 16; // sits just above the footer band
      const sx = W - M - sw - 24;

      doc.save();
      doc.rotate(-11, { origin: [sx + sw / 2, sy + sh / 2] });
      doc.fillOpacity(paid ? 1 : 0.88);
      doc.image(stampPath, sx, sy, { width: sw, height: sh });

      const dateStr = new Date(order.createdAt)
        .toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase();
      doc
        .fill(NAVY)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(dateStr, sx, sy + sh * 0.42, { width: sw, align: "center" });
      doc.restore();
    }

    /* -------------------- footer: dark navy, white text ------------------- */
    const fy = H - 62;
    doc.rect(0, fy, W, H - fy).fill(NAVY);
    doc.rect(0, fy - 3, W, 3).fill(GOLD);

    doc
      .fill("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text("Thank you for supporting hope.", M, fy + 11);
    doc
      .fill("#C9D6EA")
      .font("Helvetica")
      .fontSize(8)
      .text(
        `${settings.orgName} \u00b7 ${settings.location}` +
          (settings.emailGeneral ? ` \u00b7 ${settings.emailGeneral}` : "") +
          (settings.phone ? ` \u00b7 ${settings.phone}` : ""),
        M,
        fy + 28,
      )
      .fill("#8CA0BC")
      .fontSize(7)
      .text(`${ref} \u00b7 generated ${new Date().toLocaleString("en-KE")}`, {
        align: "right",
        width: CW,
      });

    doc.end();
  });
}
