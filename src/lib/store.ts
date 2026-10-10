import { insertBooking, listBookings, removeBooking, updateBooking } from "./db/bookings";
import { readSiteContent, saveSiteContent } from "./db/content";
import { ensureDatabase } from "./db/ensure";
import type { Booking, BookingStatus, SiteContent } from "./types";

export async function readContent(): Promise<SiteContent> {
  await ensureDatabase();
  return readSiteContent();
}

export async function writeContent(content: SiteContent) {
  await ensureDatabase();
  await saveSiteContent(content);
  return content;
}

export async function publicContent() {
  const content = await readContent();
  return {
    ...content,
    tours: content.tours.filter((tour) => tour.active),
  };
}

export async function readBookings() {
  await ensureDatabase();
  return listBookings();
}

export async function createBooking(booking: Booking) {
  await ensureDatabase();
  await insertBooking(booking);
}

export async function patchBooking(id: string, patch: { status?: BookingStatus; note?: string }) {
  await ensureDatabase();
  return updateBooking(id, patch);
}

export async function deleteBooking(id: string) {
  await ensureDatabase();
  return removeBooking(id);
}
