import { NextResponse } from "next/server";
import { id, insertItem } from "@/lib/db";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";

export const runtime = "nodejs";

/** Receives messages from the floating chat widget. */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again a little later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (isSpam(body)) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateFields(body, {
    name: { max: 120 },
    email: { email: true, max: 200 },
    message: { required: true, min: 2, max: 2000 },
    page: { max: 200 },
  });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0] }, { status: 422 });
  }

  const chat = {
    id: id("cht"),
    name: cleanStr(body.name, 120),
    email: cleanStr(body.email, 200)?.toLowerCase(),
    page: cleanStr(body.page, 200) || "/",
    message: cleanStr(body.message, 2000)!,
    createdAt: new Date().toISOString(),
    status: "new" as const,
  };

  await insertItem("chats", chat.id, chat);

  return NextResponse.json({ ok: true });
}
