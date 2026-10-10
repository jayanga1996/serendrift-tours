"use client";

import { useState } from "react";
import type { Tour } from "@/lib/types";

export function EnquiryForm({
  tours,
  selectedSlug = "",
  compact = false,
}: {
  tours: Pick<Tour, "slug" | "title">[];
  selectedSlug?: string;
  compact?: boolean;
}) {
  const [tourSlug, setTourSlug] = useState(selectedSlug);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        country: form.get("country"),
        tourSlug,
        travelDate: form.get("travelDate"),
        guests: form.get("guests"),
        message: form.get("message"),
        company: form.get("company"),
      }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }
    formElement.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-[1.6rem] bg-lagoon px-6 py-10 text-foam">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Request received</p>
        <h3 className="serif mt-3 text-3xl">We have your journey notes</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-foam/80">
          A planner will write back with a route, a vehicle, and the next question we need from you.
        </p>
        <button className="btn btn-gold mt-6" type="button" onClick={() => setStatus("idle")}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input className="hidden" name="company" tabIndex={-1} autoComplete="off" />
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <label className="grid gap-2 text-sm font-medium">
          Full name
          <input className="field" name="name" required placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className="field" name="email" type="email" required placeholder="you@email.com" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Phone or WhatsApp
          <input className="field" name="phone" required placeholder="+94…" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Country
          <input className="field" name="country" placeholder="Where you live" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Journey
          <select className="field" value={tourSlug} onChange={(event) => setTourSlug(event.target.value)}>
            <option value="">Help me choose</option>
            {tours.map((tour) => (
              <option key={tour.slug} value={tour.slug}>
                {tour.title}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Arrival
            <input className="field" name="travelDate" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Travellers
            <input className="field" name="guests" type="number" min={1} max={30} defaultValue={2} />
          </label>
        </div>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        What kind of journey do you want?
        <textarea
          className="field min-h-32 resize-y"
          name="message"
          placeholder="Dates, pace, wildlife, temples, beaches, celebrations…"
        />
      </label>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <button className="btn btn-lagoon w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Register my journey"}
      </button>
    </form>
  );
}
