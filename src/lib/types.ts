export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  cta: string;
  href: string;
};

export type Deal = {
  id: string;
  kicker: string;
  title: string;
  image: string;
  href: string;
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  province: string;
  summary: string;
  image: string;
  featured: boolean;
};

export type Stay = {
  id: string;
  name: string;
  area: string;
  style: string;
  summary: string;
  image: string;
  amenities: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  from: string;
  title: string;
  quote: string;
};

export type ItineraryStop = {
  title: string;
  detail: string;
};

export type Tour = {
  id: string;
  slug: string;
  title: string;
  type: "day" | "multi";
  days: number;
  priceFrom: number;
  places: string[];
  location: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryStop[];
  includes: string[];
  featured: boolean;
  popular: boolean;
  active: boolean;
};

export type Stat = {
  id: string;
  value: string;
  label: string;
};

export type Reason = {
  id: string;
  title: string;
  text: string;
};

export type Brand = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
};

export type SiteContent = {
  brand: Brand;
  heroSlides: Slide[];
  ticker: string[];
  deals: Deal[];
  destinations: Destination[];
  stays: Stay[];
  testimonials: Testimonial[];
  stats: Stat[];
  reasons: Reason[];
  about: {
    heading: string;
    lead: string;
    body: string;
    image: string;
  };
  tours: Tour[];
};

export type BookingStatus = "new" | "contacted" | "confirmed" | "closed";

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  guests: number;
  message: string;
  status: BookingStatus;
  note: string;
};
