"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export default function AdminDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const content = useMemo(
    () => (
      <div
        className={
          "fixed inset-0 " +
          (open ? "pointer-events-auto" : "pointer-events-none")
        }
        style={{ zIndex: 9999 }}
        aria-hidden={!open}
      >
        <div
          className={
            "absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity duration-200 " +
            (open ? "opacity-100" : "opacity-0")
          }
          onMouseDown={onClose}
        />

        <div
          className={
            "absolute right-0 top-0 h-full w-[min(520px,100vw)] transform transition-transform duration-200 " +
            (open ? "translate-x-0" : "translate-x-full")
          }
          style={{ zIndex: 10000 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex h-full flex-col border-l border-emerald-900/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between gap-3 border-b border-emerald-900/10 p-4 sm:p-5">
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold text-[var(--color-secondary)]">
                  {title}
                </div>
                <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  Details & actions
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-[var(--color-secondary)] hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    ),
    [children, onClose, open, title]
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
