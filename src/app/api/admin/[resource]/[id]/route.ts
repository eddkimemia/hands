import { NextResponse } from "next/server";
import { getResource } from "@/lib/admin-config";
import { deleteItem, getItem, updateItem } from "@/lib/db";
import type { CollectionKey } from "@/lib/db";
import { isAdminRequest, unauthorized } from "../../_guard";
import { coerceItem } from "../../_coerce";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string; id: string }> };

/** PUT /api/admin/:resource/:id — update an item. */
export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { resource, id } = await ctx.params;
  const config = getResource(resource);
  if (!config) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });
  if (config.singleton)
    return NextResponse.json(
      { error: "Use /api/admin/:resource to update singletons." },
      { status: 400 },
    );

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const existing = await getItem(resource as never, id);
  if (!existing) return NextResponse.json({ error: "Item not found." }, { status: 404 });

  const next = coerceItem(config.fields, body, existing);
  next.id = id; // id is immutable
  await updateItem(resource as never, id, next);

  return NextResponse.json({ ok: true, item: next });
}

/** DELETE /api/admin/:resource/:id — remove an item. */
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) return unauthorized();
  const { resource, id } = await ctx.params;
  const config = getResource(resource);
  if (!config || config.singleton)
    return NextResponse.json({ error: "Unknown resource." }, { status: 404 });

  const deleted = await deleteItem(resource as CollectionKey, id);
  if (!deleted) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
