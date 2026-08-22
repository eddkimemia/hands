"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { ResourceConfig } from "@/lib/admin-config";

type Item = Record<string, unknown>;

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/${config.key}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      setItems((json.data as Item[]) ?? []);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [config.key, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(item: Item) {
    if (!confirm(`Delete "${String(item[config.titleField])}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/${config.key}/${item.id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
            {config.label}
            {!loading && (
              <span className="ml-2.5 rounded-full bg-gold-100 px-2.5 py-1 align-middle text-xs font-bold text-gold-800">
                {items.length}
              </span>
            )}
          </h1>
          {config.description && (
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-navy-600">{config.description}</p>
          )}
        </div>
        {!config.hideCreate && (
          <button onClick={() => router.push(`/admin/${config.key}/new`)} className="btn-primary btn-sm sm:!px-5 sm:!py-2.5 sm:text-sm">
            <Icon name="plus" size={15} />
            New {config.singular}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-navy-100/70" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy-900">Nothing here yet</p>
          <p className="mt-1 text-sm text-navy-500">{config.description}</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
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
                    <td key={col} className={i === 0 ? "px-4 py-3.5 font-semibold text-navy-900" : "px-4 py-3.5"}>
                      <CellView value={item[col]} />
                    </td>
                  ))}
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => router.push(`/admin/${config.key}/${item.id}`)}
                        aria-label={`Open ${config.customView === "order" ? "order" : String(item[config.titleField])}`}
                        title={config.customView === "order" ? "View order" : "Edit"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-100 text-navy-600 transition-colors hover:bg-navy-900 hover:text-white"
                      >
                        <Icon name={config.customView === "order" ? "file-text" : "edit"} size={14} />
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
