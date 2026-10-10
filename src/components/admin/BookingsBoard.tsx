"use client";

import { useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types";

const labels: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  closed: "Closed",
};

export function BookingsBoard({ initial }: { initial: Booking[] }) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      bookings.filter((booking) => {
        const statusOk = filter === "all" || booking.status === filter;
        const haystack = `${booking.name} ${booking.email} ${booking.tourTitle} ${booking.country}`.toLowerCase();
        return statusOk && haystack.includes(query.toLowerCase());
      }),
    [bookings, filter, query],
  );

  async function update(id: string, patch: Partial<Pick<Booking, "status" | "note">>) {
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, ...patch } : booking)));
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this guest request?")) return;
    setBookings((current) => current.filter((booking) => booking.id !== id));
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <h1 className="serif text-4xl">Guest requests</h1>
      <p className="mt-2 text-mist">Everyone who registers a journey from the website appears here.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input className="field" placeholder="Search name, email, or tour" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="field sm:max-w-48" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="all">All statuses</option>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 grid gap-4">
        {visible.map((booking) => (
          <article key={booking.id} className="rounded-[1.4rem] bg-paper p-5 ring-1 ring-black/5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{booking.name}</h2>
                <p className="text-sm text-mist">
                  {booking.email} · {booking.phone} · {booking.country || "Country not given"}
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-mist">
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-mist">Journey</dt>
                <dd>{booking.tourTitle}</dd>
              </div>
              <div>
                <dt className="text-mist">Arrival</dt>
                <dd>{booking.travelDate || "Flexible"}</dd>
              </div>
              <div>
                <dt className="text-mist">Travellers</dt>
                <dd>{booking.guests}</dd>
              </div>
            </dl>
            {booking.message ? <p className="mt-4 text-sm leading-6">{booking.message}</p> : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr_auto]">
              <select
                className="field"
                value={booking.status}
                onChange={(event) => update(booking.id, { status: event.target.value as BookingStatus })}
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                className="field"
                defaultValue={booking.note}
                placeholder="Private note for the desk"
                onBlur={(event) => {
                  if (event.target.value !== booking.note) update(booking.id, { note: event.target.value });
                }}
              />
              <button className="btn btn-ghost" type="button" onClick={() => remove(booking.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 ? <p className="text-mist">No requests match.</p> : null}
      </div>
    </div>
  );
}
