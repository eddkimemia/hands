import { NextResponse } from "next/server";
import { id, insertItem } from "@/lib/db";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";
import { getPaymentProvider, makeReference } from "@/lib/payments";
import type { DonationIntent } from "@/types";

export const runtime = "nodejs";

/**
 * Creates a donation *intent*. A donation is only ever marked "confirmed"
 * after the active payment provider verifies it (see lib/payments.ts).
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again a little later." },
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
    return NextResponse.json({ ok: true, message: "Intent received." });
  }

  const amount = Number(body.amountKes);
  const frequency = body.frequency === "monthly" ? "monthly" : "once";

  const errors = validateFields(body, {
    donorName: { required: !body.anonymous, max: 120, label: "Your name" },
    email: { required: true, email: true, max: 200, label: "Email" },
    phone: { max: 40, label: "Phone" },
  });
  if (!Number.isFinite(amount) || amount < 50) {
    errors.amountKes = "Please enter an amount of KES 50 or more.";
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }

  const provider = getPaymentProvider();
  const intent: DonationIntent = {
    id: id("don"),
    amountKes: Math.round(amount),
    frequency,
    projectSlug: cleanStr(body.projectSlug, 100),
    donorName: body.anonymous ? "Anonymous friend" : cleanStr(body.donorName, 120)!,
    email: String(body.email).toLowerCase().trim(),
    phone: cleanStr(body.phone, 40),
    anonymous: Boolean(body.anonymous),
    message: cleanStr(body.message, 2000),
    provider: provider.id,
    reference: makeReference(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await insertItem("donations", intent.id, intent);

  try {
    const initiation = await provider.initiate(intent);
    if (initiation.kind === "redirect") {
      return NextResponse.json({
        ok: true,
        reference: intent.reference,
        kind: "redirect",
        redirectUrl: initiation.redirectUrl,
        message: "Continue to the secure payment page to complete your gift.",
      });
    }
    return NextResponse.json({
      ok: true,
      reference: intent.reference,
      kind: initiation.kind,
      message: initiation.message,
    });
  } catch {
    // Provider misconfigured — keep the recorded intent but tell the truth.
    return NextResponse.json(
      {
        ok: true,
        reference: intent.reference,
        kind: "pending",
        message:
          "Your giving intention has been recorded. Online payments are being connected — our team will contact you to complete your gift securely.",
      },
      { status: 200 },
    );
  }
}
