"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { FieldConfig, ResourceConfig } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

type Item = Record<string, unknown>;

interface ListResponse {
  ok: boolean;
  singleton: boolean;
  data: Item | Item[];
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [singleton, setSingleton] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [options, setOptions] = useState<Record<string, { value: string; label: string }[]>>({});

  const needsOptions = useMemo(
    () =>
      Array.from(
        new Set(config.fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom!)),
      ),
    [config],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/${config.key}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json: ListResponse = await res.json();
      if (json.singleton) setSingleton(json.data as Item);
      else setItems((json.data as Item[]) ?? []);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [config.key]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    for (const src of needsOptions) {
      fetch(`/api/admin/${src}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((json: ListResponse) => {
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

  async function handleSaved() {
    setEditing(null);
    await load();
  }

  async function handleDelete(item: Item) {
    if (!confirm(`Delete "${String(item[config.titleField])}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/${config.key}/${item.id}`, { method: "DELETE" });
    await load();
  }

  /* ------------------------------ singleton ------------------------------ */
  if (config.singleton) {
    return (
      <div className="mx-auto max-w-3xl">
        <Header config={config} count={undefined} onNew={undefined} />
        {loading ? (
          <Loading />
        ) : singleton ? (
          <ItemForm
            config={config}
            initial={singleton}
            options={options}
            onSaved={handleSaved}
            onCancel={() => undefined}
          />
        ) : (
          <p className="text-sm text-red-600">Failed to load settings.</p>
        )}
      </div>
    );
  }

  /* ------------------------------ collection ----------------------------- */
  return (
    <div>
      <Header
        config={config}
        count={items.length}
        onNew={config.hideCreate ? undefined : () => setEditing("new")}
      />

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">Nothing here yet</p>
          <p className="mt-1 text-sm text-navy-500">{config.description}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-xs uppercase tracking-wider text-navy-500">
                {config.columns.map((col) => (
                  <th key={col} className="px-4 py-3 font-bold">
                    {labelFor(config, col)}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item.id)} className="border-b border-navy-50 last:border-0 hover:bg-sand/60">
                  {config.columns.map((col, i) => (
                    <td key={col} className={cn("px-4 py-3.5", i === 0 && "font-semibold text-navy-900")}>
                      <CellView value={item[col]} />
                    </td>
                  ))}
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(item)}
                        aria-label={`Edit ${String(item[config.titleField])}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-100 text-navy-600 transition-colors hover:bg-navy-900 hover:text-white"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        aria-label={`Delete ${String(item[config.titleField])}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-100 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ItemForm
          config={config}
          initial={editing === "new" ? blankFrom(config) : editing}
          options={options}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Header({
  config,
  count,
  onNew,
}: {
  config: ResourceConfig;
  count?: number;
  onNew?: () => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          {config.label}
          {count !== undefined && (
            <span className="ml-2.5 rounded-full bg-gold-100 px-2.5 py-1 align-middle text-xs font-bold text-gold-800">
              {count}
            </span>
          )}
        </h1>
        {config.description && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-navy-600">{config.description}</p>
        )}
      </div>
      {onNew && (
        <button onClick={onNew} className="btn-primary btn-sm sm:!px-5 sm:!py-2.5 sm:text-sm">
          <Icon name="plus" size={15} />
          New {config.singular}
        </button>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-navy-100/70" />
      ))}
    </div>
  );
}

function labelFor(config: ResourceConfig, key: string): string {
  const field = config.fields.find((f) => f.key === key);
  return field?.label ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function CellView({ value }: { value: unknown }) {
  if (typeof value === "boolean")
    return value ? (
      <span className="chip bg-leaf-100 text-leaf-800">Yes</span>
    ) : (
      <span className="chip bg-navy-50 text-navy-400">No</span>
    );
  if (typeof value === "number") return <span className="tabular-nums">{value.toLocaleString()}</span>;
  const str = String(value ?? "");
  return <span className="line-clamp-1 block max-w-[280px] text-navy-700">{str || "—"}</span>;
}

function blankFrom(config: ResourceConfig): Item {
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

/* ------------------------------- Form ------------------------------- */

function ItemForm({
  config,
  initial,
  options,
  onSaved,
  onCancel,
}: {
  config: ResourceConfig;
  initial: Item;
  options: Record<string, { value: string; label: string }[]>;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Item>(() => ({ ...initial }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isNew = !initial.id;

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isNew ? `/api/admin/${config.key}` : `/api/admin/${config.key}/${initial.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/50 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${isNew ? "Create" : "Edit"} ${config.singular}`}
    >
      <form
        onSubmit={save}
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-navy-900">
            {isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-100 text-navy-600 hover:bg-navy-50"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-6 sm:grid-cols-2">
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

        <div className="border-t border-navy-100 px-6 py-4">
          {error && (
            <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={onCancel} className="btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary btn-sm !px-6 !py-2.5 text-sm">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

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

    case "image":
      return (
        <div className={wrapperClass}>
          <Label field={field} id={id} />
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={String(value || "")}
              alt=""
              className="h-20 w-20 shrink-0 rounded-xl border border-navy-100 bg-sand object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.15")}
            />
            <input
              id={id}
              type="url"
              required={field.required}
              value={String(value ?? "")}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://…"
              className="input"
            />
          </div>
        </div>
      );

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
