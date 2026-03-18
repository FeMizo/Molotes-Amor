"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { assertValidEmail, assertValidPhone } from "@/lib/contact";
import { isTransferConfigReady, paymentMethodLabel } from "@/lib/payment";
import { adminClient } from "@/services/client/admin-client";
import { selectCurrentUser, useAuthStore } from "@/store/auth-store";
import { cartSubtotal, useCartStore } from "@/store/cart-store";
import type { Order, OrderPaymentMethod } from "@/types/order";
import type { OperationsContent } from "@/types/site-content";

export const CheckoutPage = ({ operations }: { operations: OperationsContent }) => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const currentUser = useAuthStore(selectCurrentUser);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("efectivo");
  const [loading, setLoading] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const transferReady = useMemo(() => isTransferConfigReady(operations), [operations]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const defaultAddress = currentUser.addresses.find((candidate) => candidate.isDefault);
    setName(`${currentUser.firstName} ${currentUser.lastName}`.trim());
    setPhone(currentUser.phone);
    setEmail(currentUser.email);
    setAddress(defaultAddress?.line1 ?? "");
  }, [currentUser]);

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentUser) {
      setErrorMessage("Necesitas iniciar sesion antes de confirmar tu pedido.");
      openAuthModal("Inicia sesion para finalizar tu compra.");
      return;
    }

    if (!operations.isOrderingEnabled) {
      setErrorMessage(operations.checkoutMessage);
      return;
    }

    if (paymentMethod === "transferencia" && !transferReady) {
      setErrorMessage("La transferencia no esta disponible hasta que admin configure los datos.");
      return;
    }

    setLoading(true);

    try {
      const normalizedPhone = assertValidPhone(
        phone,
        "Ingresa un telefono valido de 10 a 15 digitos.",
      );
      const normalizedEmail = assertValidEmail(
        email,
        "Ingresa un correo valido para tu pedido.",
      );
      const order = await adminClient.createOrder({
        account: {
          userId: currentUser.id,
          username: currentUser.username,
        },
        customer: {
          name,
          phone: normalizedPhone,
          email: normalizedEmail,
          address: address || undefined,
        },
        payment: {
          method: paymentMethod,
        },
        notes: notes || undefined,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setSubmittedOrder(order);
      setSuccessMessage(`Pedido ${order.id} creado correctamente.`);
      setNotes("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo crear el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl p-8 border border-beige-tostado/30 text-center">
          <h1 className="text-4xl font-serif font-bold text-sepia mb-4">
            {successMessage ? "Pedido confirmado" : "Checkout"}
          </h1>
          <p className="text-sepia/70 mb-6">
            {successMessage ?? "Tu carrito esta vacio."}
          </p>
          {submittedOrder?.payment?.method === "transferencia" ? (
            <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-beige-tostado/30 bg-crema p-6 text-left">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                Pago por transferencia
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Banco</p>
                  <p className="mt-1 font-bold text-sepia">{submittedOrder.payment.bank}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Titular</p>
                  <p className="mt-1 font-bold text-sepia">{submittedOrder.payment.accountHolder}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Cuenta</p>
                  <p className="mt-1 font-bold text-sepia">{submittedOrder.payment.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">CLABE</p>
                  <p className="mt-1 font-bold text-sepia">{submittedOrder.payment.clabe}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-terracota/20 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">
                  {operations.transferReferenceLabel}
                </p>
                <p className="mt-1 text-lg font-bold text-terracota">
                  {submittedOrder.payment.transferReference}
                </p>
              </div>
              <p className="mt-4 text-sm text-sepia/70">{operations.transferInstructions}</p>
            </div>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            {successMessage ? (
              <Link
                href="/mi-cuenta"
                className="inline-block px-6 py-3 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl transition-colors"
              >
                Ver mi centro de pedidos
              </Link>
            ) : null}
            <Link
              href="/menu"
              className="inline-block px-6 py-3 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl transition-colors"
            >
              Ir al menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
        <article className="bg-white rounded-2xl p-8 border border-beige-tostado/30 shadow-sm">
          <h1 className="text-4xl font-serif font-bold text-sepia mb-6">Finalizar pedido</h1>
          {!currentUser ? (
            <div className="mb-5 rounded-2xl border border-mostaza/30 bg-mostaza/10 px-5 py-4">
              <p className="font-semibold text-sepia">Necesitas iniciar sesion para comprar.</p>
              <p className="mt-1 text-sm text-sepia/70">
                El pedido quedara vinculado a tu usuario y aparecera en Mis pedidos.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal("Inicia sesion para continuar con tu compra.")}
                className="mt-4 rounded-xl bg-terracota px-4 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
              >
                Iniciar sesion
              </button>
            </div>
          ) : null}
          {!operations.isOrderingEnabled ? (
            <div className="mb-5 rounded-2xl border border-mostaza/30 bg-mostaza/10 px-5 py-4">
              <p className="font-semibold text-sepia">{operations.statusLabel}</p>
              <p className="mt-1 text-sm text-sepia/70">{operations.checkoutMessage}</p>
            </div>
          ) : null}
          <form className="space-y-5" onSubmit={submitOrder}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Nombre</label>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-5 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Telefono</label>
              <input
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                pattern="[0-9+()\\-\\s]+"
                className="w-full px-5 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
              />
              <p className="text-xs text-sepia/55">Solo numeros. Puedes incluir lada o prefijo internacional.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-5 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
              />
              <p className="text-xs text-sepia/55">
                Este correo quedara guardado dentro de la informacion del pedido.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Direccion</label>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="w-full px-5 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">Notas</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full px-5 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota min-h-28"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-sepia/60 uppercase tracking-widest">
                Metodo de pago
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                {(["efectivo", "transferencia"] as const).map((method) => {
                  const disabled = method === "transferencia" && !transferReady;
                  const active = paymentMethod === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                        active
                          ? "border-terracota bg-terracota/10"
                          : "border-beige-tostado/30 bg-crema"
                      } ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-terracota/30 hover:bg-crema/70"}`}
                    >
                      <p className="font-bold text-sepia">{paymentMethodLabel[method]}</p>
                      <p className="mt-1 text-sm text-sepia/65">
                        {method === "efectivo"
                          ? "Pagas al recibir o al recoger."
                          : "Te mostraremos los datos bancarios al confirmar."}
                      </p>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "transferencia" ? (
                <div className="rounded-2xl border border-beige-tostado/30 bg-crema p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
                    Datos de transferencia
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Banco</p>
                      <p className="mt-1 font-bold text-sepia">{operations.transferBank}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Titular</p>
                      <p className="mt-1 font-bold text-sepia">{operations.transferAccountHolder}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">Cuenta</p>
                      <p className="mt-1 font-bold text-sepia">{operations.transferAccountNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">CLABE</p>
                      <p className="mt-1 font-bold text-sepia">{operations.transferClabe}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-terracota/25 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">
                      {operations.transferReferenceLabel}
                    </p>
                    <p className="mt-1 font-bold text-terracota">
                      Se genera automaticamente al confirmar tu pedido.
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-sepia/70">{operations.transferInstructions}</p>
                </div>
              ) : null}
            </div>
            {errorMessage ? <p className="text-rojo-quemado font-semibold">{errorMessage}</p> : null}
            {successMessage ? <p className="text-olivo font-semibold">{successMessage}</p> : null}
            <button
              type="submit"
              disabled={loading || !currentUser || !operations.isOrderingEnabled}
              className="w-full py-4 bg-terracota hover:bg-rojo-quemado text-crema font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading
                ? "Procesando..."
                : !operations.isOrderingEnabled
                  ? "Pedidos pausados"
                  : currentUser
                    ? "Confirmar pedido"
                    : "Inicia sesion para comprar"}
            </button>
          </form>
        </article>

        <article className="bg-white rounded-2xl p-8 border border-beige-tostado/30 shadow-sm h-fit">
          <h2 className="text-2xl font-serif font-bold text-sepia mb-5">Resumen</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-beige-tostado/30 pb-3">
                <p className="font-semibold text-sepia">
                  {item.quantity} x {item.name}
                </p>
                <p className="font-bold text-terracota">${item.quantity * item.price}</p>
              </div>
            ))}
            <div className="flex justify-between text-xl pt-2">
              <span className="font-semibold text-sepia">Total</span>
              <span className="font-bold text-sepia">${subtotal}</span>
            </div>
            <div className="rounded-xl bg-crema px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-sepia/55">
                Metodo de pago
              </p>
              <p className="mt-1 font-bold text-sepia">{paymentMethodLabel[paymentMethod]}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
