import type { DonationIntent } from "@/types";
import { initializeTransaction, isPaystackConfigured } from "./paystack";

/* ==================================================================== */
/*  PAYMENT PROVIDER ARCHITECTURE                                       */
/*                                                                      */
/*  The site NEVER claims a donation succeeded unless the connected     */
/*  provider confirms it server-side.                                   */
/*                                                                      */
/*  Active providers (auto-selected):                                   */
/*    1. M-Pesa   → PAYMENT_PROVIDER=mpesa + Daraja creds (adapter stub) */
/*    2. Paystack → PAYSTACK_SECRET_KEY set in .env                     */
/*    3. Manual   → fallback: intent recorded, completed offline        */
/* ==================================================================== */

export type InitiationResult =
  | { kind: "pending"; message: string }
  | { kind: "redirect"; redirectUrl: string };

export interface PaymentProvider {
  readonly id: string;
  readonly label: string;
  initiate(intent: DonationIntent): Promise<InitiationResult>;
}

/** Records the intent for manual/offline completion. */
class PendingManualProvider implements PaymentProvider {
  readonly id = "pending-manual";
  readonly label = "Manual / offline completion";

  async initiate(): Promise<InitiationResult> {
    return {
      kind: "pending",
      message:
        "Thank you! Your giving intention has been recorded. Our team will contact you shortly to complete your gift securely.",
    };
  }
}

/** Paystack hosted checkout (cards, Apple Pay, bank transfer…). */
class PaystackProvider implements PaymentProvider {
  readonly id = "paystack";
  readonly label = "Paystack";

  async initiate(intent: DonationIntent): Promise<InitiationResult> {
    const tx = await initializeTransaction({
      email: intent.email,
      amountKes: intent.amountKes,
      currency: intent.currency ?? "KES",
      reference: intent.reference,
      metadata: {
        purpose: "donation",
        frequency: intent.frequency,
        project: intent.projectSlug ?? "general",
        donorName: intent.anonymous ? "Anonymous" : intent.donorName,
        custom_fields: [
          { display_name: "Frequency", variable_name: "frequency", value: intent.frequency },
          { display_name: "Designation", variable_name: "designation", value: intent.projectSlug || "Where needed most" },
        ],
      },
    });
    return { kind: "redirect", redirectUrl: tx.authorizationUrl };
  }
}

/**
 * M-Pesa adapter placeholder (Daraja / Lipa na M-Pesa Online).
 * Deliberately not configured yet — see the architecture note above.
 */
class MpesaProvider implements PaymentProvider {
  readonly id = "mpesa";
  readonly label = "M-Pesa";

  constructor() {
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_SHORTCODE) {
      throw new Error("M-Pesa is not configured. Add Daraja credentials to .env first.");
    }
  }

  async initiate(_intent: DonationIntent): Promise<InitiationResult> {
    // TODO: call Daraja STK Push with _intent.phone, amountKes, reference.
    throw new Error("STK Push not implemented yet.");
  }
}

export function getActiveProviderName(): string {
  if (process.env.PAYMENT_PROVIDER === "mpesa") return "mpesa";
  if (isPaystackConfigured()) return "paystack";
  return process.env.PAYMENT_PROVIDER || "pending-manual";
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_PROVIDER === "mpesa") return new MpesaProvider();
  if (isPaystackConfigured()) return new PaystackProvider();
  return new PendingManualProvider();
}

export function makeReference(prefix = "HH"): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
