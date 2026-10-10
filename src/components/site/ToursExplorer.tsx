"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TourCard } from "./TourCard";
import type { Destination, Tour } from "@/lib/types";

export function ToursExplorer({
  tours,
  destinations,
  initialType = "all",
  initialPlace = "",
}: {
  tours: Tour[];
  destinations: Destination[];
  initialType?: string;
  initialPlace?: string;
}) {
  const router = useRouter();
  const [type, setType] = useState(initialType);
  const [place, setPlace] = useState(initialPlace);

  const visible = useMemo(
    () =>
      tours.filter((tour) => {
        const typeOk = type === "all" || tour.type === type;
        const placeOk = !place || tour.places.includes(place);
        return typeOk && placeOk;
      }),
    [tours, type, place],
  );

  function update(nextType: string, nextPlace: string) {
    setType(nextType);
    setPlace(nextPlace);
    const params = new URLSearchParams();
    if (nextType !== "all") params.set("type", nextType);
    if (nextPlace) params.set("place", nextPlace);
    const query = params.toString();
    router.replace(query ? `/tours?${query}` : "/tours", { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-[1.6rem] bg-paper p-3 shadow-sm ring-1 ring-black/5 sm:flex-row">
        <select className="field" value={type} onChange={(event) => update(event.target.value, place)}>
          <option value="all">All journeys</option>
          <option value="day">Signature day tours</option>
          <option value="multi">Multi-day journeys</option>
        </select>
        <select className="field" value={place} onChange={(event) => update(type, event.target.value)}>
          <option value="">Every destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.slug}>
              {destination.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-8 text-mist">No journeys match that combination yet. Try another place, or register and we will shape one.</p>
      ) : null}
    </div>
  );
}
