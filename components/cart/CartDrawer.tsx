"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cartSubtotal, useCartStore } from "@/store/cart-store";

export const CartDrawer = () => {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = cartSubtotal(items);

  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-sepia/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-crema shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-beige-tostado/30 flex justify-between items-center bg-crema">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-terracota" />
                <h2 className="text-2xl font-serif font-bold text-sepia">Tu Carrito</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 hover:bg-beige-tostado/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="text-xl font-serif">Tu carrito esta vacio</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-terracota font-bold underline underline-offset-4"
                  >
                    Empezar a comprar
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-beige-tostado/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-sepia">{item.name}</h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-rojo-quemado opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-beige-tostado rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-beige-tostado/20 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-beige-tostado/20 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-terracota">${item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 ? (
              <div className="p-6 bg-white border-t border-beige-tostado/30 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-sepia/70">Subtotal</span>
                  <span className="font-bold text-2xl text-sepia">${subtotal}</span>
                </div>
                <p className="text-xs text-sepia/50 text-center italic">
                  * Impuestos y envio calculados al finalizar la compra
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-4 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl shadow-lg shadow-terracota/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Finalizar pedido
                </Link>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};
