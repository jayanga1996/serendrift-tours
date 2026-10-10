import Link from "next/link";
import type { SiteContent } from "@/lib/types";

export function Footer({ content }: { content: SiteContent }) {
  const { brand } = content;
  return (
    <footer className="bg-deep text-foam">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="serif text-3xl">{brand.name}</p>
          <p className="mt-3 text-sm leading-6 text-foam/75">{brand.tagline}</p>
          <p className="mt-4 text-sm leading-6 text-foam/75">
            {brand.address}
            <br />
            {brand.phone}
            <br />
            {brand.email}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Explore</p>
          <div className="mt-4 grid gap-2 text-sm text-foam/80">
            <Link href="/tours">All tours</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/stays">Stays</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Journeys</p>
          <div className="mt-4 grid gap-2 text-sm text-foam/80">
            {content.tours
              .filter((tour) => tour.type === "multi")
              .slice(0, 6)
              .map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`}>
                  {tour.title}
                </Link>
              ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Places</p>
          <div className="mt-4 grid gap-2 text-sm text-foam/80">
            {content.destinations
              .filter((place) => place.featured)
              .map((place) => (
                <Link key={place.id} href={`/destinations/${place.slug}`}>
                  {place.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-5 py-5 text-center text-xs text-foam/60 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} {brand.name}. Private journeys across Sri Lanka.</p>
        <Link href="/admin">Planner desk</Link>
      </div>
    </footer>
  );
}
