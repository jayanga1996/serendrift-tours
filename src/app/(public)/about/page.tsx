import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { publicContent } from "@/lib/store";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const content = publicContent();
  return (
    <>
      <PageHero
        eyebrow="About"
        title={content.brand.name}
        text={content.about.lead}
        image={content.about.image}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="serif text-4xl">{content.about.heading}</h2>
          <p className="mt-5 text-lg leading-8 text-mist">{content.about.body}</p>
          <Link href="/contact#register" className="btn btn-lagoon mt-8">
            Plan with us
          </Link>
        </div>
        <img src={content.about.image} alt="" className="h-full min-h-80 w-full rounded-[2rem] object-cover" />
      </section>
      <section className="bg-paper py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:px-8 md:grid-cols-2">
          {content.reasons.map((reason) => (
            <article key={reason.id} className="rounded-[1.6rem] bg-foam p-6">
              <h3 className="serif text-2xl">{reason.title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{reason.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
