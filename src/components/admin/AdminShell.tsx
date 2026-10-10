"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  ["/admin", "Overview"],
  ["/admin/tours", "Tours"],
  ["/admin/bookings", "Guest requests"],
  ["/admin/destinations", "Destinations"],
  ["/admin/stays", "Stays"],
  ["/admin/website", "Images & website"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-foam text-ink md:grid md:grid-cols-[16rem_1fr]">
      <aside className={`${open ? "block" : "hidden"} border-b border-sand bg-deep text-foam md:block md:border-0`}>
        <div className="flex items-center justify-between px-5 py-6">
          <Link href="/admin">
            <span className="serif text-2xl">Serendrift</span>
            <span className="block text-xs uppercase tracking-[0.18em] text-gold">Planner desk</span>
          </Link>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="grid gap-1 px-3 pb-6">
          {links.map(([href, label]) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm ${active ? "bg-white/10 text-gold" : "text-foam/80"}`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/" className="rounded-2xl px-4 py-3 text-sm text-foam/80">
            View website
          </Link>
          <button onClick={logout} className="rounded-2xl px-4 py-3 text-left text-sm text-foam/80">
            Sign out
          </button>
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-sand bg-paper px-5 py-4 md:hidden">
          <p className="serif text-xl">Planner desk</p>
          <button className="rounded-full border border-sand px-3 py-2" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
