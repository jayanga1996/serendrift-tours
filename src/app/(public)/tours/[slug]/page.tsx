import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { money } from "@/lib/format";
import { publicContent } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = publicContent().tours.find((item) => item.slug === slug);
  return { title: tour?.title || "Tour" };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = publicContent();
  const tour = content.tours.find((item) => item.slug === slug);
  if (!tour) notFound();
  const places = content.destinations.filter((place) => tour.places.includes(place.slug));

  return (
    <article>
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-deep text-foam">
        <img src={tour.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/50 to-deep/20" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-40 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {tour.type === "day" ? "Signature day" : `${tour.days} days`} · {tour.location}
          </p>
          <h1 className="serif mt-3 max-w-3xl text-5xl leading-none sm:text-6xl">{tour.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-foam/85">{tour.summary}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-lg leading-8">{tour.description}</p>
          <h2 className="serif mt-10 text-3xl">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tour.highlights.map((item) => (
              <li key={item} className="rounded-2xl bg-paper px-4 py-3 text-sm ring-1 ring-black/5">
                {item}
              </li>
            ))}
          </ul>
          <h2 className="serif mt-10 text-3xl">{tour.type === "day" ? "The day" : "The route"}</h2>
          <ol className="mt-4 grid gap-4">
            {tour.itinerary.map((stop, index) => (
              <li key={stop.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="serif text-2xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold">{stop.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-mist">{stop.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {tour.gallery.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {tour.gallery.map((image) => (
                <img key={image} src={image} alt="" className="h-48 w-full rounded-3xl object-cover" />
              ))}
            </div>
          ) : null}
          {places.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {places.map((place) => (
                <Link key={place.id} href={`/destinations/${place.slug}`} className="rounded-full bg-sand px-4 py-2 text-sm">
                  {place.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <aside className="h-fit rounded-[1.8rem] bg-paper p-6 shadow-sm ring-1 ring-black/5 lg:sticky lg:top-6">
          <p className="text-xs uppercase tracking-[0.18em] text-mist">From</p>
          <p className="serif text-5xl">{money(tour.priceFrom)}</p>
          <p className="text-sm text-mist">per person, private journey</p>
          <h2 className="serif mt-6 text-2xl">Included</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {tour.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-8" id="register">
            <EnquiryForm tours={content.tours} selectedSlug={tour.slug} compact />
          </div>
        </aside>
      </div>
    </article>
  );
}
