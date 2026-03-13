"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

export const ModalShell = ({
  open,
  onClose,
  title,
  description,
  children,
  widthClassName = "max-w-3xl",
}: ModalShellProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-sepia/45 px-4 py-6 backdrop-blur-sm md:py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-start justify-center">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={`w-full ${widthClassName} rounded-[2rem] border border-beige-tostado/30 bg-white shadow-xl`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-beige-tostado/15 px-6 py-5 md:px-7">
            <div>
              <h2 id={titleId} className="text-3xl font-serif font-bold text-sepia">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="mt-2 max-w-2xl text-sm text-sepia/65">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-beige-tostado/25 bg-crema text-sepia transition-colors hover:border-terracota hover:text-terracota"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-6 py-5 md:px-7 md:py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
