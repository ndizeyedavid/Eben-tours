"use client";

import { ReactNode, useEffect } from "react";

export default function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onClose,
  footerNote,
}: {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onClose: () => void;
  footerNote?: ReactNode;
}) {
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
        onMouseDown={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="border-b border-emerald-900/10 p-4">
            <div className="text-base font-extrabold text-[var(--color-secondary)]">
              {title}
            </div>
            {description ? (
              <div className="mt-2 text-sm font-semibold text-[var(--muted)]">
                {description}
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={
                  variant === "danger"
                    ? "rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700"
                    : "rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                }
              >
                {confirmLabel}
              </button>
            </div>

            {footerNote ? (
              <div className="mt-3 text-xs font-semibold text-[var(--muted)]">
                {footerNote}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
