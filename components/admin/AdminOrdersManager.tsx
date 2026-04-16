"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { adminOrderStatuses } from "@/lib/order-status";
import {
  getOrderPayment,
  getOrderPaymentMethod,
  getOrderPaymentRef,
  paymentMethodLabel,
} from "@/lib/payment";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { adminClient } from "@/services/client/admin-client";
import type { OrderStatus } from "@/types/order";

import { OrderStatusBadge } from "../orders/OrderStatusBadge";

interface DraftItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export const AdminOrdersManager = () => {
  const { orders, loading, error, updateStatus, updateItems, deleteOrder } = useAdminOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "todos">("todos");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Edit items state
  const [editMode, setEditMode] = useState(false);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<{ id: string; name: string; price: number }[]>([]);
  const [addProductId, setAddProductId] = useState("");
  const [addQuantity, setAddQuantity] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const target =
        `${order.id} ${getOrderPaymentRef(order)} ${order.userUsername ?? ""} ${order.customer.name} ${order.customer.phone} ${order.customer.email ?? ""} ${getOrderPaymentMethod(order)} ${order.status} ${order.items
          .map((item) => item.productName)
          .join(" ")}`.toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 || target.includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0];
  const selectedPayment = selectedOrder ? getOrderPayment(selectedOrder) : null;
  const pendingOrders = orders.filter((order) => order.status === "pendiente").length;
  const inKitchenOrders = orders.filter(
    (order) => order.status === "confirmado" || order.status === "preparando",
  ).length;
  const onRouteOrders = orders.filter((order) => order.status === "en-camino").length;

  const changeStatus = async (id: string, status: OrderStatus) => {
    setFeedback(null);
    setFeedbackError(null);

    try {
      await updateStatus(id, status);
      setFeedback("Estado actualizado.");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "No se pudo actualizar estado.");
    }
  };

  const openEditMode = async () => {
    if (!selectedOrder) return;
    setDraftItems(
      selectedOrder.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    );
    setAddProductId("");
    setAddQuantity(1);
    setFeedback(null);
    setFeedbackError(null);
    setEditMode(true);

    if (catalogProducts.length === 0) {
      try {
        const products = await adminClient.listProducts();
        setCatalogProducts(products.map((p) => ({ id: p.id, name: p.name, price: p.price })));
      } catch {
        // Non-critical — admin can still edit existing items
      }
    }
  };

  const closeEditMode = () => {
    setEditMode(false);
    setDraftItems([]);
    setAddProductId("");
    setAddQuantity(1);
  };

  const setDraftQty = (productId: string, quantity: number) => {
    setDraftItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };

  const removeDraftItem = (productId: string) => {
    setDraftItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const addDraftProduct = () => {
    const product = catalogProducts.find((p) => p.id === addProductId);
    if (!product || addQuantity < 1) return;

    setDraftItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + addQuantity }
            : item,
        );
      }
      return [
        ...prev,
        { productId: product.id, productName: product.name, unitPrice: product.price, quantity: addQuantity },
      ];
    });

    setAddProductId("");
    setAddQuantity(1);
  };

  const saveEditItems = async () => {
    if (!selectedOrder || draftItems.length === 0) return;
    setEditLoading(true);
    setFeedback(null);
    setFeedbackError(null);

    try {
      await updateItems(selectedOrder.id, draftItems);
      setFeedback("Pedido actualizado.");
      setEditMode(false);
      setDraftItems([]);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "No se pudo actualizar el pedido.");
    } finally {
      setEditLoading(false);
    }
  };

  const removeSelectedOrder = async () => {
    if (!selectedOrder) {
      return;
    }

    const confirmed = window.confirm(
      `Eliminar el pedido ${getOrderPaymentRef(selectedOrder)}? Esta accion lo borra definitivamente y restaura inventario cuando es posible.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);
    setFeedback(null);
    setFeedbackError(null);

    try {
      await deleteOrder(selectedOrder.id);
      setSelectedOrderId(null);
      closeEditMode();
      setFeedback("Pedido eliminado.");
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "No se pudo eliminar el pedido.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
              Pedidos
            </p>
            <h2 className="mt-2 text-2xl font-serif font-bold text-sepia">
              Flujo operativo de pedidos
            </h2>
            <p className="mt-2 text-sepia/65">
              Filtra por estado, busca por cliente y actualiza el flujo sin saturar una sola vista.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Total pedidos</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{orders.length}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">Pendientes</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{pendingOrders}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">En cocina</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{inKitchenOrders}</p>
            </div>
            <div className="rounded-2xl bg-crema px-4 py-3">
              <p className="text-sm text-sepia/55">En camino</p>
              <p className="mt-1 text-2xl font-serif font-bold text-sepia">{onRouteOrders}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por referencia, cliente, telefono, email o producto"
            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("todos")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                statusFilter === "todos"
                  ? "border-terracota bg-terracota text-crema"
                  : "border-beige-tostado/30 bg-crema text-sepia"
              }`}
            >
              Todos
            </button>
            {adminOrderStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  statusFilter === status
                    ? "border-terracota bg-terracota text-crema"
                    : "border-beige-tostado/30 bg-crema text-sepia"
                }`}
              >
                {status.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_1.25fr]">
        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-sepia">Cola de pedidos</h3>
            <span className="text-sm text-sepia/70">
              {loading ? "Cargando..." : `${filteredOrders.length} visibles`}
            </span>
          </div>
          {error ? <p className="mb-3 font-semibold text-rojo-quemado">{error}</p> : null}
          <div className="space-y-3 max-h-[720px] overflow-auto pr-1">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => { setSelectedOrderId(order.id); closeEditMode(); }}
                className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                  selectedOrder?.id === order.id
                    ? "border-terracota bg-crema shadow-sm"
                    : "border-beige-tostado/25 hover:-translate-y-0.5 hover:border-terracota/30 hover:bg-crema/40 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sepia transition-colors duration-300 group-hover:text-terracota">
                      Ref. {getOrderPaymentRef(order)}
                    </p>
                    <p className="mt-1 text-sm text-sepia/60">{order.customer.name}</p>
                    <p className="text-xs text-sepia/50">
                      {order.userUsername ? `Usuario: ${order.userUsername}` : "Sin usuario"}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} compact />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-sepia/60">{order.items.length} items</span>
                  <div className="flex items-center gap-2">
                    {order.deliveryDay ? (
                      <span className="rounded-full bg-mostaza/20 px-2 py-0.5 text-xs font-semibold capitalize text-sepia">
                        {order.deliveryDay}
                      </span>
                    ) : null}
                    <span className="font-bold text-terracota">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </button>
            ))}
            {!loading && filteredOrders.length === 0 ? (
              <p className="rounded-2xl bg-crema px-4 py-8 text-center text-sepia/60">
                No hay pedidos con ese filtro.
              </p>
            ) : null}
          </div>
        </article>

        <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
          {!selectedOrder ? (
            <p className="rounded-2xl bg-crema px-4 py-8 text-center text-sepia/60">
              Selecciona un pedido para ver su detalle operativo.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-sepia">
                    Referencia {getOrderPaymentRef(selectedOrder)}
                  </h2>
                  <p className="mt-2 text-sepia/65">
                    Cliente: {selectedOrder.customer.name}
                  </p>
                  <p className="text-sm text-sepia/55">
                    Usuario: {selectedOrder.userUsername ?? "Sin usuario vinculado"}
                  </p>
                  <p className="text-sm text-sepia/55">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                  {selectedOrder.deliveryDay ? (
                    <p className="mt-1 text-sm font-semibold text-sepia">
                      Entrega:{" "}
                      <span className="capitalize text-terracota">
                        {selectedOrder.deliveryDay}
                      </span>
                    </p>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <OrderStatusBadge status={selectedOrder.status} />
                  <select
                    value={selectedOrder.status}
                    onChange={(event) =>
                      void changeStatus(
                        selectedOrder.id,
                        event.target.value as OrderStatus,
                      )
                    }
                    className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                  >
                    {adminOrderStatuses.map((status) => (
                      <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void removeSelectedOrder()}
                    disabled={deleteLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rojo-quemado/30 px-4 py-3 text-sm font-semibold text-rojo-quemado transition-colors hover:bg-rojo-quemado/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deleteLoading ? "Eliminando..." : "Eliminar pedido"}
                  </button>
                </div>
              </div>

              {feedback ? <p className="font-semibold text-olivo">{feedback}</p> : null}
              {feedbackError ? <p className="font-semibold text-rojo-quemado">{feedbackError}</p> : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-crema p-4">
                    <h3 className="font-bold text-sepia">Cliente</h3>
                    <p className="mt-2 text-sepia/80">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-sepia/70">{selectedOrder.customer.phone}</p>
                    <p className="text-sm text-sepia/70">
                      {selectedOrder.customer.email ?? "Sin email registrado"}
                    </p>
                    <p className="mt-1 text-sm text-sepia/70">
                      {selectedOrder.customer.address ?? "Sin direccion"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-crema p-4">
                    <h3 className="font-bold text-sepia">Resumen</h3>
                    <p className="mt-2 text-sepia/80">Subtotal: {formatCurrency(selectedOrder.subtotal)}</p>
                    <p className="text-sepia/80">Total: {formatCurrency(selectedOrder.total)}</p>
                    <p className="text-sepia/80">Items: {selectedOrder.items.length}</p>
                    <p className="text-sepia/80">
                      Pago: {paymentMethodLabel[selectedPayment?.method ?? "efectivo"]}
                    </p>
                    <p className="text-sepia/80">
                      Referencia: {getOrderPaymentRef(selectedOrder)}
                    </p>
                    {selectedPayment?.method === "transferencia" ? (
                      <p className="text-sepia/80">
                        Uso en transferencia: {getOrderPaymentRef(selectedOrder)}
                      </p>
                    ) : null}
                  </div>
                </div>

              {selectedPayment?.method === "transferencia" ? (
                <div className="rounded-2xl bg-crema p-4">
                  <h3 className="font-bold text-sepia">Transferencia</h3>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <p className="text-sm text-sepia/80">
                      <span className="font-semibold text-sepia">Banco:</span>{" "}
                      {selectedPayment.bank ?? "Sin banco"}
                    </p>
                    <p className="text-sm text-sepia/80">
                      <span className="font-semibold text-sepia">Titular:</span>{" "}
                      {selectedPayment.accountHolder ?? "Sin titular"}
                    </p>
                    <p className="text-sm text-sepia/80">
                      <span className="font-semibold text-sepia">Cuenta:</span>{" "}
                      {selectedPayment.accountNumber ?? "Sin cuenta"}
                    </p>
                    <p className="text-sm text-sepia/80">
                      <span className="font-semibold text-sepia">CLABE:</span>{" "}
                      {selectedPayment.clabe ?? "Sin CLABE"}
                    </p>
                  </div>
                </div>
              ) : null}

              {selectedOrder.notes ? (
                <div className="rounded-2xl bg-crema p-4">
                  <h3 className="font-bold text-sepia">Notas</h3>
                  <p className="mt-2 text-sepia/80">{selectedOrder.notes}</p>
                </div>
              ) : null}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-sepia">Items del pedido</h3>
                  {!editMode ? (
                    <button
                      type="button"
                      onClick={() => void openEditMode()}
                      className="rounded-xl border border-beige-tostado/30 px-3 py-1.5 text-sm font-semibold text-sepia transition-colors hover:border-terracota hover:text-terracota"
                    >
                      Editar items
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={closeEditMode}
                      className="flex items-center gap-1 text-sm font-semibold text-sepia/60 transition-colors hover:text-rojo-quemado"
                    >
                      <X size={14} /> Cancelar
                    </button>
                  )}
                </div>

                {!editMode ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={`${selectedOrder.id}-${item.productId}`}
                        className="flex justify-between rounded-xl border border-transparent px-3 py-2 transition-all hover:border-beige-tostado/20 hover:bg-crema"
                      >
                        <p className="text-sepia">
                          {item.quantity} x {item.productName}
                        </p>
                        <p className="font-semibold text-terracota">
                          {formatCurrency(item.lineTotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Draft items */}
                    <div className="space-y-2">
                      {draftItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 rounded-xl border border-beige-tostado/20 bg-crema px-3 py-2"
                        >
                          <p className="flex-1 text-sm font-semibold text-sepia truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-sepia/55 shrink-0">
                            {formatCurrency(item.unitPrice)} c/u
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setDraftQty(item.productId, Math.max(1, item.quantity - 1))}
                              className="rounded-lg border border-beige-tostado/30 p-1 text-sepia hover:border-terracota hover:text-terracota transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => setDraftQty(item.productId, Math.max(1, Number(e.target.value)))}
                              className="w-12 rounded-lg border border-beige-tostado/30 bg-white px-2 py-1 text-center text-sm font-bold text-sepia focus:border-terracota focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setDraftQty(item.productId, item.quantity + 1)}
                              className="rounded-lg border border-beige-tostado/30 p-1 text-sepia hover:border-terracota hover:text-terracota transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="w-16 text-right text-sm font-bold text-terracota shrink-0">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeDraftItem(item.productId)}
                            className="shrink-0 rounded-lg p-1 text-sepia/40 hover:text-rojo-quemado transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add product row */}
                    {catalogProducts.length > 0 ? (
                      <div className="flex gap-2 rounded-xl border border-dashed border-beige-tostado/40 bg-crema/50 p-3">
                        <select
                          value={addProductId}
                          onChange={(e) => setAddProductId(e.target.value)}
                          className="flex-1 rounded-xl border border-beige-tostado/30 bg-white px-3 py-2 text-sm text-sepia focus:border-terracota focus:outline-none"
                        >
                          <option value="">Agregar producto...</option>
                          {catalogProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {formatCurrency(p.price)}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={1}
                          value={addQuantity}
                          onChange={(e) => setAddQuantity(Math.max(1, Number(e.target.value)))}
                          className="w-16 rounded-xl border border-beige-tostado/30 bg-white px-3 py-2 text-center text-sm font-bold text-sepia focus:border-terracota focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={addDraftProduct}
                          disabled={!addProductId}
                          className="rounded-xl bg-terracota px-4 py-2 text-sm font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : null}

                    {/* Total preview */}
                    <div className="flex items-center justify-between rounded-xl bg-crema px-4 py-3">
                      <span className="text-sm font-semibold text-sepia/70">Nuevo total</span>
                      <span className="text-lg font-bold text-sepia">
                        {formatCurrency(
                          draftItems.reduce((s, item) => s + item.unitPrice * item.quantity, 0),
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => void saveEditItems()}
                      disabled={editLoading || draftItems.length === 0}
                      className="w-full rounded-xl bg-terracota py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado disabled:opacity-50"
                    >
                      {editLoading ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
