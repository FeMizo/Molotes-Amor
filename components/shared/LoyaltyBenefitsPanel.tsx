"use client";

import { Gift, Medal, Sparkles } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { LoyaltyProfile } from "@/types/account";

export const LoyaltyBenefitsPanel = ({
  loyalty,
  title = "Beneficios de fidelidad",
  description,
  className = "",
}: {
  loyalty: LoyaltyProfile;
  title?: string;
  description?: string;
  className?: string;
}) => {
  const hasBenefits =
    loyalty.isFrequentCustomer ||
    loyalty.points > 0 ||
    loyalty.availableCredit > 0 ||
    loyalty.benefits.length > 0 ||
    Boolean(loyalty.note);

  return (
    <article className={`rounded-[1.5rem] border border-beige-tostado/20 bg-white p-5 ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
            Fidelidad
          </p>
          <h3 className="mt-2 text-xl font-serif font-bold text-sepia">{title}</h3>
          {description ? <p className="mt-2 text-sm text-sepia/65">{description}</p> : null}
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-crema text-terracota">
          <Gift size={18} />
        </span>
      </div>

      {hasBenefits ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-crema p-4">
              <p className="text-sm text-sepia/55">Nivel</p>
              <p className="mt-1 flex items-center gap-2 font-bold text-sepia">
                <Medal size={16} className="text-terracota" />
                {loyalty.tier}
              </p>
            </div>
            <div className="rounded-2xl bg-crema p-4">
              <p className="text-sm text-sepia/55">Puntos</p>
              <p className="mt-1 font-bold text-sepia">{loyalty.points}</p>
            </div>
            <div className="rounded-2xl bg-crema p-4">
              <p className="text-sm text-sepia/55">Credito</p>
              <p className="mt-1 font-bold text-sepia">{formatCurrency(loyalty.availableCredit)}</p>
            </div>
          </div>

          {loyalty.benefits.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {loyalty.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-beige-tostado/30 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sepia/75"
                >
                  {benefit}
                </span>
              ))}
            </div>
          ) : null}

          {loyalty.note ? (
            <div className="mt-4 rounded-2xl bg-crema px-4 py-3 text-sm text-sepia/75">
              <p className="flex items-center gap-2 font-semibold text-sepia">
                <Sparkles size={14} className="text-terracota" />
                Nota activa
              </p>
              <p className="mt-2">{loyalty.note}</p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-5 rounded-2xl bg-crema px-4 py-4 text-sm text-sepia/70">
          Tu cuenta aun no tiene beneficios activos. Cuando admin te marque como cliente frecuente, aqui veras nivel, puntos y ventajas disponibles.
        </div>
      )}
    </article>
  );
};
