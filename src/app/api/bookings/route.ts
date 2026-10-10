import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { clip, requireAdmin } from "@/lib/guard";
import { createBooking, readBookings, readContent } from "@/lib/store";
import type { Booking } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  return NextResponse.json(await readBookings());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "The form could not be read." }, { status: 400 });
  if (clip(body.company, 80)) return NextResponse.json({ ok: true });

  const name = clip(body.name, 80);
  const email = clip(body.email, 120);
  const phone = clip(body.phone, 40);
  const country = clip(body.country, 80);
  const tourSlug = clip(body.tourSlug, 80);
  const travelDate = clip(body.travelDate, 20);
  const message = clip(body.message, 2000);
  const guests = Math.min(30, Math.max(1, Number(body.guests) || 1));

  if (name.length < 2 || !email.includes("@") || phone.length < 6) {
    return NextResponse.json(
      { error: "Add your name, a real email, and a phone number." },
      { status: 400 },
    );
  }

  const tour = (await readContent()).tours.find((item) => item.slug === tourSlug);
  const booking: Booking = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    country,
    tourSlug,
    tourTitle: tour?.title || "Not chosen yet",
    travelDate,
    guests,
    message,
    status: "new",
    note: "",
  };

  await createBooking(booking);
  return NextResponse.json({ ok: true });
}
