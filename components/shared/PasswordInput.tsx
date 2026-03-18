"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 pr-12 focus:border-terracota focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-sepia/60 transition-colors hover:text-terracota"
        aria-label={visible ? "Ocultar contrasena" : "Ver contrasena"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
