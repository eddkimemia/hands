"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

interface State {
  status: "verifying" | "confirmed" | "failed" | "pending" | "error";
  message?: string;
  amountKes?: number;
}

export function VerifyDonation() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState<State>({ status: "verifying" });

  useEffect(() => {
    if (!reference) {
      setState({ status: "error", message: "No payment reference was provided." });
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/donations/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const json = await res.json();
        if (cancelled) return;

        if (json.confirmed) {
          setState({ status: "confirmed", amountKes: json.amountKes });
        } else if (json.failed) {
          setState({ status: "failed", message: json.message });
        } else if (json.pending) {
          setState({ status: "pending", message: json.message });
        } else {
          setState({ status: "error", message: json.error || "Verification failed." });
        }
      } catch {
        if (!cancelled)
          setState({
            status: "pending",
            message:
              "We couldn't verify right now — your payment may still have gone through. Contact us with your reference and we'll confirm.",
          });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-lift">
      {state.status === "verifying" && (
        <>
          <span className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-navy-100 text-navy-400">
            <Icon name="credit-card" size={26} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">Verifying payment…</p>
        </>
      )}

      {state.status === "confirmed" && (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
            <Icon name="check" size={28} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">
            Asante sana! Your gift is confirmed
          </p>
          {typeof state.amountKes === "number" && (
            <p className="mt-2 text-sm font-bold text-gold-700">
              KES {state.amountKes.toLocaleString()} received
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            A receipt has been recorded against reference{" "}
            <code className="rounded bg-navy-50 px-1.5 py-0.5 font-mono text-xs">{reference}</code>. Your support is already on its way to the community.
          </p>
          <Link href="/impact" className="btn-primary btn-sm mt-6">
            See What You Make Possible
          </Link>
        </>
      )}

      {state.status === "failed" && (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Icon name="alert-circle" size={26} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">Payment not completed</p>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">{state.message}</p>
          <Link href="/donate" className="btn-primary btn-sm mt-6">
            Try Again
          </Link>
        </>
      )}

      {(state.status === "pending" || state.status === "error") && (
        <>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-700">
            <Icon name="clock" size={26} />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">
            {state.status === "pending" ? "Still confirming…" : "Something went wrong"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">{state.message}</p>
          {reference && (
            <p className="mt-3 text-xs text-navy-500">
              Reference:{" "}
              <code className="rounded bg-navy-50 px-1.5 py-0.5 font-mono">{reference}</code>
            </p>
          )}
        </>
      )}
    </div>
  );
}
