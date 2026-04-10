"use client";

import { useRef, useState } from "react";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  optional?: boolean;
}

export const ImageUploadInput = ({ value, onChange, optional = false }: ImageUploadInputProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Error al subir imagen");
      }

      onChange(data.url ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-full rounded-xl border border-beige-tostado/30 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rojo-quemado text-xs font-bold text-crema"
            aria-label="Quitar imagen"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-1 w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-2 text-sm font-semibold text-sepia transition-colors hover:border-terracota/30 disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "Cambiar imagen"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-beige-tostado/50 bg-crema text-sm font-semibold text-sepia/60 transition-colors hover:border-terracota/40 hover:text-sepia disabled:opacity-50"
        >
          {uploading
            ? "Subiendo..."
            : optional
              ? "Subir imagen (opcional)"
              : "Subir imagen"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
          event.target.value = "";
        }}
      />
      {error ? <p className="text-xs font-semibold text-rojo-quemado">{error}</p> : null}
    </div>
  );
};
