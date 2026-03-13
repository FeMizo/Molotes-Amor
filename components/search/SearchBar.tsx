import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  compact = false,
  placeholder = "Busca tu molote favorito...",
}: SearchBarProps) => (
  <div className={`relative mx-auto w-full ${compact ? "max-w-xl" : "max-w-2xl"}`}>
    <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${compact ? "pl-4" : "pl-6"}`}>
      <Search className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-canela/50`} />
    </div>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`block w-full bg-white border-2 border-beige-tostado/30 text-sepia placeholder-canela/40 focus:outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/5 transition-all shadow-sm ${
        compact
          ? "pl-11 pr-4 py-3 rounded-xl text-base"
          : "pl-14 pr-6 py-5 rounded-2xl text-lg"
      }`}
    />
  </div>
);
