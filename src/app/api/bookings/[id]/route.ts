import { NextResponse } from "next/server";
import { clip, requireAdmin } from "@/lib/guard";
import { readBookings, writeBookings } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const statuses: BookingStatus[] = ["new", "contacted", "confirmed", "closed"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string; note?: string } | null;
  const bookings = readBookings();
  const booking = bookings.find((item) => item.id === id);
  if (!booking) return NextResponse.json({ error: "Request not found." }, { status: 404 });

  if (body?.status && statuses.includes(body.status as BookingStatus)) {
    booking.status = body.status as BookingStatus;
  }
  if (typeof body?.note === "string") booking.note = clip(body.note, 2000);
  writeBookings(bookings);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await context.params;
  writeBookings(readBookings().filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
