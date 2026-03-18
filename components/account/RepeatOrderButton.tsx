"use client";

import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { useCartStore } from "@/store/cart-store";
import type { UserPanelOrder } from "@/types/account";

export const RepeatOrderButton = ({
  order,
  fullWidth = false,
}: {
  order: UserPanelOrder;
  fullWidth?: boolean;
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { products } = useCatalogProducts();
  const [feedback, setFeedback] = useState<string | null>(null);

  const availableProducts = useMemo(
    () =>
      order.items
        .map((item) => ({
          item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter(
          (entry): entry is {
            item: UserPanelOrder["items"][number];
            product: (typeof products)[number];
          } => Boolean(entry.product?.available && entry.product.inventory.canPurchase),
        ),
    [order.items, products],
  );

  const repeatOrder = () => {
    let addedCount = 0;

    for (const entry of availableProducts) {
      addItem(entry.product, entry.item.quantity);
      addedCount += entry.item.quantity;
    }

    openCart();
    setFeedback(
      addedCount > 0
        ? `Se agregaron ${addedCount} items de este pedido al carrito.`
        : "No hay productos disponibles de este pedido para repetirlo.",
    );
  };

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        onClick={repeatOrder}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-terracota px-4 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <RefreshCcw size={16} />
        Repetir pedido
      </button>
      {feedback ? (
        <p className="mt-2 text-sm font-medium text-sepia/70">{feedback}</p>
      ) : null}
    </div>
  );
};
