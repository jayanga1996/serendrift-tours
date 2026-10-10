import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { publicContent } from "@/lib/store";

export const metadata: Metadata = { title: "Stays" };

export default function StaysPage() {
  const content = publicContent();
  return (
    <>
      <PageHero
        eyebrow="Stays"
        title="Houses, lodges, and camps we trust"
        text="We place you where the next morning starts easily: near the rock, the lake, the tea, or the park gate."
        image={content.stays[2]?.image}
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-2">
        {content.stays.map((stay) => (
          <article key={stay.id} className="overflow-hidden rounded-[1.8rem] bg-paper ring-1 ring-black/5">
            <img src={stay.image} alt={stay.name} className="h-64 w-full object-cover" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">
                {stay.area} · {stay.style}
              </p>
              <h2 className="serif mt-2 text-3xl">{stay.name}</h2>
              <p className="mt-3 text-sm leading-6 text-mist">{stay.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stay.amenities.map((item) => (
                  <span key={item} className="rounded-full bg-foam px-3 py-1 text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Link href="/contact#register" className="btn btn-lagoon">
          Ask us to place your nights
        </Link>
      </section>
    </>
  );
}
