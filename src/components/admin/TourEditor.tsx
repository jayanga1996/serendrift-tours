"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/format";
import type { SiteContent, Tour } from "@/lib/types";
import { Field, ImageField, SaveBar, saveContent } from "./fields";

const empty = (id: string): Tour => ({
  id,
  slug: "",
  title: "",
  type: "day",
  days: 1,
  priceFrom: 80,
  places: [],
  location: "",
  summary: "",
  description: "",
  image: "",
  gallery: [],
  highlights: [""],
  itinerary: [{ title: "", detail: "" }],
  includes: [""],
  featured: false,
  popular: false,
  active: true,
});

export function TourEditor({ content, tourId }: { content: SiteContent; tourId: string }) {
  const router = useRouter();
  const existing = content.tours.find((tour) => tour.id === tourId);
  const [tour, setTour] = useState<Tour>(existing || empty(""));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function patch(partial: Partial<Tour>) {
    setTour((current) => ({ ...current, ...partial }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const next: Tour = {
        ...tour,
        id: tour.id || crypto.randomUUID(),
        slug: slugify(tour.slug || tour.title),
        highlights: tour.highlights.map((item) => item.trim()).filter(Boolean),
        includes: tour.includes.map((item) => item.trim()).filter(Boolean),
        gallery: tour.gallery.map((item) => item.trim()).filter(Boolean),
        itinerary: tour.itinerary.filter((stop) => stop.title.trim() || stop.detail.trim()),
        days: Number(tour.days) || 1,
        priceFrom: Number(tour.priceFrom) || 0,
      };
      if (!next.title || !next.slug) throw new Error("Add a title.");
      if (content.tours.some((item) => item.slug === next.slug && item.id !== next.id)) {
        throw new Error("Another tour already uses that link name.");
      }
      const tours = existing
        ? content.tours.map((item) => (item.id === next.id ? next : item))
        : [...content.tours, next];
      await saveContent({ ...content, tours });
      router.push("/admin/tours");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!existing || !confirm("Remove this tour from the website?")) return;
    setSaving(true);
    await saveContent({ ...content, tours: content.tours.filter((item) => item.id !== existing.id) });
    router.push("/admin/tours");
    router.refresh();
  }

  return (
    <div className="grid max-w-3xl gap-5">
      <h1 className="serif text-4xl">{existing ? "Edit tour" : "New tour"}</h1>
      <Field
        label="Title"
        value={tour.title}
        onChange={(title) =>
          patch({
            title,
            slug: !tour.slug || tour.slug === slugify(tour.title) ? slugify(title) : tour.slug,
          })
        }
      />
      <Field label="Link name" value={tour.slug} onChange={(slug) => patch({ slug })} />
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium">
          Type
          <select className="field" value={tour.type} onChange={(event) => patch({ type: event.target.value as Tour["type"] })}>
            <option value="day">Day tour</option>
            <option value="multi">Multi-day</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Days
          <input className="field" type="number" min={1} value={tour.days} onChange={(event) => patch({ days: Number(event.target.value) })} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Price from (USD)
          <input className="field" type="number" min={0} value={tour.priceFrom} onChange={(event) => patch({ priceFrom: Number(event.target.value) })} />
        </label>
      </div>
      <Field label="Location label" value={tour.location} onChange={(location) => patch({ location })} />
      <Field label="Short summary" value={tour.summary} onChange={(summary) => patch({ summary })} textarea />
      <Field label="Full description" value={tour.description} onChange={(description) => patch({ description })} textarea />
      <ImageField label="Main photo" value={tour.image} onChange={(image) => patch({ image })} />
      <div className="grid gap-3">
        <p className="text-sm font-medium">Gallery</p>
        {tour.gallery.map((image, index) => (
          <ImageField
            key={`gallery-${index}`}
            label={`Photo ${index + 1}`}
            value={image}
            onChange={(value) => patch({ gallery: tour.gallery.map((item, itemIndex) => (itemIndex === index ? value : item)) })}
          />
        ))}
        <button className="btn btn-ghost" type="button" onClick={() => patch({ gallery: [...tour.gallery, ""] })}>
          Add gallery photo
        </button>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Places on this tour
        <div className="grid gap-2 rounded-2xl border border-sand bg-white p-3 sm:grid-cols-2">
          {content.destinations.map((place) => (
            <label key={place.id} className="flex items-center gap-2 font-normal">
              <input
                type="checkbox"
                checked={tour.places.includes(place.slug)}
                onChange={(event) =>
                  patch({
                    places: event.target.checked
                      ? [...tour.places, place.slug]
                      : tour.places.filter((slug) => slug !== place.slug),
                  })
                }
              />
              {place.name}
            </label>
          ))}
        </div>
      </label>
      <Field
        label="Highlights, one per line"
        value={tour.highlights.join("\n")}
        textarea
        onChange={(value) => patch({ highlights: value.split("\n") })}
      />
      <Field
        label="Included, one per line"
        value={tour.includes.join("\n")}
        textarea
        onChange={(value) => patch({ includes: value.split("\n") })}
      />
      <div className="grid gap-3">
        <p className="text-sm font-medium">Itinerary</p>
        {tour.itinerary.map((stop, index) => (
          <div key={`stop-${index}`} className="grid gap-3 rounded-2xl bg-paper p-4 ring-1 ring-black/5">
            <Field
              label={`Stop ${index + 1} title`}
              value={stop.title}
              onChange={(title) =>
                patch({ itinerary: tour.itinerary.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)) })
              }
            />
            <Field
              label="Detail"
              value={stop.detail}
              textarea
              onChange={(detail) =>
                patch({ itinerary: tour.itinerary.map((item, itemIndex) => (itemIndex === index ? { ...item, detail } : item)) })
              }
            />
          </div>
        ))}
        <button className="btn btn-ghost" type="button" onClick={() => patch({ itinerary: [...tour.itinerary, { title: "", detail: "" }] })}>
          Add a stop
        </button>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={tour.active} onChange={(event) => patch({ active: event.target.checked })} />
          Visible on the website
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={tour.featured} onChange={(event) => patch({ featured: event.target.checked })} />
          Featured experience
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={tour.popular} onChange={(event) => patch({ popular: event.target.checked })} />
          Popular journey
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <SaveBar saving={saving} message={message} onSave={save} />
        {existing ? (
          <button className="btn btn-ghost" type="button" onClick={remove}>
            Delete tour
          </button>
        ) : null}
      </div>
    </div>
  );
}
