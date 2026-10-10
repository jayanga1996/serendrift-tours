import { NextResponse } from "next/server";
import { clip, requireAdmin } from "@/lib/guard";
import { deleteBooking, patchBooking } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

const statuses: BookingStatus[] = ["new", "contacted", "confirmed", "closed"];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string; note?: string } | null;
  const patch: { status?: BookingStatus; note?: string } = {};
  if (body?.status && statuses.includes(body.status as BookingStatus)) {
    patch.status = body.status as BookingStatus;
  }
  if (typeof body?.note === "string") patch.note = clip(body.note, 2000);

  const updated = await patchBooking(id, patch);
  if (!updated) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await context.params;
  const removed = await deleteBooking(id);
  if (!removed) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
