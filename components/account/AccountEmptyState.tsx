import Link from "next/link";

export const AccountEmptyState = ({
  title,
  description,
  ctaHref = "/menu",
  ctaLabel = "Explorar menu",
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) => (
  <div className="rounded-[2rem] border border-dashed border-beige-tostado/40 bg-white px-6 py-12 text-center shadow-sm">
    <h2 className="text-3xl font-serif font-bold text-sepia">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-sepia/65">{description}</p>
    <Link
      href={ctaHref}
      className="mt-6 inline-flex rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
    >
      {ctaLabel}
    </Link>
  </div>
);
