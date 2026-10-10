import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { publicContent } from "@/lib/store";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const content = await publicContent();
  const provinces = [...new Set(content.destinations.map((place) => place.province))];
  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="From the rock to the reef"
        text="Fourteen places we return to. Open one to see the journeys that pass through it."
        image={content.destinations[2]?.image}
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {provinces.map((province) => (
          <div key={province} className="mb-12">
            <h2 className="serif text-3xl">{province}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.destinations
                .filter((place) => place.province === province)
                .map((place) => (
                  <Link key={place.id} href={`/destinations/${place.slug}`} className="group overflow-hidden rounded-[1.6rem] bg-paper ring-1 ring-black/5">
                    <img src={place.image} alt={place.name} className="h-52 w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="p-5">
                      <h3 className="serif text-2xl">{place.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-mist">{place.summary}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
