import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { publicContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const content = await publicContent();
  return (
    <>
      <Header
        brand={content.brand}
        tours={content.tours.map((tour) => ({ slug: tour.slug, title: tour.title, type: tour.type }))}
        destinations={content.destinations.map((place) => ({
          slug: place.slug,
          name: place.name,
          province: place.province,
        }))}
      />
      <main className="flex-1">{children}</main>
      <Footer content={content} />
      <WhatsAppButton phone={content.brand.whatsapp || content.brand.phone} />
    </>
  );
}
