"use client";

import { useMemo, useState } from "react";

import { useAdminOrders } from "@/hooks/use-admin-orders";
import type { OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = ["pendiente", "confirmado", "preparando", "entregado", "cancelado"];

const statusStyles: Record<OrderStatus, string> = {
  pendiente: "bg-mostaza/20 text-canela border-mostaza/30",
  confirmado: "bg-sky-100 text-sky-700 border-sky-200",
  preparando: "bg-orange-100 text-orange-700 border-orange-200",
  entregado: "bg-olivo/15 text-olivo border-olivo/25",
  cancelado: "bg-rojo-quemado/10 text-rojo-quemado border-rojo-quemado/20",
};

export const AdminOrdersManager = () => {
  const { orders, loading, error, updateStatus } = useAdminOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const target = `${order.id} ${order.customer.name} ${order.customer.phone} ${order.status}`.toLowerCase();
      return target.includes(query);
    });
  }, [orders, filter]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0];

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr] gap-8">
      <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold text-sepia">Pedidos</h2>
          <span className="text-sm text-sepia/70">{loading ? "Cargando..." : `${orders.length} pedidos`}</span>
        </div>
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Buscar por id, cliente o estado"
          className="w-full px-4 py-3 bg-crema border border-beige-tostado/30 rounded-xl focus:outline-none focus:border-terracota mb-4"
        />
        {error ? <p className="text-rojo-quemado font-semibold mb-3">{error}</p> : null}
        <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
          {filteredOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrderId(order.id)}
              className={`w-full text-left border rounded-xl p-4 transition-colors ${
                selectedOrder?.id === order.id
                  ? "border-terracota bg-beige-tostado/20"
                  : "border-beige-tostado/25 hover:border-beige-tostado/60"
              }`}
            >
              <p className="font-bold text-sepia">{order.id}</p>
              <p className="text-sm text-sepia/70 mb-2">{order.customer.name}</p>
              <p>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-terracota font-semibold mt-1">${order.total}</p>
            </button>
          ))}
          {!loading && filteredOrders.length === 0 ? (
            <p className="text-sepia/60 text-center py-8">No hay pedidos.</p>
          ) : null}
        </div>
      </article>

      <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
        {!selectedOrder ? (
          <p className="text-sepia/60">Selecciona un pedido para ver detalle.</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-sepia">{selectedOrder.id}</h2>
                <span
                  className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[selectedOrder.status]}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <select
                value={selectedOrder.status}
                onChange={(event) => void changeStatus(selectedOrder.id, event.target.value as OrderStatus)}
                className="px-3 py-2 bg-crema border border-beige-tostado/30 rounded-lg focus:outline-none focus:border-terracota"
              >
                {statuses.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {feedback ? <p className="text-olivo font-semibold">{feedback}</p> : null}
            {feedbackError ? <p className="text-rojo-quemado font-semibold">{feedbackError}</p> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-crema rounded-xl p-4">
                <h3 className="font-bold text-sepia mb-2">Cliente</h3>
                <p className="text-sepia/80">{selectedOrder.customer.name}</p>
                <p className="text-sepia/70 text-sm">{selectedOrder.customer.phone}</p>
                {selectedOrder.customer.address ? (
                  <p className="text-sepia/70 text-sm">{selectedOrder.customer.address}</p>
                ) : null}
              </div>
              <div className="bg-crema rounded-xl p-4">
                <h3 className="font-bold text-sepia mb-2">Resumen</h3>
                <p className="text-sepia/80">Fecha: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p className="text-sepia/80">Subtotal: ${selectedOrder.subtotal}</p>
                <p className="text-sepia/80">Total: ${selectedOrder.total}</p>
              </div>
            </div>

            {selectedOrder.notes ? (
              <div className="bg-crema rounded-xl p-4">
                <h3 className="font-bold text-sepia mb-2">Notas</h3>
                <p className="text-sepia/80">{selectedOrder.notes}</p>
              </div>
            ) : null}

            <div>
              <h3 className="font-bold text-sepia mb-3">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between border-b border-beige-tostado/20 pb-2">
                    <p className="text-sepia">
                      {item.quantity} x {item.productName}
                    </p>
                    <p className="font-semibold text-terracota">${item.lineTotal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
