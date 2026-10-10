import Link from "next/link";
import { money } from "@/lib/format";
import { readContent } from "@/lib/store";

export default function AdminToursPage() {
  const tours = readContent().tours;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="serif text-4xl">Tours</h1>
          <p className="mt-2 text-mist">Edit the story, price, photos, and day-by-day plan.</p>
        </div>
        <Link href="/admin/tours/new" className="btn btn-lagoon">
          New tour
        </Link>
      </div>
      <div className="mt-8 grid gap-3">
        {tours.map((tour) => (
          <Link key={tour.id} href={`/admin/tours/${tour.id}`} className="grid gap-3 rounded-3xl bg-paper p-3 ring-1 ring-black/5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
            <img src={tour.image} alt="" className="h-24 w-full rounded-2xl object-cover sm:w-28" />
            <div>
              <p className="font-semibold">{tour.title}</p>
              <p className="text-sm text-mist">
                {tour.type === "day" ? "Day tour" : `${tour.days} days`} · {money(tour.priceFrom)} · {tour.active ? "Visible" : "Hidden"}
              </p>
            </div>
            <span className="text-sm font-semibold text-lagoon">Edit</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
