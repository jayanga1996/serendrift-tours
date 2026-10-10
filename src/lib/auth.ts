import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { readSession, sessionCookieName } from "./session";

export function adminEmail() {
  return process.env.ADMIN_EMAIL || "admin@serendrift.lk";
}

export function passwordsMatch(input: string) {
  const expected = process.env.ADMIN_PASSWORD || "Serendrift@2026";
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function currentAdmin() {
  const jar = await cookies();
  return readSession(jar.get(sessionCookieName())?.value);
}
