"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { FieldConfig, ResourceConfig } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

type Item = Record<string, unknown>;

export function blankFrom(config: ResourceConfig): Item {
  const item: Item = {};
  for (const f of config.fields) {
    switch (f.type) {
      case "number":
        item[f.key] = "";
        break;
      case "boolean":
        item[f.key] = false;
        break;
      case "list":
      case "objectlist":
        item[f.key] = [];
        break;
      default:
        item[f.key] = "";
    }
  }
  return item;
}

/**
 * Full-page create/edit form for a resource.
 * `item === null` → create mode.
 */
export function ItemForm({ config, item }: { config: ResourceConfig; item: Item | null }) {
  const router = useRouter();
  const isNew = !item;
  const [values, setValues] = useState<Item>(() => ({ ...(item ?? blankFrom(config)) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  const needsOptions = useMemo(
    () =>
      Array.from(
        new Set(config.fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom!)),
      ),
    [config],
  );

  useEffect(() => {
    for (const src of needsOptions) {
      fetch(`/api/admin/${src}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((json: { data?: Item[] }) => {
          const list = (json.data as Item[]) ?? [];
          setOptions((prev) => ({
            ...prev,
            [src]: list.map((it) => ({
              value: String(it.id ?? it.slug ?? ""),
              label: String(it.name ?? it.title ?? it.id),
            })),
          }));
        })
        .catch(() => undefined);
    }
  }, [needsOptions]);

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isNew
        ? `/api/admin/${config.key}`
        : `/api/admin/${config.key}/${String(item!.id)}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");
      router.push(`/admin/${config.key}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-xs font-semibold text-navy-400">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/admin" className="hover:text-gold-700">Admin</Link>
              </li>
              <li aria-hidden="true"><Icon name="arrow-right" size={11} /></li>
              <li>
                <Link href={`/admin/${config.key}`} className="hover:text-gold-700">{config.label}</Link>
              </li>
              <li aria-hidden="true"><Icon name="arrow-right" size={11} /></li>
              <li aria-current="page" className="text-navy-700">
                {isNew ? `New ${config.singular}` : `Edit`}
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
            {isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h1>
        </div>
        <Link href={`/admin/${config.key}`} className="btn-outline btn-sm shrink-0">
          <Icon name="arrow-left" size={14} />
          Back to list
        </Link>
      </div>

      <form onSubmit={save} className="card p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={values[field.key]}
              options={options}
              onChange={(v) => set(field.key, v)}
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex justify-end gap-3 border-t border-navy-100 pt-6">
          <Link href={`/admin/${config.key}`} className="btn-outline btn-sm">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary btn-sm !px-8 !py-3 text-sm">
            {saving ? "Saving…" : `Save ${config.singular}`}
            {!saving && <Icon name="check" size={15} />}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FieldInput({
  field,
  value,
  options,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  options: Record<string, { value: string; label: string }[]>;
  onChange: (value: unknown) => void;
}) {
  const id = `fld-${field.key}`;
  const wrapperClass = field.half ? "sm:col-span-1 col-span-2" : "col-span-2";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      onChange(json.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  switch (field.type) {
    case "textarea":
    case "paragraphs":
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <textarea
            id={id}
            required={field.required}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="input"
          />
          {field.help && <Help text={field.help} />}
        </div>
      );

    case "number":
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <input
            id={id}
            type="number"
            step="any"
            required={field.required}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="input"
          />
        </div>
      );

    case "boolean":
      return (
        <div className={cn(wrapperClass, "flex items-center")}>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-100 bg-white px-4 py-3">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 accent-gold-500"
            />
            <span className="text-sm font-semibold text-navy-800">{field.label}</span>
          </label>
        </div>
      );

    case "select": {
      const opts =
        field.optionsFrom && options[field.optionsFrom]
          ? [{ value: "", label: "— None —" }, ...options[field.optionsFrom]]
          : (field.options ?? []).map((o) => ({ value: o, label: o }));
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="input"
          >
            {!field.required && !field.optionsFrom && <option value="">—</option>}
            {opts.map((o) => (
              <option key={o.value + o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "image": {
      const current = String(value ?? "");
      const uploaded = current.startsWith("/api/media/");
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt=""
              className="h-20 w-20 shrink-0 rounded-xl border border-navy-100 bg-sand object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.15")}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <input
                id={id}
                type="text"
                inputMode="url"
                required={field.required && !current}
                value={current}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste an image link, or use Upload below"
                className="input"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-xs font-bold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-800",
                    uploading && "pointer-events-none opacity-60",
                  )}
                >
                  <Icon name="image" size={14} />
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadFile(file);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                {uploaded && (
                  <span className="chip bg-leaf-100 text-xs text-leaf-800">
                    <Icon name="check" size={12} />
                    Uploaded — saved with this product
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-navy-400">
                JPG, PNG, WebP, AVIF, GIF or SVG · up to 5 MB · stored directly in PostgreSQL
              </p>
              {uploadError && <p className="text-[11px] font-semibold text-red-600">{uploadError}</p>}
            </div>
          </div>
        </div>
      );
    }

    case "list":
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <textarea
            id={id}
            value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            onChange={(e) => onChange(e.target.value.split("\n"))}
            placeholder={"One per line…"}
            className="input min-h-[90px]"
          />
          {field.help && <Help text={field.help} />}
        </div>
      );

    case "objectlist": {
      const rows = Array.isArray(value) ? (value as Record<string, string>[]) : [];
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <div className="space-y-2.5">
            {rows.map((row, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl border border-navy-100 p-3">
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  {(field.subfields ?? []).map((sub) => (
                    <input
                      key={sub.key}
                      value={row[sub.key] ?? ""}
                      onChange={(e) => {
                        const next = [...rows];
                        next[i] = { ...next[i], [sub.key]: e.target.value };
                        onChange(next);
                      }}
                      placeholder={sub.label}
                      aria-label={`${field.label} row ${i + 1}: ${sub.label}`}
                      className="input !py-2 text-sm"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Remove row"
                  onClick={() => onChange(rows.filter((_, j) => j !== i))}
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-100 text-red-500 hover:bg-red-50"
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...rows, Object.fromEntries((field.subfields ?? []).map((s) => [s.key, ""]))])}
              className="btn-outline btn-sm w-full"
            >
              <Icon name="plus" size={13} />
              Add row
            </button>
          </div>
          {field.help && <Help text={field.help} />}
        </div>
      );
    }

    case "json":
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <pre className="max-h-40 overflow-auto rounded-xl border border-navy-100 bg-navy-50/70 p-3 text-xs text-navy-700">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );

    default:
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <input
            id={id}
            type="text"
            required={field.required}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="input"
          />
          {field.help && <Help text={field.help} />}
        </div>
      );
  }
}

function Label({ field, id }: { field: FieldConfig; id: string }) {
  return (
    <label htmlFor={id} className="label">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function Help({ text }: { text: string }) {
  return <p className="mt-1 text-xs text-navy-400">{text}</p>;
}
