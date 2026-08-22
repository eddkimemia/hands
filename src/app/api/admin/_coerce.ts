import { getResource } from "@/lib/admin-config";
import { slugify } from "@/lib/utils";
import type { FieldConfig } from "@/lib/admin-config";

/**
 * Coerces raw form input into typed values according to the resource's
 * field configuration. Unknown keys are dropped.
 */
export function coerceItem(
  fields: FieldConfig[],
  input: Record<string, unknown>,
  existing?: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(existing ?? {}) };

  for (const field of fields) {
    const raw = input[field.key];

    // Partial updates: when a key is absent from the payload entirely,
    // preserve the stored value instead of wiping it.
    if (!(field.key in input)) continue;

    switch (field.type) {
      case "number": {
        const n = Number(raw);
        out[field.key] = Number.isFinite(n) ? n : 0;
        break;
      }
      case "boolean":
        out[field.key] = raw === true || raw === "true" || raw === "on";
        break;
      case "list":
        out[field.key] = Array.isArray(raw)
          ? raw.map((x) => String(x).trim()).filter(Boolean)
          : String(raw ?? "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
        break;
      case "objectlist": {
        if (Array.isArray(raw)) {
          out[field.key] = raw
            .map((entry) => {
              const obj: Record<string, string> = {};
              for (const sub of field.subfields ?? []) {
                obj[sub.key] = String((entry as Record<string, unknown>)?.[sub.key] ?? "").trim();
              }
              return obj;
            })
            .filter((obj) => Object.values(obj).some(Boolean));
        } else {
          // keep existing when untouched
          if (!(field.key in out)) out[field.key] = [];
        }
        break;
      }
      case "json":
        // read-only display — never overwritten from the form
        if (existing && field.key in existing) out[field.key] = existing[field.key];
        else if (raw !== undefined) {
          try {
            out[field.key] = typeof raw === "string" ? JSON.parse(raw) : raw;
          } catch {
            out[field.key] = raw;
          }
        }
        break;
      default: {
        const str = typeof raw === "string" ? raw.trim() : raw;
        out[field.key] = str === undefined || str === null ? "" : str;
        if (field.key === "slug" && !out.slug && existing?.slug) {
          out.slug = existing.slug; // don't clobber a good slug with empty
        }
      }
    }
  }

  // Auto-generate slug from title field when blank
  if ("slug" in out && !out.slug) {
    const titleish =
      (input.name as string) || (input.title as string) || (input.customerName as string);
    if (titleish) out.slug = slugify(String(titleish));
  }

  return out;
}
