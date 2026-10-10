export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-deep text-foam">
      {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/70 to-deep/35" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-40 sm:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
        <h1 className="serif mt-3 max-w-3xl text-5xl leading-none sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-foam/80">{text}</p>
      </div>
    </section>
  );
}
