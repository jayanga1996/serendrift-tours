"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Destination, Slide } from "@/lib/types";

export function Hero({ slides, destinations }: { slides: Slide[]; destinations: Destination[] }) {
  const [index, setIndex] = useState(0);
  const [place, setPlace] = useState("");
  const reduce = useReducedMotion();
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reduce, slides.length]);

  if (!slide) return null;

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-deep text-foam">
      <AnimatePresence mode="sync">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 h-full w-full object-cover ${reduce ? "" : "kenburns"}`}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/35" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-28 pt-36 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-gold">{slide.eyebrow}</p>
            <h1 className="serif mt-4 text-5xl leading-[1.02] text-white drop-shadow-lg sm:text-7xl">{slide.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-foam/85">{slide.text}</p>
            <Link href={slide.href} className="btn btn-gold mt-8">
              {slide.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center gap-3">
          {slides.map((item, itemIndex) => (
            <button
              key={item.id}
              aria-label={`Show slide ${itemIndex + 1}`}
              onClick={() => setIndex(itemIndex)}
              className={`h-2.5 rounded-full transition-all ${itemIndex === index ? "w-8 bg-gold" : "w-2.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
      <form
        action="/tours"
        className="relative z-10 mx-auto -mt-12 mb-4 grid max-w-6xl gap-3 rounded-[1.6rem] bg-paper p-3 text-ink shadow-xl sm:grid-cols-[1fr_auto] sm:items-center sm:px-4"
      >
        <label className="grid gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          Where would you like to go?
          <select
            name="place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            className="bg-transparent text-base font-medium normal-case tracking-normal text-ink outline-none"
          >
            <option value="">All of Sri Lanka</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.slug}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-lagoon">Find a journey</button>
      </form>
    </section>
  );
}
