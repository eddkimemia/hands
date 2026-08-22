import { NextResponse } from "next/server";
import { getResource } from "@/lib/admin-config";
import { getSingleton, id, insertItem, listItemsWithId, putSingleton } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { isAdminRequest, unauthorized } from "../_guard";
import { coerceItem } from "../_coerce";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string }> };

const FORM_ONLY_RESOURCES = new Set([
  "enquiries",
  "subscribers",
  "volunteers",
  "donations",
  "orders",
  "chats",
]);

/** GET /api/admin/:resource — list a collection or read a singleton. */
export async function GET(_req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { resource } = await ctx.params;
  const config = getResource(resource);
  if (!config) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });

  const data = config.singleton
    ? await getSingleton(resource as "settings" | "homepage")
    : await listItemsWithId(resource as never);
  return NextResponse.json({ ok: true, singleton: Boolean(config.singleton), data });
}

/** PUT /api/admin/:resource — update a singleton resource (settings/homepage). */
export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { resource } = await ctx.params;
  const config = getResource(resource);
  if (!config) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });
  if (!config.singleton)
    return NextResponse.json(
      { error: "Use /api/admin/:resource/:id to update collection items." },
      { status: 400 },
    );

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const current = await getSingleton<Record<string, unknown>>(
    resource as "settings" | "homepage",
  );
  const next = coerceItem(config.fields, body, current);

  // Guard: WhatsApp community link must actually point at WhatsApp —
  // this catches social-page links accidentally pasted into the field.
  if (resource === "settings") {
    const w = String(next.whatsappGroupUrl ?? "").trim();
    if (w && !/^https:\/\/(chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com)/i.test(w)) {
      return NextResponse.json(
        {
          error:
            "WhatsApp link looks wrong — it should start with https://chat.whatsapp.com or https://wa.me (social page links belong in the socials list below).",
        },
        { status: 422 },
      );
    }
  }

  await putSingleton(resource as "settings" | "homepage", next);
  return NextResponse.json({ ok: true, item: next });
}

/** POST /api/admin/:resource — create an item in a collection. */
export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { resource } = await ctx.params;
  const config = getResource(resource);
  if (!config) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });
  if (config.singleton)
    return NextResponse.json({ error: "This resource is not a collection." }, { status: 400 });
  if (FORM_ONLY_RESOURCES.has(resource))
    return NextResponse.json({ error: "Creation is disabled for this resource." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  for (const field of config.fields) {
    if (field.required) {
      const v = body[field.key];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) {
        return NextResponse.json({ error: `"${field.label}" is required.` }, { status: 422 });
      }
    }
  }

  const item = coerceItem(config.fields, body);

  // Auto slug
  if ("slug" in item && !item.slug) {
    const base = String(body[config.titleField] ?? "item");
    item.slug = `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const itemId = id(resource.slice(0, 3));
  const stored = { ...item, id: itemId };
  await insertItem(resource as never, itemId, stored);

  return NextResponse.json({ ok: true, item: stored }, { status: 201 });
}
