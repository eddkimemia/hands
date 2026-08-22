import "server-only";
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { ShopOrder, SiteSettings } from "@/types";

/* ------------------------------------------------------------------ */
/*  Professional PDF invoices generated server-side with pdfkit.       */
/* ------------------------------------------------------------------ */

const NAVY = "#0B2145";
const GOLD = "#E8A33D";
const ROYAL = "#1D6FE0";
const INK = "#23324A";
const MUTED = "#5F6E85";
const LINE = "#DFE6F0";
const ZEBRA = "#F6F8FB";

function money(n: number, currency: "KES" | "USD"): string {
  if (currency === "USD") {
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `KES ${n.toLocaleString("en-Kenya", { maximumFractionDigits: 0 })}`;
}

export async function generateInvoicePdf(
  order: ShopOrder,
  settings: SiteSettings,
): Promise<Buffer> {
  const currency = order.currency ?? "KES";
  const deliveryFee =
    currency === "USD" ? order.deliveryFeeUsd ?? 0 : order.deliveryFeeKes;
  const grandTotal = currency === "USD" ? order.totalUsd ?? order.totalKes : order.totalKes;
  const itemsSubtotal = grandTotal - deliveryFee;

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 48, left: 48, right: 48 },
      info: {
        Title: `Invoice ${order.id} — ${settings.orgName}`,
        Author: settings.orgName,
        Subject: `Merchandise order ${order.id}`,
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

    /* ------------------------ header (white + waves) --------------------- */
    const headerH = 132;
    doc.rect(0, 0, W, headerH).fill("#FFFFFF");

    // Logo on white
    const logoPath = path.join(process.cwd(), "public", "logo", "hopelogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, M, 22, { height: 62 });
    } else {
      doc.fill(NAVY).font("Helvetica-Bold").fontSize(16).text(settings.orgName, M, 34);
    }

    // INVOICE block right-aligned
    doc
      .fill(NAVY)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("INVOICE", M, 30, { align: "right", width: CW });
    doc
      .fill("#5F6E85")
      .font("Helvetica")
      .fontSize(9)
      .text(`Ref: ${order.id}`, M, 58, { align: "right", width: CW })
      .text(`Issued: ${new Date(order.createdAt).toLocaleDateString("en-KE")}`, {
        align: "right",
        width: CW,
      });

    // Wavy separator: gold wave over a royal-blue wave
    const base = headerH;
    doc.save();
    doc.moveTo(0, base + 6);
    doc.bezierCurveTo(W * 0.18, base - 14, W * 0.42, base + 26, W * 0.62, base + 4);
    doc.bezierCurveTo(W * 0.8, base - 12, W * 0.9, base + 6, W, base - 4);
    doc.lineTo(W, base + 46);
    doc.lineTo(0, base + 46);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(GOLD);

    doc.moveTo(0, base + 18);
    doc.bezierCurveTo(W * 0.2, base + 4, W * 0.45, base + 34, W * 0.65, base + 16);
    doc.bezierCurveTo(W * 0.82, base + 2, W * 0.92, base + 18, W, base + 12);
    doc.lineTo(W, base + 52);
    doc.lineTo(0, base + 52);
    doc.closePath();
    doc.fillOpacity(1);
    doc.fill(ROYAL);
    doc.restore();

    y = base + 78;

    /* --------------------------- meta + parties -------------------------- */
    const colW = (CW - 24) / 2;

    doc.fill(MUTED).font("Helvetica-Bold").fontSize(8).text("BILLED TO", M, y, { characterSpacing: 1 });
    doc
      .fill(INK)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(order.customerName, M, y + 14)
      .font("Helvetica")
      .fontSize(9.5)
      .fill("#3D4C63")
      .text(order.email, M, y + 30)
      .text(order.phone ?? "", M, y + 44);

    const rx = M + colW + 24;
    doc.fill(MUTED).font("Helvetica-Bold").fontSize(8).text("DELIVER TO", rx, y, { characterSpacing: 1 });
    doc
      .fill(INK)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(order.deliveryAddress, rx, y + 14, { width: colW })
      .font("Helvetica")
      .fontSize(9.5)
      .fill("#3D4C63");

    y += 86;
    doc.moveTo(M, y).lineTo(W - M, y).lineWidth(1).strokeColor(LINE).stroke();
    y += 22;

    /* ------------------------------- items ------------------------------- */
    const cols = {
      idx: M,
      item: M + 30,
      variant: M + 250,
      qty: M + 356,
      unit: M + 408,
      amount: W - M,
    };

    // table head
    doc.rect(M, y, CW, 24).fill(NAVY);
    doc.fill("#FFFFFF").font("Helvetica-Bold").fontSize(8);
    doc.text("#", cols.idx + 8, y + 8);
    doc.text("ITEM", cols.item, y + 8);
    doc.text("OPTIONS", cols.variant, y + 8);
    doc.text("QTY", cols.qty, y + 8, { width: 44, align: "right" });
    doc.text("UNIT", cols.unit, y + 8, { width: 74, align: "right" });
    doc.text("AMOUNT", cols.amount - 84, y + 8, { width: 84, align: "right" });
    y += 24;

    order.items.forEach((item, i) => {
      const unit = currency === "USD" ? item.priceUsd ?? item.priceKes : item.priceKes;
      const lineTotal = unit * item.qty;
      const variant = [item.size, item.color].filter(Boolean).join(" · ");
      const nameH = doc.heightOfString(item.name, { width: cols.variant - cols.item - 12 });
      const rowH = Math.max(24, nameH + 12);

      if (i % 2 === 1) {
        doc.rect(M, y, CW, rowH).fill(ZEBRA);
      }

      doc
        .fill(INK)
        .font("Helvetica")
        .fontSize(9.5);
      doc.text(String(i + 1), cols.idx + 8, y + 6);
      doc.text(item.name, cols.item, y + 6, { width: cols.variant - cols.item - 12 });
      if (variant) doc.fill(MUTED).text(variant, cols.variant, y + 6, { width: cols.qty - cols.variant - 10 });
      doc.fill(INK)
        .text(String(item.qty), cols.qty, y + 6, { width: 44, align: "right" })
        .text(money(unit, currency), cols.unit, y + 6, { width: 74, align: "right" })
        .font("Helvetica-Bold")
        .text(money(lineTotal, currency), cols.amount - 84, y + 6, { width: 84, align: "right" });

      doc
        .moveTo(M, y + rowH)
        .lineTo(W - M, y + rowH)
        .lineWidth(0.75)
        .strokeColor(LINE)
        .stroke();

      y += rowH;
    });

    /* ------------------------------ totals ------------------------------ */
    y += 18;
    const tx = W - M - 240;
    const label = (t: string, ty: number) =>
      doc.fill(MUTED).font("Helvetica").fontSize(9.5).text(t, tx, ty, { width: 130, align: "left" });
    const value = (v: string, ty: number) =>
      doc.fill(INK).font("Helvetica-Bold").fontSize(9.5).text(v, tx + 134, ty, { width: 106, align: "right" });

    label("Subtotal", y); value(money(itemsSubtotal, currency), y); y += 17;
    label("Delivery fee", y); value(money(deliveryFee, currency), y); y += 20;

    doc.roundedRect(tx - 12, y, 252, 32, 6).fill(NAVY);
    doc
      .fill("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("TOTAL", tx, y + 10, { width: 130 })
      .fontSize(12)
      .text(money(grandTotal, currency), tx + 134, y + 9, { width: 106, align: "right" });
    y += 46;

    if (order.totalUsd && order.currency !== "USD") {
      label("Total (USD)", y);
      value(`$${order.totalUsd.toLocaleString()}`, y);
      y += 17;
    }
    if (order.totalKes && order.currency === "USD") {
      label("Total (KES)", y);
      value(`KES ${order.totalKes.toLocaleString()}`, y);
      y += 17;
    }
    y += 10;

    /* ------------------------------ notes -------------------------------- */
    const notes: string[] = [
      "Payment is arranged personally by our shop team after stock confirmation — this document is a pro-forma receipt until payment is verified.",
    ];
    if (currency === "USD") {
      notes.push("International orders: our team will confirm international shipping costs before payment.");
    }
    doc
      .fill(MUTED)
      .font("Helvetica-Oblique")
      .fontSize(8.5);
    notes.forEach((n) => {
      const h = doc.heightOfString(n, { width: CW - 24 });
      doc.text(n, M + 12, y, { width: CW - 24 });
      y += h + 8;
    });

    /* ------------------------------ footer ------------------------------- */
    const fy = doc.page.height - 92;
    doc.moveTo(M, fy - 8).lineTo(W - M, fy - 8).lineWidth(1).strokeColor(LINE).stroke();
    doc
      .fill(NAVY)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Thank you for supporting hope.", M, fy);
    doc
      .fill(MUTED)
      .font("Helvetica")
      .fontSize(8.5)
      .text(
        `${settings.orgName} · ${settings.location}` +
          (settings.emailGeneral ? ` · ${settings.emailGeneral}` : "") +
          (settings.phone ? ` · ${settings.phone}` : ""),
        M,
        fy + 15,
      )
      .fill("#8CA0BC")
      .fontSize(7.5)
      .text(
        `Generated ${new Date().toLocaleString("en-KE")} · Transparency: handsofhope website /transparency`,
        M,
        fy + 30,
        { width: CW },
      );

    doc.end();
  });
}
