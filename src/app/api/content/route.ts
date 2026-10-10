import { NextResponse } from "next/server";
import { isSiteContent, requireAdmin } from "@/lib/guard";
import { writeContent } from "@/lib/store";

export async function PUT(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!isSiteContent(body)) {
    return NextResponse.json({ error: "The website content is incomplete." }, { status: 400 });
  }

  writeContent(body);
  return NextResponse.json({ ok: true });
}
