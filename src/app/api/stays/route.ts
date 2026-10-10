import { NextResponse } from "next/server";
import { publicContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await publicContent();
  return NextResponse.json(content.stays);
}