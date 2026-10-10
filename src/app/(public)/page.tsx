import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Reveal } from "@/components/site/Reveal";
import { TourCard } from "@/components/site/TourCard";
import { money } from "@/lib/format";
import { publicContent } from "@/lib/store";

export default async function HomePage() {
  const content = await publicContent();
  const multi = content.tours.filter((tour) => tour.type === "multi" && tour.popular);
  const experiences = content.tours.filter((tour) => tour.featured).slice(0, 4);
  const places = content.destinations.filter((place) => place.featured).slice(0, 5);

  return (
    <>
      <Hero slides={content.heroSlides} destinations={content.destinations} />
      <Marquee items={content.ticker} />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Exclusive routes</p>
          <h2 className="serif mt-3 text-4xl sm:text-5xl">Three ways to begin</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {content.deals.map((deal, index) => (
            <Reveal key={deal.id} delay={index * 0.08}>
              <Link href={deal.href} className="group relative block min-h-80 overflow-hidden rounded-[1.8rem]">
                <img src={deal.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-foam">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold">{deal.kicker}</p>
                  <h3 className="serif mt-2 text-3xl">{deal.title}</h3>
                  <p className="mt-3 text-sm font-semibold">Explore more</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">Multi-day</p>
              <h2 className="serif mt-3 text-4xl sm:text-5xl">Popular private journeys</h2>
            </div>
            <Link href="/tours?type=multi" className="text-sm font-semibold text-lagoon">
              All multi-day tours
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {multi.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">The island</p>
            <h2 className="serif mt-3 text-4xl sm:text-5xl">Places worth slowing down for</h2>
          </div>
          <Link href="/destinations" className="text-sm font-semibold text-lagoon">
            All destinations
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {places.map((place, index) => (
            <Link
              key={place.id}
              href={`/destinations/${place.slug}`}
              className={`group relative min-h-64 overflow-hidden rounded-[1.6rem] ${index === 0 ? "sm:col-span-2 sm:row-span-2 sm:min-h-[34rem]" : ""}`}
            >
              <img src={place.image} alt={place.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" />
              <div className="absolute bottom-0 p-5 text-foam">
                <p className="text-xs uppercase tracking-[0.16em] text-gold">{place.province}</p>
                <h3 className="serif text-3xl">{place.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-deep py-20 text-foam">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Signature days</p>
          <h2 className="serif mt-3 text-4xl sm:text-5xl">Experiences to add, or to take alone</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {experiences.map((tour) => (
              <Link key={tour.id} href={`/tours/${tour.slug}`} className="group grid overflow-hidden rounded-[1.6rem] bg-white/5 sm:grid-cols-[0.9fr_1.1fr]">
                <img src={tour.image} alt="" className="h-56 w-full object-cover sm:h-full" />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">{tour.location}</p>
                  <h3 className="serif mt-2 text-3xl">{tour.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-foam/75">{tour.summary}</p>
                  <p className="mt-4 text-sm font-semibold">From {money(tour.priceFrom)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <img src={content.about.image} alt="" className="h-[28rem] w-full rounded-[2rem] object-cover" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Why travel with us</p>
          <h2 className="serif mt-3 text-4xl leading-tight sm:text-5xl">{content.about.heading}</h2>
          <p className="mt-5 text-lg leading-8 text-mist">{content.about.lead}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {content.stats.map((stat) => (
              <div key={stat.id} className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
                <p className="serif text-4xl text-lagoon">{stat.value}</p>
                <p className="mt-1 text-sm text-mist">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link href="/about" className="btn btn-lagoon mt-8">
            Our story
          </Link>
        </Reveal>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="serif text-4xl sm:text-5xl">Why book with Serendrift</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {content.reasons.map((reason) => (
              <article key={reason.id} className="rounded-[1.6rem] bg-foam p-6">
                <h3 className="serif text-2xl">{reason.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Testimonials quotes={content.testimonials} />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-lagoon px-6 py-12 text-foam sm:px-12">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Start here</p>
          <h2 className="serif mt-3 max-w-2xl text-4xl sm:text-5xl">Tell us the journey you have in mind</h2>
          <p className="mt-4 max-w-xl text-foam/80">
            Share dates, travellers, and the places that matter. Your request lands in our planner’s desk, ready to answer.
          </p>
          <Link href="/contact#register" className="btn btn-gold mt-8">
            Register your journey
          </Link>
        </div>
      </section>
    </>
  );
}

function Testimonials({
  quotes,
}: {
  quotes: { id: string; name: string; from: string; title: string; quote: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">Guest notes</p>
      <h2 className="serif mt-3 text-4xl sm:text-5xl">Stories from the road</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {quotes.map((story) => (
          <blockquote key={story.id} className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-black/5">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">{story.title}</p>
            <p className="serif mt-4 text-2xl leading-snug">“{story.quote}”</p>
            <footer className="mt-5 text-sm text-mist">
              {story.name}
              <span className="block">{story.from}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
