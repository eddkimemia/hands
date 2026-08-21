import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/auth";

/** Returns true when the current request carries a valid admin session. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}
