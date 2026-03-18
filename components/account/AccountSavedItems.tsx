"use client";

import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { useUserAccount } from "@/hooks/use-user-account";
import { useCartStore } from "@/store/cart-store";

import { AccountEmptyState } from "./AccountEmptyState";
import { ProductCard } from "../products/ProductCard";
import { SavedForLaterSection } from "../products/SavedForLaterSection";

export const AccountSavedItems = () => {
  const { loading, error, favoriteProducts } = useUserAccount();
  const { products } = useCatalogProducts();
  const savedItems = useCartStore((state) => state.savedItems);
  const addItem = useCartStore((state) => state.addItem);
  const removeSavedItem = useCartStore((state) => state.removeSavedItem);

  if (loading) {
    return (
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 shadow-sm">
        <p className="font-semibold text-sepia">Cargando tus guardados...</p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 shadow-sm">
        <p className="font-semibold text-rojo-quemado">{error}</p>
      </article>
    );
  }

  if (favoriteProducts.length === 0 && savedItems.length === 0) {
    return (
      <AccountEmptyState
        title="No tienes guardados por ahora"
        description="Tus favoritos y los productos apartados del carrito apareceran aqui para volver a ellos rapido."
        ctaHref="/menu"
        ctaLabel="Ir al menu"
      />
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Favoritos
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
              Guardados con corazon
            </h2>
            <p className="mt-2 max-w-2xl text-sepia/65">
              Aqui aparecen los productos que marcaste como favoritos para volver a pedirlos mas rapido.
            </p>
          </div>
          <span className="rounded-full bg-crema px-3 py-2 text-sm font-semibold text-sepia">
            {favoriteProducts.length} favoritos
          </span>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-beige-tostado/40 bg-crema px-6 py-10 text-center">
            <p className="text-xl font-serif font-bold text-sepia">Todavia no marcas favoritos.</p>
            <p className="mx-auto mt-3 max-w-xl text-sepia/65">
              Usa el corazon en el menu para guardar tus molotes preferidos y verlos aqui.
            </p>
          </div>
        )}
      </article>

      <SavedForLaterSection
        items={savedItems}
        products={products}
        title="Apartados del carrito"
        description="Si separaste productos del carrito para retomarlos despues, quedan listos en esta misma tab."
        emptyTitle="No tienes productos apartados del carrito"
        emptyDescription="Cuando muevas productos desde el carrito a guardados, apareceran aqui."
        orderingEnabled
        onMoveToCart={(product) => {
          addItem(product);
          removeSavedItem(product.id);
        }}
        onRemove={removeSavedItem}
      />
    </div>
  );
};
