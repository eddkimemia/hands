import { NextResponse } from "next/server";
import { id, insertItem } from "@/lib/db";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";
import type { VolunteerApp } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many applications. Please try again a little later." },
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
    return NextResponse.json({ ok: true, message: "Application received." });
  }

  const errors = validateFields(body, {
    name: { required: true, max: 120 },
    email: { required: true, email: true, max: 200 },
    phone: { max: 40 },
    skills: { required: true, min: 3, max: 300 },
    availability: { required: true, max: 200 },
    message: { max: 3000 },
  });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }

  const application: VolunteerApp = {
    id: id("vol"),
    name: cleanStr(body.name, 120)!,
    email: String(body.email).toLowerCase().trim(),
    phone: cleanStr(body.phone, 40),
    skills: cleanStr(body.skills, 300)!,
    availability: cleanStr(body.availability, 200)!,
    message: cleanStr(body.message, 3000),
    createdAt: new Date().toISOString(),
    status: "new",
  };

  await insertItem("volunteers", application.id, application);

  return NextResponse.json({
    ok: true,
    message:
      "Asante sana! Your volunteer application has been received — our team will be in touch soon.",
  });
}
