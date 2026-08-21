"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

const PRESETS = [500, 1000, 2500, 5000];

interface ProjectOption {
  slug: string;
  name: string;
}

export function DonateWidget({ projects }: { projects: ProjectOption[] }) {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [status, setStatus] = useState<"form" | "loading" | "done" | "error" | "redirecting">("form");
  const [result, setResult] = useState<{ reference?: string; message?: string }>({});
  const [error, setError] = useState("");

  const effectiveAmount = custom ? Number(custom) : amount;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amountKes: effectiveAmount,
          frequency,
          projectSlug: projectSlug || undefined,
          anonymous,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");

      // Paystack (or another hosted provider) — send the donor to checkout.
      if (json.kind === "redirect" && json.redirectUrl) {
        setStatus("redirecting");
        window.location.assign(json.redirectUrl);
        return;
      }

      setStatus("done");
      setResult(json);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-700">
          <Icon name="heart" size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-semibold text-navy-900">Thank you!</p>
        {result.reference && (
          <p className="mt-2 text-sm text-navy-600">
            Your reference:{" "}
            <span className="rounded-md bg-navy-50 px-2 py-0.5 font-mono text-xs font-bold text-navy-900">
              {result.reference}
            </span>
          </p>
        )}
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-800/85">{result.message}</p>
        <p className="mt-4 rounded-xl bg-navy-50 px-4 py-3 text-xs leading-relaxed text-navy-600">
          A gift is only receipted once payment is verified by our team or payment provider.
          You&apos;ll receive confirmation by email — keep your reference handy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9" aria-label="Donation form">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />

      {/* Frequency */}
      <div role="radiogroup" aria-label="Giving frequency" className="grid grid-cols-2 gap-1.5 rounded-full bg-navy-50 p-1.5">
        {(["once", "monthly"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={frequency === f}
            onClick={() => setFrequency(f)}
            className={`rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
              frequency === f ? "bg-navy-900 text-white shadow-card" : "text-navy-700 hover:text-navy-900"
            }`}
          >
            {f === "once" ? "Give Once" : "Give Monthly"}
          </button>
        ))}
      </div>

      {/* Amounts */}
      <fieldset className="mt-6">
        <legend className="label">Choose an amount (KES)</legend>
        <div className="mt-1 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setCustom("");
              }}
              aria-pressed={!custom && amount === preset}
              className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                !custom && amount === preset
                  ? "border-gold-400 bg-gold-50 text-gold-900 ring-2 ring-gold-300"
                  : "border-navy-200 text-navy-800 hover:border-gold-300 hover:bg-gold-50/40"
              }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative mt-2.5">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-navy-400">
            KES
          </span>
          <input
            type="number"
            min={50}
            step={1}
            inputMode="numeric"
            placeholder="Custom amount"
            aria-label="Custom amount in Kenyan shillings"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
            className="input pl-14"
          />
        </div>
        {effectiveAmount > 0 && effectiveAmount < 50 && (
          <p className="mt-2 text-xs font-semibold text-red-600">Minimum gift is KES 50.</p>
        )}
      </fieldset>

      {/* Project designation */}
      <div className="mt-5">
        <label htmlFor="don-project" className="label">
          Direct my gift to <span className="font-normal text-navy-400">(optional)</span>
        </label>
        <select
          id="don-project"
          value={projectSlug}
          onChange={(e) => setProjectSlug(e.target.value)}
          className="input"
        >
          <option value="">Where it&apos;s needed most</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Donor details */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="don-name" className="label">Your name {!anonymous && "*"}</label>
          <input
            id="don-name"
            name="donorName"
            required={!anonymous}
            disabled={anonymous}
            maxLength={120}
            className="input disabled:bg-navy-50 disabled:text-navy-300"
            placeholder={anonymous ? "Giving anonymously" : "Full name"}
          />
        </div>
        <div>
          <label htmlFor="don-email" className="label">Email *</label>
          <input id="don-email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="don-phone" className="label">
            Phone <span className="font-normal text-navy-400">(needed for future M-Pesa giving)</span>
          </label>
          <input id="don-phone" name="phone" maxLength={40} className="input" placeholder="+254…" />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-navy-800">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
        />
        Make my gift anonymous
      </label>

      {status === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || status === "redirecting" || !effectiveAmount || effectiveAmount < 50}
        className="btn-primary btn-lg mt-6 w-full"
      >
        {status === "loading"
          ? "Recording…"
          : status === "redirecting"
            ? "Taking you to secure checkout…"
            : `Give ${frequency === "monthly" ? "Monthly" : "Once"}${effectiveAmount >= 50 ? ` — KES ${Number(effectiveAmount).toLocaleString()}` : ""}`}
      </button>

      <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-navy-500">
        <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
        Online payments are being connected (M-Pesa ready). Your intention is recorded securely and
        our team completes the gift with you personally.
      </p>
    </form>
  );
}
