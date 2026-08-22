"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

export function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [gotcha, setGotcha] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, consent, _gotcha: gotcha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
      setMessage(data.message);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-lift">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name="check" size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-semibold text-navy-900">You&apos;re subscribed!</p>
        <p className="mt-2 text-sm text-navy-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="w-full max-w-xl">
      <input
        type="text"
        name="_gotcha"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nl-name" className="label">
            Name
          </label>
          <input
            id="nl-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="nl-email" className="label">
            Email
          </label>
          <input
            id="nl-email"
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-navy-700">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
        />
        <span>
          I agree to receive email updates from Ishara Charity and understand I can
          unsubscribe at any time. We handle your data according to our{" "}
          <a href="/privacy" className="font-semibold underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn-primary mt-6 w-full sm:w-auto">
        {state === "loading" ? "Subscribing…" : "Subscribe"}
        <Icon name="send" size={15} />
      </button>
    </form>
  );
}

export function NewsletterSection({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-br from-royal-800 via-navy-900 to-navy-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
      />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow !text-gold-300 before:!bg-gold-400">Newsletter</p>
          <h2 className="h-display text-3xl !text-white sm:text-4xl">{heading}</h2>
          <p className="lede mt-4 !text-navy-100/85">{body}</p>
        </div>
        <div className="flex lg:justify-end">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
