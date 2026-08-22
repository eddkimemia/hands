"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldInput } from "@/components/admin/ItemForm";
import { Icon } from "@/components/Icon";
import type { ResourceConfig } from "@/lib/admin-config";

type Item = Record<string, unknown>;

/** Full-page editor for singleton resources (Homepage content, Site Settings). */
export function SingletonForm({ config, item }: { config: ResourceConfig; item: Item }) {
  const router = useRouter();
  const [values, setValues] = useState<Item>(() => ({ ...item }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
    setSavedAt(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (config.key === "settings") {
      const w = String(values.whatsappGroupUrl ?? "").trim();
      if (w && !/^https:\/\/(chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com)/i.test(w)) {
        setError(
          "WhatsApp link must start with https://chat.whatsapp.com or https://wa.me — social page links belong in the socials list below.",
        );
        setSaving(false);
        return;
      }
    }
    try {
      const res = await fetch(`/api/admin/${config.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");
      setSavedAt(new Date().toLocaleTimeString());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          {config.label}
        </h1>
        {config.description && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-navy-600">{config.description}</p>
        )}
      </div>

      <form onSubmit={save} className="card p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={values[field.key]}
              options={{}}
              onChange={(v) => set(field.key, v)}
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-navy-100 pt-6">
          <p aria-live="polite" className="text-xs text-navy-500">
            {savedAt ? `Saved at ${savedAt}` : "Changes go live immediately after saving."}
          </p>
          <button type="submit" disabled={saving} className="btn-primary btn-sm !px-8 !py-3 text-sm">
            {saving ? "Saving…" : "Save Changes"}
            {!saving && <Icon name="check" size={15} />}
          </button>
        </div>
      </form>
    </div>
  );
}
