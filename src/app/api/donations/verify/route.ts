import { NextResponse } from "next/server";
import { findItemByField, updateItem } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import type { DonationIntent } from "@/types";
import { clientIp, tooManyRequests } from "@/lib/forms";

export const runtime = "nodejs";

/**
 * Verifies a donation against Paystack after the donor returns from the
 * hosted checkout. A donation is marked confirmed ONLY when Paystack
 * reports success AND the amount matches the recorded intent.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: { reference?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const intent = await findItemByField<DonationIntent>("donations", "reference", reference);
  if (!intent) {
    return NextResponse.json({ error: "Unknown donation reference." }, { status: 404 });
  }
  if (intent.status === "confirmed") {
    return NextResponse.json({ confirmed: true, amountKes: intent.amountKes });
  }

  const result = await verifyTransaction(reference);
  if (!result.ok) {
    return NextResponse.json(
      { confirmed: false, pending: true, message: result.reason },
      { status: 200 },
    );
  }

  if (result.status === "success") {
    if (Math.round(result.amountKes) < Math.round(intent.amountKes)) {
      // Amount mismatch — record for manual review, never auto-confirm.
      await updateItem("donations", intent.id, {
        ...intent,
        status: "pending",
        provider: `paystack-amount-mismatch`,
      });
      return NextResponse.json({
        confirmed: false,
        pending: true,
        message: "Payment received but the amount needs review. Our team will confirm shortly.",
      });
    }

    await updateItem("donations", intent.id, {
      ...intent,
      status: "confirmed",
      provider: "paystack",
    });
    return NextResponse.json({ confirmed: true, amountKes: result.amountKes });
  }

  if (result.status === "failed") {
    await updateItem("donations", intent.id, { ...intent, status: "failed" });
    return NextResponse.json({
      confirmed: false,
      failed: true,
      message: "The payment was not completed. You can safely try again.",
    });
  }

  return NextResponse.json({
    confirmed: false,
    pending: true,
    message: "Payment is still processing — we'll confirm it shortly. Keep your reference handy.",
  });
}
