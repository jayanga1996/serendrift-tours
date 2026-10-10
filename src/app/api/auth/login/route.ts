import { NextResponse } from "next/server";
import { adminEmail, passwordsMatch } from "@/lib/auth";
import { createSessionToken, sessionCookieName, sessionMaxAge } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (email !== adminEmail().toLowerCase() || !passwordsMatch(password)) {
    return NextResponse.json({ error: "Those details do not match." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName(), await createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge(),
  });
  return response;
}
