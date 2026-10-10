"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/format";
import type { Destination, SiteContent, Stay } from "@/lib/types";
import { Field, ImageField, SaveBar, saveContent } from "./fields";

export function DestinationsEditor({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [items, setItems] = useState(content.destinations);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function patch(index: number, partial: Partial<Destination>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const destinations = items
        .filter((item) => item.name.trim())
        .map((item) => ({ ...item, slug: slugify(item.slug || item.name), id: item.id || crypto.randomUUID() }));
      await saveContent({ ...content, destinations });
      setMessage("Destinations saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <h1 className="serif text-4xl">Destinations</h1>
      {items.map((item, index) => (
        <article key={item.id || index} className="grid gap-4 rounded-[1.4rem] bg-paper p-5 ring-1 ring-black/5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={item.name} onChange={(name) => patch(index, { name })} />
            <Field label="Province" value={item.province} onChange={(province) => patch(index, { province })} />
          </div>
          <Field label="Summary" value={item.summary} textarea onChange={(summary) => patch(index, { summary })} />
          <ImageField label="Photo" value={item.image} onChange={(image) => patch(index, { image })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.featured} onChange={(event) => patch(index, { featured: event.target.checked })} />
            Show on the homepage
          </label>
          <button className="text-left text-sm text-coral" type="button" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>
            Remove destination
          </button>
        </article>
      ))}
      <button
        className="btn btn-ghost"
        type="button"
        onClick={() =>
          setItems([
            ...items,
            { id: crypto.randomUUID(), slug: "", name: "", province: "", summary: "", image: "", featured: false },
          ])
        }
      >
        Add destination
      </button>
      <SaveBar saving={saving} message={message} onSave={save} />
    </div>
  );
}

export function StaysEditor({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [items, setItems] = useState(content.stays);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function patch(index: number, partial: Partial<Stay>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const stays = items
        .filter((item) => item.name.trim())
        .map((item) => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          amenities: item.amenities.map((amenity) => amenity.trim()).filter(Boolean),
        }));
      await saveContent({ ...content, stays });
      setMessage("Stays saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <h1 className="serif text-4xl">Stays</h1>
      {items.map((item, index) => (
        <article key={item.id || index} className="grid gap-4 rounded-[1.4rem] bg-paper p-5 ring-1 ring-black/5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Name" value={item.name} onChange={(name) => patch(index, { name })} />
            <Field label="Area" value={item.area} onChange={(area) => patch(index, { area })} />
            <Field label="Style" value={item.style} onChange={(style) => patch(index, { style })} />
          </div>
          <Field label="Summary" value={item.summary} textarea onChange={(summary) => patch(index, { summary })} />
          <ImageField label="Photo" value={item.image} onChange={(image) => patch(index, { image })} />
          <Field
            label="Comforts, one per line"
            value={item.amenities.join("\n")}
            textarea
            onChange={(value) => patch(index, { amenities: value.split("\n") })}
          />
          <button className="text-left text-sm text-coral" type="button" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>
            Remove stay
          </button>
        </article>
      ))}
      <button
        className="btn btn-ghost"
        type="button"
        onClick={() =>
          setItems([...items, { id: crypto.randomUUID(), name: "", area: "", style: "", summary: "", image: "", amenities: [] }])
        }
      >
        Add stay
      </button>
      <SaveBar saving={saving} message={message} onSave={save} />
    </div>
  );
}
