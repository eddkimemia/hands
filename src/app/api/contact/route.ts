import { NextResponse } from "next/server";
import { id, insertItem } from "@/lib/db";
import { cleanStr, clientIp, isSpam, tooManyRequests, validateFields } from "@/lib/forms";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again a little later." },
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
    return NextResponse.json({ ok: true, message: "Message received." });
  }

  const errors = validateFields(body, {
    name: { required: true, max: 120, label: "Name" },
    email: { required: true, email: true, max: 200, label: "Email" },
    phone: { max: 40, label: "Phone" },
    subject: { required: true, max: 150, label: "Subject" },
    message: { required: true, min: 10, max: 5000, label: "Message" },
  });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 422 });
  }

  const enquiry = {
    id: id("enq"),
    name: cleanStr(body.name, 120)!,
    email: String(body.email).toLowerCase().trim(),
    phone: cleanStr(body.phone, 40),
    subject: cleanStr(body.subject, 150)!,
    message: cleanStr(body.message, 5000)!,
    createdAt: new Date().toISOString(),
    handled: false,
  };

  await insertItem("enquiries", enquiry.id, enquiry);

  return NextResponse.json({
    ok: true,
    message: "Thank you for reaching out — our team will reply as soon as possible.",
  });
}
