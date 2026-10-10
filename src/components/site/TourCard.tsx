import Link from "next/link";
import { money } from "@/lib/format";
import type { Tour } from "@/lib/types";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-paper shadow-[0_20px_50px_-36px_rgba(20,34,38,0.8)] ring-1 ring-black/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-lagoon">
          {tour.type === "day" ? "Day tour" : `${tour.days} days`}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-mist">{tour.location}</p>
        <h3 className="serif mt-2 text-2xl leading-tight">{tour.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-mist">{tour.summary}</p>
        <div className="mt-5 flex items-end justify-between">
          <p>
            <span className="text-xs uppercase tracking-wider text-mist">From</span>
            <span className="mt-1 block text-lg font-semibold">{money(tour.priceFrom)}</span>
          </p>
          <span className="text-sm font-semibold text-lagoon">View journey</span>
        </div>
      </div>
    </Link>
  );
}
