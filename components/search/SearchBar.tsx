import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative max-w-2xl mx-auto w-full">
    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-canela/50" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Busca tu molote favorito..."
      className="block w-full pl-14 pr-6 py-5 bg-white border-2 border-beige-tostado/30 rounded-2xl text-sepia placeholder-canela/40 focus:outline-none focus:border-terracota focus:ring-4 focus:ring-terracota/5 transition-all text-lg shadow-sm"
    />
  </div>
);
