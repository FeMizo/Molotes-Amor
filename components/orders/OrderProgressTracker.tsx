import { activeOrderFlow } from "@/lib/order-status";
import type { OrderStatus } from "@/types/order";

const getStepState = (currentStatus: OrderStatus, stepStatus: OrderStatus) => {
  if (currentStatus === "cancelado") {
    return "idle";
  }

  const currentIndex = activeOrderFlow.indexOf(currentStatus);
  const stepIndex = activeOrderFlow.indexOf(stepStatus);

  if (stepIndex < currentIndex) {
    return "complete";
  }
  if (stepIndex === currentIndex) {
    return "current";
  }
  return "idle";
};

export const OrderProgressTracker = ({
  status,
}: {
  status: OrderStatus;
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-5 gap-2">
      {activeOrderFlow.map((step) => {
        const state = getStepState(status, step);

        return (
          <div key={step} className="space-y-2">
            <div
              className={`h-2 rounded-full ${
                state === "complete"
                  ? "bg-olivo"
                  : state === "current"
                    ? "bg-terracota"
                    : "bg-beige-tostado/25"
              }`}
            />
            <p
              className={`text-[11px] font-semibold uppercase tracking-wide ${
                state === "idle" ? "text-sepia/45" : "text-sepia"
              }`}
            >
              {step.replace("-", " ")}
            </p>
          </div>
        );
      })}
    </div>
    {status === "cancelado" ? (
      <p className="text-sm font-semibold text-rojo-quemado">
        Este pedido se marco como cancelado y salio del flujo operativo.
      </p>
    ) : null}
  </div>
);
