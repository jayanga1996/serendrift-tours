import { NextResponse } from "next/server";
import { publicContent } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const content = await publicContent();
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const place = url.searchParams.get("place");
  let tours = content.tours;
  if (type === "day" || type === "multi") tours = tours.filter((tour) => tour.type === type);
  if (place) tours = tours.filter((tour) => tour.places.includes(place));
  return NextResponse.json(tours);
}
