import type { CartItem } from "@/components/cart/CartContext";

/** The foundation's WhatsApp business number (digits only for wa.me). */
export const WHATSAPP_NUMBER = "254715135141";

/**
 * Builds a wa.me deep link carrying a formatted order message.
 * Works on mobile (opens WhatsApp app) and desktop (WhatsApp Web).
 */
export function buildWhatsAppOrderUrl(
  items: Pick<CartItem, "name" | "qty" | "size" | "color" | "priceKes">[],
  opts?: { note?: string },
): string {
  const lines: string[] = ["Hello Hands of Hope Foundation! I would like to order:", ""];

  let total = 0;
  items.forEach((item, i) => {
    const variant = [item.size, item.color].filter(Boolean).join(", ");
    const lineTotal = item.priceKes * item.qty;
    total += lineTotal;
    lines.push(
      `${i + 1}. ${item.name}${variant ? ` (${variant})` : ""} × ${item.qty} — KES ${lineTotal.toLocaleString()}`,
    );
  });

  lines.push("", `Total: KES ${total.toLocaleString()}`);
  if (opts?.note) lines.push("", opts.note);
  lines.push("", "My name:", "Delivery location:");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
