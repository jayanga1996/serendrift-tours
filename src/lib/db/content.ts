import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import type {
  Deal,
  Destination,
  ItineraryStop,
  Reason,
  SiteContent,
  Slide,
  Stat,
  Stay,
  Testimonial,
  Tour,
} from "../types";
import { asFlag, asJson, asText } from "./json";
import { getPool } from "./pool";

type ProfileRow = RowDataPacket & {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  about_heading: string;
  about_lead: string;
  about_body: string;
  about_image: string;
  ticker: unknown;
};

type SlideRow = RowDataPacket & Slide;
type DealRow = RowDataPacket & Deal;
type DestinationRow = RowDataPacket & { featured: number } & Omit<Destination, "featured">;
type StayRow = RowDataPacket & { amenities: unknown } & Omit<Stay, "amenities">;
type TestimonialRow = RowDataPacket & { guest_from: string } & Omit<Testimonial, "from">;
type StatRow = RowDataPacket & Stat;
type ReasonRow = RowDataPacket & Reason;
type TourRow = RowDataPacket & {
  price_from: number | string;
  places: unknown;
  gallery: unknown;
  highlights: unknown;
  itinerary: unknown;
  includes: unknown;
  featured: number;
  popular: number;
  active: number;
} & Omit<Tour, "priceFrom" | "places" | "gallery" | "highlights" | "itinerary" | "includes" | "featured" | "popular" | "active">;

async function replaceRows(connection: PoolConnection, table: string, columns: string[], rows: unknown[][]) {
  await connection.query(`DELETE FROM \`${table}\``);
  if (rows.length === 0) return;
  const rowPlaceholder = `(${columns.map(() => "?").join(", ")})`;
  const sql = `INSERT INTO \`${table}\` (${columns.map((column) => `\`${column}\``).join(", ")}) VALUES ${rows
    .map(() => rowPlaceholder)
    .join(", ")}`;
  await connection.query<ResultSetHeader>(sql, rows.flat());
}

export async function readSiteContent(): Promise<SiteContent> {
  const pool = getPool();
  const [profiles] = await pool.query<ProfileRow[]>("SELECT * FROM site_profile WHERE id = 1 LIMIT 1");
  const profile = profiles[0];
  if (!profile) throw new Error("The Serendrift database has no website profile yet. Run npm run db:setup.");

  const [slides] = await pool.query<SlideRow[]>("SELECT * FROM hero_slides ORDER BY sort_order ASC");
  const [deals] = await pool.query<DealRow[]>("SELECT * FROM deals ORDER BY sort_order ASC");
  const [destinations] = await pool.query<DestinationRow[]>("SELECT * FROM destinations ORDER BY sort_order ASC");
  const [stays] = await pool.query<StayRow[]>("SELECT * FROM stays ORDER BY sort_order ASC");
  const [testimonials] = await pool.query<TestimonialRow[]>("SELECT * FROM testimonials ORDER BY sort_order ASC");
  const [stats] = await pool.query<StatRow[]>("SELECT * FROM stats ORDER BY sort_order ASC");
  const [reasons] = await pool.query<ReasonRow[]>("SELECT * FROM reasons ORDER BY sort_order ASC");
  const [tours] = await pool.query<TourRow[]>("SELECT * FROM tours ORDER BY sort_order ASC");

  return {
    brand: {
      name: profile.name,
      tagline: profile.tagline,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      hours: profile.hours,
      whatsapp: profile.whatsapp,
      instagram: profile.instagram,
      facebook: profile.facebook,
    },
    ticker: asJson<string[]>(profile.ticker, []),
    about: {
      heading: profile.about_heading,
      lead: profile.about_lead,
      body: profile.about_body,
      image: profile.about_image,
    },
    heroSlides: slides.map((row) => ({
      id: row.id,
      eyebrow: row.eyebrow,
      title: row.title,
      text: row.text,
      image: row.image,
      cta: row.cta,
      href: row.href,
    })),
    deals: deals.map((row) => ({
      id: row.id,
      kicker: row.kicker,
      title: row.title,
      image: row.image,
      href: row.href,
    })),
    destinations: destinations.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      province: row.province,
      summary: row.summary,
      image: row.image,
      featured: asFlag(row.featured),
    })),
    stays: stays.map((row) => ({
      id: row.id,
      name: row.name,
      area: row.area,
      style: row.style,
      summary: row.summary,
      image: row.image,
      amenities: asJson<string[]>(row.amenities, []),
    })),
    testimonials: testimonials.map((row) => ({
      id: row.id,
      name: row.name,
      from: row.guest_from,
      title: row.title,
      quote: row.quote,
    })),
    stats: stats.map((row) => ({ id: row.id, value: row.value, label: row.label })),
    reasons: reasons.map((row) => ({ id: row.id, title: row.title, text: row.text })),
    tours: tours.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      type: row.type === "multi" ? "multi" : "day",
      days: Number(row.days) || 1,
      priceFrom: Number(row.price_from) || 0,
      places: asJson<string[]>(row.places, []),
      location: asText(row.location),
      summary: asText(row.summary),
      description: asText(row.description),
      image: asText(row.image),
      gallery: asJson<string[]>(row.gallery, []),
      highlights: asJson<string[]>(row.highlights, []),
      itinerary: asJson<ItineraryStop[]>(row.itinerary, []),
      includes: asJson<string[]>(row.includes, []),
      featured: asFlag(row.featured),
      popular: asFlag(row.popular),
      active: asFlag(row.active),
    })),
  };
}

export async function saveSiteContent(content: SiteContent) {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO site_profile (
        id, name, tagline, phone, email, address, hours, whatsapp, instagram, facebook,
        about_heading, about_lead, about_body, about_image, ticker
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        tagline = VALUES(tagline),
        phone = VALUES(phone),
        email = VALUES(email),
        address = VALUES(address),
        hours = VALUES(hours),
        whatsapp = VALUES(whatsapp),
        instagram = VALUES(instagram),
        facebook = VALUES(facebook),
        about_heading = VALUES(about_heading),
        about_lead = VALUES(about_lead),
        about_body = VALUES(about_body),
        about_image = VALUES(about_image),
        ticker = VALUES(ticker)`,
      [
        content.brand.name,
        content.brand.tagline,
        content.brand.phone,
        content.brand.email,
        content.brand.address,
        content.brand.hours,
        content.brand.whatsapp,
        content.brand.instagram,
        content.brand.facebook,
        content.about.heading,
        content.about.lead,
        content.about.body,
        content.about.image,
        JSON.stringify(content.ticker),
      ],
    );

    await replaceRows(
      connection,
      "hero_slides",
      ["id", "sort_order", "eyebrow", "title", "text", "image", "cta", "href"],
      content.heroSlides.map((slide, index) => [
        slide.id,
        index,
        slide.eyebrow,
        slide.title,
        slide.text,
        slide.image,
        slide.cta,
        slide.href,
      ]),
    );
    await replaceRows(
      connection,
      "deals",
      ["id", "sort_order", "kicker", "title", "image", "href"],
      content.deals.map((deal, index) => [deal.id, index, deal.kicker, deal.title, deal.image, deal.href]),
    );
    await replaceRows(
      connection,
      "destinations",
      ["id", "sort_order", "slug", "name", "province", "summary", "image", "featured"],
      content.destinations.map((place, index) => [
        place.id,
        index,
        place.slug,
        place.name,
        place.province,
        place.summary,
        place.image,
        place.featured ? 1 : 0,
      ]),
    );
    await replaceRows(
      connection,
      "stays",
      ["id", "sort_order", "name", "area", "style", "summary", "image", "amenities"],
      content.stays.map((stay, index) => [
        stay.id,
        index,
        stay.name,
        stay.area,
        stay.style,
        stay.summary,
        stay.image,
        JSON.stringify(stay.amenities),
      ]),
    );
    await replaceRows(
      connection,
      "testimonials",
      ["id", "sort_order", "name", "guest_from", "title", "quote"],
      content.testimonials.map((item, index) => [item.id, index, item.name, item.from, item.title, item.quote]),
    );
    await replaceRows(
      connection,
      "stats",
      ["id", "sort_order", "value", "label"],
      content.stats.map((item, index) => [item.id, index, item.value, item.label]),
    );
    await replaceRows(
      connection,
      "reasons",
      ["id", "sort_order", "title", "text"],
      content.reasons.map((item, index) => [item.id, index, item.title, item.text]),
    );
    await replaceRows(
      connection,
      "tours",
      [
        "id",
        "sort_order",
        "slug",
        "title",
        "type",
        "days",
        "price_from",
        "places",
        "location",
        "summary",
        "description",
        "image",
        "gallery",
        "highlights",
        "itinerary",
        "includes",
        "featured",
        "popular",
        "active",
      ],
      content.tours.map((tour, index) => [
        tour.id,
        index,
        tour.slug,
        tour.title,
        tour.type,
        tour.days,
        tour.priceFrom,
        JSON.stringify(tour.places),
        tour.location,
        tour.summary,
        tour.description,
        tour.image,
        JSON.stringify(tour.gallery),
        JSON.stringify(tour.highlights),
        JSON.stringify(tour.itinerary),
        JSON.stringify(tour.includes),
        tour.featured ? 1 : 0,
        tour.popular ? 1 : 0,
        tour.active ? 1 : 0,
      ]),
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
