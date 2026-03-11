"use client";

import { useState } from "react";

import { useAdminInventory } from "@/hooks/use-admin-inventory";

export const AdminInventoryManager = () => {
  const { rows, loading, error, updateRow } = useAdminInventory();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const saveRow = async (payload: {
    productId: string;
    stock: number;
    minStock?: number;
    allowBackorder: boolean;
    available: boolean;
  }) => {
    setFeedback(null);
    setFeedbackError(null);
    try {
      await updateRow(payload);
      setFeedback("Inventario actualizado.");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "No se pudo actualizar inventario.");
    }
  };

  return (
    <article className="bg-white rounded-2xl p-6 border border-beige-tostado/30 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif font-bold text-sepia">Inventario</h2>
        <span className="text-sm text-sepia/70">{loading ? "Cargando..." : `${rows.length} productos`}</span>
      </div>
      {feedback ? <p className="text-olivo font-semibold mb-3">{feedback}</p> : null}
      {feedbackError ? <p className="text-rojo-quemado font-semibold mb-3">{feedbackError}</p> : null}
      {error ? <p className="text-rojo-quemado font-semibold mb-3">{error}</p> : null}

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.productId}
            className="border border-beige-tostado/20 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[1.6fr_auto] gap-4 items-center"
          >
            <div>
              <h3 className="font-bold text-sepia">{row.productName}</h3>
              <p className="text-sm text-sepia/70">
                {row.category} · Estado:{" "}
                <span
                  className={
                    row.status === "agotado"
                      ? "text-rojo-quemado font-semibold"
                      : row.status === "poco-stock"
                        ? "text-mostaza font-semibold"
                        : "text-olivo font-semibold"
                  }
                >
                  {row.status}
                </span>
              </p>
            </div>

            <InventoryRowEditor
              productId={row.productId}
              stock={row.stock}
              minStock={row.minStock}
              allowBackorder={row.allowBackorder}
              available={row.available}
              onSave={saveRow}
            />
          </div>
        ))}
      </div>
    </article>
  );
};

const InventoryRowEditor = ({
  productId,
  stock,
  minStock,
  allowBackorder,
  available,
  onSave,
}: {
  productId: string;
  stock: number;
  minStock?: number;
  allowBackorder: boolean;
  available: boolean;
  onSave: (payload: {
    productId: string;
    stock: number;
    minStock?: number;
    allowBackorder: boolean;
    available: boolean;
  }) => void;
}) => {
  const [stockValue, setStockValue] = useState(String(stock));
  const [minValue, setMinValue] = useState(minStock !== undefined ? String(minStock) : "");
  const [allowBackorderValue, setAllowBackorderValue] = useState(allowBackorder);
  const [availableValue, setAvailableValue] = useState(available);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        value={stockValue}
        onChange={(event) => setStockValue(event.target.value)}
        className="w-20 px-3 py-2 bg-crema border border-beige-tostado/30 rounded-lg focus:outline-none focus:border-terracota"
        title="Stock"
      />
      <input
        type="number"
        value={minValue}
        onChange={(event) => setMinValue(event.target.value)}
        className="w-24 px-3 py-2 bg-crema border border-beige-tostado/30 rounded-lg focus:outline-none focus:border-terracota"
        title="Minimo"
      />
      <label className="text-xs font-semibold text-sepia flex items-center gap-1">
        <input
          type="checkbox"
          checked={allowBackorderValue}
          onChange={(event) => setAllowBackorderValue(event.target.checked)}
        />
        Backorder
      </label>
      <label className="text-xs font-semibold text-sepia flex items-center gap-1">
        <input
          type="checkbox"
          checked={availableValue}
          onChange={(event) => setAvailableValue(event.target.checked)}
        />
        Disponible
      </label>
      <button
        type="button"
        onClick={() =>
          onSave({
            productId,
            stock: Number(stockValue),
            minStock: minValue ? Number(minValue) : undefined,
            allowBackorder: allowBackorderValue,
            available: availableValue,
          })
        }
        className="px-3 py-2 rounded-lg bg-terracota hover:bg-rojo-quemado text-crema text-sm font-semibold transition-colors"
      >
        Guardar
      </button>
    </div>
  );
};
