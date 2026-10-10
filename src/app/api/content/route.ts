import { NextResponse } from "next/server";
import { isDuplicateEntry } from "@/lib/db/pool";
import { isSiteContent, requireAdmin } from "@/lib/guard";
import { publicContent, readContent, writeContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { response } = await requireAdmin();
  const content = response ? await publicContent() : await readContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!isSiteContent(body)) {
    return NextResponse.json({ error: "The website content is incomplete." }, { status: 400 });
  }

  try {
    await writeContent(body);
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return NextResponse.json(
        { error: "Two tours or destinations share the same link name." },
        { status: 400 },
      );
    }
    throw error;
  }
  return NextResponse.json({ ok: true });
}
