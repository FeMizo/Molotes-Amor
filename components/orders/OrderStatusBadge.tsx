import { orderStatusMeta } from "@/lib/order-status";
import type { OrderStatus } from "@/types/order";

export const OrderStatusBadge = ({
  status,
  compact = false,
}: {
  status: OrderStatus;
  compact?: boolean;
}) => {
  const meta = orderStatusMeta[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold uppercase tracking-wide ${meta.badgeClassName} ${
        compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      }`}
    >
      {meta.label}
    </span>
  );
};
