import fs from "fs";
import path from "path";
import { defaultContent } from "./seed";
import type { Booking, SiteContent } from "./types";

const dataDir = path.join(process.cwd(), "data");
const contentFile = path.join(dataDir, "content.json");
const bookingsFile = path.join(dataDir, "bookings.json");

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(dataDir, { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

function ensureContent() {
  if (!fs.existsSync(contentFile)) writeJson(contentFile, defaultContent);
}

function ensureBookings() {
  if (!fs.existsSync(bookingsFile)) writeJson(bookingsFile, []);
}

export function readContent(): SiteContent {
  ensureContent();
  const raw = fs.readFileSync(contentFile, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export function writeContent(content: SiteContent) {
  writeJson(contentFile, content);
  return content;
}

export function readBookings(): Booking[] {
  ensureBookings();
  const raw = fs.readFileSync(bookingsFile, "utf8");
  const bookings = JSON.parse(raw) as Booking[];
  return bookings.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function writeBookings(bookings: Booking[]) {
  writeJson(bookingsFile, bookings);
  return bookings;
}

export function publicContent() {
  const content = readContent();
  return {
    ...content,
    tours: content.tours.filter((tour) => tour.active),
  };
}
