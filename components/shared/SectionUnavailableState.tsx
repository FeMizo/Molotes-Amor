import Link from "next/link";

export const SectionUnavailableState = ({
  eyebrow,
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Volver al inicio",
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) => (
  <section className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 text-center shadow-sm md:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-serif font-bold text-sepia md:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sepia/70">{description}</p>
      <Link
        href={ctaHref}
        className="mt-8 inline-flex rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
      >
        {ctaLabel}
      </Link>
    </div>
  </section>
);
