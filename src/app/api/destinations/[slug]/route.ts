import { NextResponse } from "next/server";
import { publicContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const content = await publicContent();
  const place = content.destinations.find((item) => item.slug === slug);
  if (!place) return NextResponse.json({ error: "Destination not found." }, { status: 404 });
  const tours = content.tours.filter((tour) => tour.places.includes(place.slug));
  return NextResponse.json({ ...place, tours });
}
