"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { Brand } from "@/lib/types";

type NavTour = { slug: string; title: string; type: "day" | "multi" };
type NavPlace = { slug: string; name: string; province: string };

export function Header({
  brand,
  tours,
  destinations,
}: {
  brand: Brand;
  tours: NavTour[];
  destinations: NavPlace[];
}) {
  const [open, setOpen] = useState(false);
  const dayTours = tours.filter((tour) => tour.type === "day");
  const multiTours = tours.filter((tour) => tour.type === "multi");
  const provinces = [...new Set(destinations.map((place) => place.province))];

  return (
    <header className={`absolute inset-x-0 top-0 ${open ? "z-50" : "z-30"}`}>
      <div className="hidden bg-deep/80 text-xs text-foam/80 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-2">
          <p>{brand.address}</p>
          <p>
            {brand.phone} · {brand.hours}
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-foam" onClick={() => setOpen(false)}>
          <span className="serif block text-2xl leading-none tracking-tight">{brand.name}</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-gold">{brand.tagline}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foam lg:flex">
          <Link href="/">Home</Link>
          <div className="group relative">
            <Link href="/tours">Tours</Link>
            <div className="invisible absolute left-1/2 top-full z-20 w-[42rem] -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-6 rounded-3xl bg-paper p-6 text-ink shadow-2xl">
                <TourColumn title="Signature day tours" tours={dayTours} />
                <TourColumn title="Multi-day journeys" tours={multiTours} />
              </div>
            </div>
          </div>
          <div className="group relative">
            <Link href="/destinations">Destinations</Link>
            <div className="invisible absolute left-1/2 top-full z-20 w-[36rem] -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-3xl bg-paper p-6 text-ink shadow-2xl">
                {provinces.map((province) => (
                  <div key={province}>
                    <p className="text-xs uppercase tracking-[0.16em] text-mist">{province}</p>
                    <div className="mt-2 grid gap-1">
                      {destinations
                        .filter((place) => place.province === province)
                        .map((place) => (
                          <Link key={place.slug} href={`/destinations/${place.slug}`} className="hover:text-lagoon">
                            {place.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/stays">Stays</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact#register" className="btn btn-gold px-4 py-3">
            Register
          </Link>
        </nav>
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-foam lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-lg">{open ? "×" : "☰"}</span>
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-4 max-h-[75vh] overflow-auto rounded-3xl bg-[#fffdf8] p-6 text-[#142226] shadow-2xl ring-1 ring-black/10 lg:hidden"
          >
            <div className="grid gap-5">
              <MobileLinks title="Day tours" tours={dayTours} onNavigate={() => setOpen(false)} />
              <MobileLinks title="Multi-day" tours={multiTours} onNavigate={() => setOpen(false)} />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-mist">Places</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {destinations.map((place) => (
                    <Link key={place.slug} href={`/destinations/${place.slug}`} onClick={() => setOpen(false)}>
                      {place.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 border-t border-sand pt-4 text-sm">
                <Link href="/stays" onClick={() => setOpen(false)}>Stays</Link>
                <Link href="/about" onClick={() => setOpen(false)}>About</Link>
                <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              </div>
              <Link href="/contact#register" className="btn btn-lagoon" onClick={() => setOpen(false)}>
                Register a journey
              </Link>
              <p className="text-sm text-mist">
                {brand.phone}
                <br />
                {brand.hours}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function TourColumn({ title, tours }: { title: string; tours: NavTour[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-mist">{title}</p>
      <div className="mt-3 grid gap-2">
        {tours.map((tour) => (
          <Link key={tour.slug} href={`/tours/${tour.slug}`} className="hover:text-lagoon">
            {tour.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileLinks({
  title,
  tours,
  onNavigate,
}: {
  title: string;
  tours: NavTour[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-mist">{title}</p>
      <div className="mt-2 grid gap-2">
        {tours.map((tour) => (
          <Link key={tour.slug} href={`/tours/${tour.slug}`} onClick={onNavigate}>
            {tour.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
