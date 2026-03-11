interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter = ({ categories, activeCategory, onSelect }: CategoryFilterProps) => (
  <div className="flex flex-wrap justify-center gap-3">
    {categories.map((category) => (
      <button
        key={category}
        type="button"
        onClick={() => onSelect(category)}
        className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border ${
          activeCategory === category
            ? "bg-terracota border-terracota text-crema shadow-md"
            : "bg-white border-beige-tostado/30 text-sepia hover:border-terracota/50"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);
