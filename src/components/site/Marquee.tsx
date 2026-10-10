export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-sand bg-paper py-4 text-sm font-medium tracking-wide text-lagoon">
      <div className="marquee-track flex w-max gap-10 px-6">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
