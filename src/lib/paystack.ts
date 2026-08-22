import "server-only";

/**
 * Paystack server helpers (Transaction Initialize + Verify).
 *
 * Configure via .env:
 *   PAYSTACK_SECRET_KEY=sk_live_xxx / sk_test_xxx
 *   NEXT_PUBLIC_SITE_URL=https://yourdomain   (used as callback origin)
 *
 * The secret key NEVER reaches the browser — the donor is redirected to
 * Paystack's hosted page, and confirmation always comes from this server
 * verifying the transaction with Paystack before anything is marked paid.
 */

const PAYSTACK_API = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function secret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

export interface InitializedTransaction {
  authorizationUrl: string;
  accessCode?: string;
}

/** Creates a hosted checkout and returns the redirect URL. */
export async function initializeTransaction(opts: {
  email: string;
  amountKes: number;
  reference: string;
  currency?: "KES" | "USD";
  metadata?: Record<string, unknown>;
}): Promise<InitializedTransaction> {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      amount: Math.round(opts.amountKes * 100), // kobo/cents
      currency: opts.currency ?? "KES",
      reference: opts.reference,
      callback_url: `${origin}/donate/callback`,
      metadata: opts.metadata ?? {},
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; access_code?: string };
  };

  if (!json.status || !json.data?.authorization_url) {
    throw new Error(json.message || "Paystack initialization failed.");
  }
  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
  };
}

export type VerifiedPayment =
  | { ok: true; status: "success"; amountKes: number; paidAt?: string }
  | { ok: true; status: "failed" }
  | { ok: true; status: "pending" }
  | { ok: false; reason: string };

/** Verifies a transaction directly with Paystack. */
export async function verifyTransaction(reference: string): Promise<VerifiedPayment> {
  let res: Response;
  try {
    res = await fetch(
      `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret()}` },
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, reason: "Could not reach Paystack. Try again shortly." };
  }

  const json = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: { status: string; amount: number; currency?: string; paid_at?: string };
  };

  if (!json.status || !json.data) {
    return { ok: false, reason: json.message || "Transaction lookup failed." };
  }

  switch (json.data.status) {
    case "success":
      return {
        ok: true,
        status: "success",
        amountKes: json.data.amount / 100,
        paidAt: json.data.paid_at,
      };
    case "failed":
    case "abandoned":
      return { ok: true, status: "failed" };
    default:
      return { ok: true, status: "pending" };
  }
}
