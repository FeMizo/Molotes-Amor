"use client";

import { Heart } from "lucide-react";

export const FavoriteToggleButton = ({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
      active
        ? "border-rojo-quemado/40 bg-rojo-quemado text-crema"
        : "border-crema/70 bg-crema/90 text-sepia hover:text-rojo-quemado"
    }`}
    aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
  >
    <Heart size={18} className={active ? "fill-current" : ""} />
  </button>
);
