import { isEmail } from "./utils";

/* ------------------------------------------------------------------ */
/*  Lightweight in-memory rate limiter + spam protection for forms.    */
/*  Suitable for a small site; swap for Redis when scaling out.        */
/* ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_MAX_HITS = 25;

export function tooManyRequests(ip: string, maxHits = DEFAULT_MAX_HITS): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= maxHits) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Honeypot: real users never see or fill these fields. */
export function isSpam(body: Record<string, unknown>): boolean {
  if (typeof body._gotcha === "string" && body._gotcha.trim() !== "") return true;
  if (typeof body._company === "string" && body._company.trim() !== "") return true;
  return false;
}

export interface FieldRule {
  required?: boolean;
  email?: boolean;
  max?: number;
  min?: number;
  /** Human-friendly field name used in validation messages. */
  label?: string;
}

export function validateFields(
  body: Record<string, unknown>,
  rules: Record<string, FieldRule>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const name = rule.label ?? field;
    let value = body[field];
    if (typeof value === "string") value = value.trim();

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors[field] = `${name} is required.`;
      continue;
    }
    if (value === undefined || value === null || value === "") continue;

    if (typeof value !== "string") {
      errors[field] = `${name} has an invalid value.`;
      continue;
    }
    if (rule.email && !isEmail(value)) errors[field] = `${name} must be a valid email address.`;
    if (rule.min && value.length < rule.min)
      errors[field] = `${name} must be at least ${rule.min} characters.`;
    if (rule.max && value.length > rule.max)
      errors[field] = `${name} must stay under ${rule.max} characters.`;
  }

  return errors;
}

export function cleanStr(value: unknown, max = 5000): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v ? v.slice(0, max) : undefined;
}
