import { NextResponse } from "next/server";
import { publicContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const tour = (await publicContent()).tours.find((item) => item.slug === slug);
  if (!tour) return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  return NextResponse.json(tour);
}
