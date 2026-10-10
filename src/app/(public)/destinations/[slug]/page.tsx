import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { TourCard } from "@/components/site/TourCard";
import { publicContent } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = (await publicContent()).destinations.find((item) => item.slug === slug);
  return { title: place?.name || "Destination" };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await publicContent();
  const place = content.destinations.find((item) => item.slug === slug);
  if (!place) notFound();
  const tours = content.tours.filter((tour) => tour.places.includes(place.slug));

  return (
    <>
      <PageHero eyebrow={place.province} title={place.name} text={place.summary} image={place.image} />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <h2 className="serif text-4xl">Journeys through {place.name}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        {tours.length === 0 ? (
          <p className="mt-6 text-mist">No published journey lists this place yet. Register and we will build one around it.</p>
        ) : null}
      </section>
    </>
  );
}
