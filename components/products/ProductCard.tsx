"use client";

import { motion } from "motion/react";
import { Plus, Star } from "lucide-react";

import { useCartStore } from "@/store/cart-store";
import type { CatalogProduct } from "@/types/catalog";

interface ProductCardProps {
  product: CatalogProduct;
  onAddToCart?: (product: CatalogProduct) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const handleAdd = () => (onAddToCart ? onAddToCart(product) : addItem(product));
  const currentCartItem = items.find((item) => item.id === product.id);
  const inventoryStatusLabel =
    product.inventory.inventoryStatus === "disponible"
      ? "Disponible"
      : product.inventory.inventoryStatus === "poco-stock"
        ? "Poco stock"
        : "Agotado";
  const canAdd =
    product.available &&
    product.inventory.canPurchase &&
    (currentCartItem?.quantity ?? 0) < product.inventory.stock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-beige-tostado/20"
    >
      {product.badge ? (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-mostaza text-canela shadow-sm">
            <Star size={12} className="mr-1 fill-current" />
            {product.badge}
          </span>
        </div>
      ) : null}

      <div className="aspect-[4/3] overflow-hidden bg-beige-tostado/10">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-sepia leading-tight">{product.name}</h3>
          <span className="text-lg font-bold text-terracota">${product.price}</span>
        </div>

        <p className="text-sm text-sepia/70 mb-6 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-wider ${
            product.inventory.inventoryStatus === "agotado"
              ? "text-rojo-quemado"
              : product.inventory.inventoryStatus === "poco-stock"
                ? "text-mostaza"
                : "text-olivo"
          }`}
        >
          {inventoryStatusLabel}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-beige-tostado/20 hover:bg-terracota hover:text-crema text-terracota font-bold rounded-xl transition-all duration-300 border border-terracota/20 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>{canAdd ? "Agregar al carrito" : currentCartItem ? "Maximo en carrito" : "Sin stock"}</span>
        </button>
      </div>
    </motion.div>
  );
};
