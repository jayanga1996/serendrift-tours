import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-foam px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Lost the path</p>
        <h1 className="serif mt-3 text-5xl">This page is not on the map</h1>
        <Link href="/" className="btn btn-lagoon mt-8">
          Back to the island
        </Link>
      </div>
    </main>
  );
}
