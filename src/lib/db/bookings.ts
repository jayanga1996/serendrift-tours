import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Booking, BookingStatus } from "../types";
import { getPool } from "./pool";

type BookingRow = RowDataPacket & {
  id: string;
  created_at: Date | string;
  name: string;
  email: string;
  phone: string;
  country: string;
  tour_slug: string;
  tour_title: string;
  travel_date: string;
  guests: number;
  message: string;
  status: BookingStatus;
  note: string;
};

function toIso(value: Date | string) {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    createdAt: toIso(row.created_at),
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    tourSlug: row.tour_slug,
    tourTitle: row.tour_title,
    travelDate: row.travel_date,
    guests: Number(row.guests) || 1,
    message: row.message,
    status: row.status,
    note: row.note,
  };
}

export async function listBookings() {
  const [rows] = await getPool().query<BookingRow[]>(
    "SELECT * FROM bookings ORDER BY created_at DESC",
  );
  return rows.map(toBooking);
}

export async function insertBooking(booking: Booking) {
  await getPool().query(
    `INSERT INTO bookings (
      id, created_at, name, email, phone, country, tour_slug, tour_title,
      travel_date, guests, message, status, note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.id,
      new Date(booking.createdAt),
      booking.name,
      booking.email,
      booking.phone,
      booking.country,
      booking.tourSlug,
      booking.tourTitle,
      booking.travelDate,
      booking.guests,
      booking.message,
      booking.status,
      booking.note,
    ],
  );
}

export async function updateBooking(id: string, patch: { status?: BookingStatus; note?: string }) {
  const fields: string[] = [];
  const values: Array<string | BookingStatus> = [];
  if (patch.status) {
    fields.push("status = ?");
    values.push(patch.status);
  }
  if (typeof patch.note === "string") {
    fields.push("note = ?");
    values.push(patch.note);
  }
  if (fields.length === 0) return true;
  values.push(id);
  const [result] = await getPool().query<ResultSetHeader>(
    `UPDATE bookings SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows > 0;
}

export async function removeBooking(id: string) {
  const [result] = await getPool().query<ResultSetHeader>("DELETE FROM bookings WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
