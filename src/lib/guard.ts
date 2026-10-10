import { NextResponse } from "next/server";
import { currentAdmin } from "./auth";
import type { SiteContent } from "./types";

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json({ error: "Please sign in again." }, { status: 401 }),
    };
  }
  return { admin, response: null };
}

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const content = value as SiteContent;
  return Boolean(
    content.brand &&
      typeof content.brand.name === "string" &&
      Array.isArray(content.tours) &&
      Array.isArray(content.destinations) &&
      Array.isArray(content.stays) &&
      Array.isArray(content.heroSlides),
  );
}

export function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}
