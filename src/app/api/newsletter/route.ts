import { NextResponse } from "next/server";
import { findItemByField, id, insertItem } from "@/lib/db";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again a little later." },
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
    // Silently accept to avoid tipping off bots.
    return NextResponse.json({ ok: true, message: "Subscribed." });
  }

  const errors = validateFields(body, {
    name: { required: true, max: 120, label: "Name" },
    email: { required: true, email: true, max: 200, label: "Email" },
  });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Please agree to receive updates (consent is required)." },
      { status: 422 },
    );
  }

  const email = String(body.email).toLowerCase().trim();

  const duplicate = await findItemByField("subscribers", "email", email);
  if (duplicate) {
    return NextResponse.json({ ok: true, message: "You're already on the list — thank you!" });
  }

  const subscriber = {
    id: id("sub"),
    name: cleanStr(body.name, 120)!,
    email,
    createdAt: new Date().toISOString(),
    confirmed: false,
  };

  await insertItem("subscribers", subscriber.id, subscriber);

  return NextResponse.json({
    ok: true,
    message: `Welcome, ${subscriber.name.split(" ")[0]}! Watch your inbox for stories of hope.`,
  });
}
