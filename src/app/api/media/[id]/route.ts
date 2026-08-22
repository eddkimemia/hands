import { NextResponse } from "next/server";
import { getMedia } from "@/lib/db";

export const runtime = "nodejs";

/** Serves images uploaded to PostgreSQL. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const media = await getMedia(id);
  if (!media) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Buffer → Uint8Array for the web Response body.
  const body = new Uint8Array(media.data);
  return new Response(body, {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(media.bytes),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
