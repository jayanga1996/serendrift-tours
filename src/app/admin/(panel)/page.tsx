import Link from "next/link";
import { readBookings, readContent } from "@/lib/store";

export default async function AdminHome() {
  const content = await readContent();
  const bookings = await readBookings();
  const fresh = bookings.filter((booking) => booking.status === "new");
  const cards = [
    [String(fresh.length), "New guest requests", "/admin/bookings"],
    [String(content.tours.length), "Tours", "/admin/tours"],
    [String(content.destinations.length), "Destinations", "/admin/destinations"],
    [String(content.stays.length), "Stays", "/admin/stays"],
  ];

  return (
    <div>
      <h1 className="serif text-4xl">Good day</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Change any tour, photo, or page text here. Guest registrations from the website arrive in the request list.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([value, label, href]) => (
          <Link key={label} href={href} className="rounded-[1.4rem] bg-paper p-5 ring-1 ring-black/5">
            <p className="serif text-4xl text-lagoon">{value}</p>
            <p className="mt-1 text-sm text-mist">{label}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="serif text-2xl">Latest requests</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-lagoon">
            Open all
          </Link>
        </div>
        <div className="mt-4 grid gap-3">
          {bookings.slice(0, 5).map((booking) => (
            <Link key={booking.id} href="/admin/bookings" className="rounded-2xl bg-paper px-4 py-4 ring-1 ring-black/5">
              <p className="font-semibold">{booking.name}</p>
              <p className="text-sm text-mist">
                {booking.tourTitle} · {booking.guests} travellers · {booking.status}
              </p>
            </Link>
          ))}
          {bookings.length === 0 ? <p className="text-mist">No guest requests yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
