"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="card p-8 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
          <Icon name="lock" size={24} />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl font-semibold text-navy-900">
          Admin Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-navy-600">
          Enter the administrator password to manage website content.
        </p>

        <div className="mt-7">
          <label htmlFor="admin-password" className="label">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary btn-lg mt-6 w-full">
          {loading ? "Checking…" : "Sign In"}
        </button>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-navy-500">
        Set the password via the <code className="rounded bg-navy-100 px-1.5 py-0.5">ADMIN_PASSWORD</code>{" "}
        environment variable before first use.
      </p>
    </form>
  );
}
