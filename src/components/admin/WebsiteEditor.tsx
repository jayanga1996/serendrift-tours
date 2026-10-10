"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/types";
import { Field, ImageField, SaveBar, saveContent } from "./fields";

export function WebsiteEditor({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await saveContent(content);
      setMessage("Website saved. Refresh the public site to see it.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid max-w-3xl gap-8">
      <div>
        <h1 className="serif text-4xl">Images & website</h1>
        <p className="mt-2 text-sm text-mist">
          Hero photos, offers, the about story, guest quotes, phone, and address. Tour photos live under Tours.
        </p>
      </div>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Contact details</h2>
        {(
          [
            ["name", "Brand name"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["whatsapp", "WhatsApp"],
            ["email", "Email"],
            ["address", "Address"],
            ["hours", "Hours"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={content.brand[key]}
            onChange={(value) => setContent({ ...content, brand: { ...content.brand, [key]: value } })}
          />
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Homepage slides</h2>
        {content.heroSlides.map((slide, index) => (
          <article key={slide.id} className="grid gap-3 rounded-[1.4rem] bg-paper p-4 ring-1 ring-black/5">
            <Field label="Small label" value={slide.eyebrow} onChange={(eyebrow) => updateSlide(index, { eyebrow })} />
            <Field label="Title" value={slide.title} onChange={(title) => updateSlide(index, { title })} />
            <Field label="Text" value={slide.text} textarea onChange={(text) => updateSlide(index, { text })} />
            <Field label="Button" value={slide.cta} onChange={(cta) => updateSlide(index, { cta })} />
            <Field label="Button link" value={slide.href} onChange={(href) => updateSlide(index, { href })} />
            <ImageField label="Photo" value={slide.image} onChange={(image) => updateSlide(index, { image })} />
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Moving banner</h2>
        <Field
          label="One phrase per line"
          textarea
          value={content.ticker.join("\n")}
          onChange={(value) => setContent({ ...content, ticker: value.split("\n") })}
        />
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Offer cards</h2>
        {content.deals.map((deal, index) => (
          <article key={deal.id} className="grid gap-3 rounded-[1.4rem] bg-paper p-4 ring-1 ring-black/5">
            <Field label="Label" value={deal.kicker} onChange={(kicker) => updateDeal(index, { kicker })} />
            <Field label="Title" value={deal.title} onChange={(title) => updateDeal(index, { title })} />
            <Field label="Link" value={deal.href} onChange={(href) => updateDeal(index, { href })} />
            <ImageField label="Photo" value={deal.image} onChange={(image) => updateDeal(index, { image })} />
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">About</h2>
        <Field label="Heading" value={content.about.heading} onChange={(heading) => setContent({ ...content, about: { ...content.about, heading } })} />
        <Field label="Lead" value={content.about.lead} textarea onChange={(lead) => setContent({ ...content, about: { ...content.about, lead } })} />
        <Field label="Story" value={content.about.body} textarea onChange={(body) => setContent({ ...content, about: { ...content.about, body } })} />
        <ImageField label="Photo" value={content.about.image} onChange={(image) => setContent({ ...content, about: { ...content.about, image } })} />
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Numbers</h2>
        {content.stats.map((stat, index) => (
          <div key={stat.id} className="grid gap-3 sm:grid-cols-2">
            <Field label="Value" value={stat.value} onChange={(value) => updateStat(index, { value })} />
            <Field label="Label" value={stat.label} onChange={(label) => updateStat(index, { label })} />
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Reasons</h2>
        {content.reasons.map((reason, index) => (
          <article key={reason.id} className="grid gap-3">
            <Field label="Title" value={reason.title} onChange={(title) => updateReason(index, { title })} />
            <Field label="Text" value={reason.text} textarea onChange={(text) => updateReason(index, { text })} />
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="serif text-2xl">Guest stories</h2>
        <p className="text-sm text-mist">Replace the sample stories with words from real travellers before you promote them.</p>
        {content.testimonials.map((story, index) => (
          <article key={story.id} className="grid gap-3 rounded-[1.4rem] bg-paper p-4 ring-1 ring-black/5">
            <Field label="Title" value={story.title} onChange={(title) => updateStory(index, { title })} />
            <Field label="Quote" value={story.quote} textarea onChange={(quote) => updateStory(index, { quote })} />
            <Field label="Name" value={story.name} onChange={(name) => updateStory(index, { name })} />
            <Field label="From" value={story.from} onChange={(from) => updateStory(index, { from })} />
            <button className="text-left text-sm text-coral" type="button" onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((_, itemIndex) => itemIndex !== index) })}>
              Remove story
            </button>
          </article>
        ))}
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() =>
            setContent({
              ...content,
              testimonials: [...content.testimonials, { id: crypto.randomUUID(), name: "", from: "", title: "", quote: "" }],
            })
          }
        >
          Add story
        </button>
      </section>
      <SaveBar saving={saving} message={message} onSave={save} />
    </div>
  );

  function updateSlide(index: number, partial: Partial<SiteContent["heroSlides"][number]>) {
    setContent({
      ...content,
      heroSlides: content.heroSlides.map((slide, itemIndex) => (itemIndex === index ? { ...slide, ...partial } : slide)),
    });
  }
  function updateDeal(index: number, partial: Partial<SiteContent["deals"][number]>) {
    setContent({
      ...content,
      deals: content.deals.map((deal, itemIndex) => (itemIndex === index ? { ...deal, ...partial } : deal)),
    });
  }
  function updateStat(index: number, partial: Partial<SiteContent["stats"][number]>) {
    setContent({
      ...content,
      stats: content.stats.map((stat, itemIndex) => (itemIndex === index ? { ...stat, ...partial } : stat)),
    });
  }
  function updateReason(index: number, partial: Partial<SiteContent["reasons"][number]>) {
    setContent({
      ...content,
      reasons: content.reasons.map((reason, itemIndex) => (itemIndex === index ? { ...reason, ...partial } : reason)),
    });
  }
  function updateStory(index: number, partial: Partial<SiteContent["testimonials"][number]>) {
    setContent({
      ...content,
      testimonials: content.testimonials.map((story, itemIndex) => (itemIndex === index ? { ...story, ...partial } : story)),
    });
  }
}
