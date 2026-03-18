"use client";

import type { CatalogProduct } from "@/types/catalog";
import type { SavedForLaterItem } from "@/types/cart";

export const SavedForLaterSection = ({
  items,
  products,
  title,
  description,
  emptyTitle,
  emptyDescription,
  onMoveToCart,
  onRemove,
  orderingEnabled,
}: {
  items: SavedForLaterItem[];
  products: CatalogProduct[];
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  onMoveToCart: (product: CatalogProduct) => void;
  onRemove: (id: string) => void;
  orderingEnabled: boolean;
}) => {
  const productsById = new Map(products.map((product) => [product.id, product]));

  return (
    <div className="rounded-[2rem] border border-beige-tostado/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
            Lista separada
          </p>
          <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">{title}</h2>
          <p className="mt-2 max-w-2xl text-sepia/65">{description}</p>
        </div>
        <span className="rounded-full bg-crema px-3 py-2 text-sm font-semibold text-sepia">
          {items.length} guardados
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-beige-tostado/40 bg-crema px-6 py-10 text-center">
          <p className="text-xl font-serif font-bold text-sepia">{emptyTitle}</p>
          <p className="mx-auto mt-3 max-w-xl text-sepia/65">{emptyDescription}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const currentProduct = productsById.get(item.id);
            const canRestore = currentProduct
              ? orderingEnabled &&
                currentProduct.available &&
                currentProduct.inventory.canPurchase &&
                currentProduct.inventory.stock > 0
              : false;

            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-beige-tostado/20 p-4 md:flex-row"
              >
                <div className="h-28 w-full overflow-hidden rounded-2xl bg-beige-tostado/10 md:w-32 md:flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-sepia">{item.name}</h3>
                        <p className="mt-1 text-sm text-sepia/60">
                          Guardado con {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-terracota">${item.price}</span>
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-sepia/55">
                      {currentProduct
                        ? currentProduct.inventory.inventoryStatus === "agotado"
                          ? "No disponible por ahora"
                          : currentProduct.inventory.inventoryStatus === "poco-stock"
                            ? "Disponible con poco stock"
                            : "Disponible para regresar al carrito"
                        : "Este producto ya no esta visible en el menu"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => currentProduct && onMoveToCart(currentProduct)}
                      disabled={!canRestore}
                      className="rounded-xl bg-terracota px-4 py-2 font-semibold text-crema transition-colors hover:bg-rojo-quemado disabled:cursor-not-allowed disabled:bg-beige-tostado/60"
                    >
                      {canRestore ? "Mover al carrito" : "No disponible"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded-xl border border-beige-tostado/35 px-4 py-2 font-semibold text-sepia transition-colors hover:border-terracota"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
