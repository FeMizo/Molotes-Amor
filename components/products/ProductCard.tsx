"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus, Star } from "lucide-react";

import { useAccountStore } from "@/store/account-store";
import { useCartStore } from "@/store/cart-store";
import type { CatalogProduct } from "@/types/catalog";

import { FavoriteToggleButton } from "./FavoriteToggleButton";

interface ProductCardProps {
  product: CatalogProduct;
  onAddToCart?: (product: CatalogProduct, quantity: number) => void;
  orderingEnabled?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  orderingEnabled = true,
}: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const savedItems = useCartStore((state) => state.savedItems);
  const saveForLater = useCartStore((state) => state.saveForLater);
  const removeSavedItem = useCartStore((state) => state.removeSavedItem);
  const favoriteProductIds = useAccountStore((state) => state.favoriteProductIds);
  const toggleFavorite = useAccountStore((state) => state.toggleFavorite);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const currentCartItem = items.find((item) => item.id === product.id);
  const savedItem = savedItems.find((item) => item.id === product.id);
  const isFavorite = favoriteProductIds.includes(product.id);
  const maxAvailableToAdd = Math.max(
    0,
    product.inventory.stock - (currentCartItem?.quantity ?? 0),
  );
  const selectedQuantity = Math.min(requestedQuantity, Math.max(1, maxAvailableToAdd));
  const inventoryStatusLabel =
    product.inventory.inventoryStatus === "disponible"
      ? "Disponible"
      : product.inventory.inventoryStatus === "poco-stock"
        ? "Poco stock"
        : "Agotado";
  const canAdd =
    orderingEnabled &&
    product.available &&
    product.inventory.canPurchase &&
    maxAvailableToAdd > 0;

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }

    const quantityToAdd = Math.min(selectedQuantity, maxAvailableToAdd);
    if (onAddToCart) {
      onAddToCart(product, quantityToAdd);
      return;
    }

    addItem(product, quantityToAdd);
  };

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

      <div className="absolute top-4 right-4 z-10">
        <FavoriteToggleButton active={isFavorite} onToggle={() => toggleFavorite(product.id)} />
      </div>

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

        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-beige-tostado/20 bg-crema px-3 py-2">
          <span className="text-sm font-semibold text-sepia">Cantidad</span>
          <div className="flex items-center overflow-hidden rounded-lg border border-beige-tostado/30 bg-white">
            <button
              type="button"
              onClick={() => setRequestedQuantity((value) => Math.max(1, value - 1))}
              disabled={!canAdd || selectedQuantity <= 1}
              className="p-2 text-sepia transition-colors hover:bg-beige-tostado/20 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Reducir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-10 px-3 text-center text-sm font-bold text-sepia">
              {selectedQuantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setRequestedQuantity((value) =>
                  Math.min(Math.max(1, maxAvailableToAdd), value + 1),
                )
              }
              disabled={!canAdd || selectedQuantity >= Math.max(1, maxAvailableToAdd)}
              className="p-2 text-sepia transition-colors hover:bg-beige-tostado/20 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-beige-tostado/20 hover:bg-terracota hover:text-crema text-terracota font-bold rounded-xl transition-all duration-300 border border-terracota/20 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>
            {orderingEnabled
              ? canAdd
                ? `Agregar ${selectedQuantity} al carrito`
                : currentCartItem
                  ? "Maximo en carrito"
                  : "Sin stock"
              : "Pedidos pausados"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => (savedItem ? removeSavedItem(product.id) : saveForLater(product))}
          className="mt-3 w-full rounded-xl border border-beige-tostado/30 px-4 py-3 text-sm font-semibold text-sepia transition-colors hover:border-terracota hover:text-terracota"
        >
          {savedItem
            ? "Quitar de guardados"
            : currentCartItem
              ? "Mover a guardados"
              : "Guardar para despues"}
        </button>
      </div>
    </motion.div>
  );
};
