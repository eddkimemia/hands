"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("done");
      setMessage(json.message);
      form.reset();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="card flex h-full flex-col items-center justify-center p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name="check" size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-semibold text-navy-900">Message sent</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="label">Name *</label>
          <input id="ct-name" name="name" required maxLength={120} className="input" placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="ct-email" className="label">Email *</label>
          <input id="ct-email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="ct-phone" className="label">Phone (optional)</label>
          <input id="ct-phone" name="phone" maxLength={40} className="input" placeholder="+254…" />
        </div>
        <div>
          <label htmlFor="ct-subject" className="label">Subject *</label>
          <select id="ct-subject" name="subject" required defaultValue="" className="input">
            <option value="" disabled>Choose a topic</option>
            <option>General enquiry</option>
            <option>Donations & giving</option>
            <option>Partnerships (companies & organizations)</option>
            <option>Volunteering</option>
            <option>Programs & projects</option>
            <option>Media & press</option>
            <option>Shop orders</option>
            <option>Other</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ct-message" className="label">Message *</label>
          <textarea
            id="ct-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            className="input"
            placeholder="How can we help?"
          />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn-primary btn-lg mt-6 w-full sm:w-auto">
        {state === "loading" ? "Sending…" : "Send Message"}
        <Icon name="send" size={15} />
      </button>
      <p className="mt-3 text-xs text-navy-500">
        We reply within two working days. Your details are used only to respond to you.
      </p>
    </form>
  );
}
