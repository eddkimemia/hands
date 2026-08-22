import { NextResponse } from "next/server";
import { saveMedia } from "@/lib/db";
import { clientIp, tooManyRequests } from "@/lib/forms";
import { isAdminRequest, unauthorized } from "../_guard";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"]);

/** Admin-only image upload — stores the file in PostgreSQL, returns its URL. */
export async function POST(req: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json({ error: "Too many uploads. Try again shortly." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported format. Use JPG, PNG, WebP, AVIF, GIF or SVG." },
      { status: 422 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 5 MB." }, { status: 422 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveMedia(file.name || "upload", file.type, buffer);

  return NextResponse.json({ ok: true, url: saved.url, id: saved.id });
}
