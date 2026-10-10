import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ToursExplorer } from "@/components/site/ToursExplorer";
import { publicContent } from "@/lib/store";

export const metadata: Metadata = { title: "Tours" };

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; place?: string }>;
}) {
  const params = await searchParams;
  const content = publicContent();
  return (
    <>
      <PageHero
        eyebrow="Tours"
        title="Private journeys, day and longer"
        text="Choose a signature day or a multi-day route. Every one can be rewritten around your dates."
        image={content.heroSlides[0]?.image}
      />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <ToursExplorer
          tours={content.tours}
          destinations={content.destinations}
          initialType={params.type === "day" || params.type === "multi" ? params.type : "all"}
          initialPlace={params.place || ""}
        />
      </section>
    </>
  );
}
