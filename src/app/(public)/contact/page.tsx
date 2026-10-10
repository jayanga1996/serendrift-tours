import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero } from "@/components/site/PageHero";
import { publicContent } from "@/lib/store";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const content = await publicContent();
  const { brand } = content;
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Register the journey you want"
        text="Send the dates, the people, and the feeling you are chasing. We reply with a route you can change."
        image={content.heroSlides[2]?.image}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[1.8rem] bg-deep p-7 text-foam">
          <p className="serif text-3xl">{brand.name}</p>
          <dl className="mt-6 grid gap-4 text-sm leading-6 text-foam/80">
            <div>
              <dt className="text-gold">Visit</dt>
              <dd>{brand.address}</dd>
            </div>
            <div>
              <dt className="text-gold">Call</dt>
              <dd>{brand.phone}</dd>
            </div>
            <div>
              <dt className="text-gold">Email</dt>
              <dd>{brand.email}</dd>
            </div>
            <div>
              <dt className="text-gold">Hours</dt>
              <dd>{brand.hours}</dd>
            </div>
          </dl>
        </aside>
        <div id="register" className="rounded-[1.8rem] bg-paper p-6 ring-1 ring-black/5 sm:p-8">
          <h2 className="serif text-3xl">Guest registration</h2>
          <p className="mt-2 text-sm text-mist">This form is the one your planners see in the admin desk.</p>
          <div className="mt-6">
            <EnquiryForm tours={content.tours} />
          </div>
        </div>
      </section>
    </>
  );
}
