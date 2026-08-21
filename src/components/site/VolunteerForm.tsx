"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

export function VolunteerForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("loading");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("done");
      setMessage(json.message);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Icon name="check" size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-semibold text-navy-900">Asante sana!</p>
        <p className="mt-2 text-sm leading-relaxed text-navy-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="vol-name" className="label">Full name *</label>
          <input id="vol-name" name="name" required maxLength={120} className="input" placeholder="e.g. Wanjiru Kamau" />
        </div>
        <div>
          <label htmlFor="vol-email" className="label">Email *</label>
          <input id="vol-email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="vol-phone" className="label">Phone (optional)</label>
          <input id="vol-phone" name="phone" maxLength={40} className="input" placeholder="+254…" />
        </div>
        <div>
          <label htmlFor="vol-availability" className="label">Availability *</label>
          <select id="vol-availability" name="availability" required defaultValue="" className="input">
            <option value="" disabled>Select availability</option>
            <option>Weekends</option>
            <option>Weekdays (mornings)</option>
            <option>Weekdays (afternoons)</option>
            <option>Evenings / remote support</option>
            <option>One-off events only</option>
            <option>Flexible — ask me</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="vol-skills" className="label">Skills you can share *</label>
          <input
            id="vol-skills"
            name="skills"
            required
            minLength={3}
            maxLength={300}
            className="input"
            placeholder="e.g. Teaching, nursing, accounting, photography, driving, mentoring…"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="vol-message" className="label">Anything else? (optional)</label>
          <textarea
            id="vol-message"
            name="message"
            maxLength={3000}
            className="input"
            placeholder="Tell us about yourself and why you'd like to volunteer…"
          />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <button type="submit" disabled={state === "loading"} className="btn-primary btn-lg mt-6 w-full sm:w-auto">
        {state === "loading" ? "Sending…" : "Join Our Volunteer Community"}
        <Icon name="arrow-right" size={16} />
      </button>
      <p className="mt-3 text-xs text-navy-500">
        By applying you agree to our{" "}
        <a href="/safeguarding" className="underline underline-offset-2">safeguarding</a> and{" "}
        <a href="/privacy" className="underline underline-offset-2">privacy</a> policies.
      </p>
    </form>
  );
}
