"use client";

import Quill from "quill";
import { useEffect, useMemo, useRef } from "react";

export type TipTapDoc = Record<string, any>;

function ToolbarButton({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white"
          : "rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
      }
    >
      {label}
    </button>
  );
}

export default function AdminRichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: TipTapDoc | null;
  onChange: (doc: TipTapDoc) => void;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const quillOptions = useMemo(
    () => ({
      theme: "snow",
      placeholder: placeholder ?? "Write your post...",
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    }),
    [placeholder]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (quillRef.current) return;

    const q = new Quill(containerRef.current, quillOptions);
    quillRef.current = q;

    if (value) {
      try {
        q.setContents(value as any);
      } catch {
        // ignore invalid initial value
      }
    }

    const handler = () => {
      onChange(q.getContents() as any);
    };

    q.on("text-change", handler);

    return () => {
      q.off("text-change", handler);
      quillRef.current = null;
    };
  }, [onChange, quillOptions]);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const current = q.getContents();
    const currentStr = JSON.stringify(current);
    const nextStr = JSON.stringify(value ?? null);
    if (currentStr !== nextStr && value) {
      try {
        q.setContents(value as any);
      } catch {
        // ignore invalid value updates
      }
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-emerald-900/10 bg-white">
        <div
          ref={containerRef}
          className="min-h-[260px] rounded-2xl bg-white text-sm font-semibold text-[var(--color-secondary)]"
        />
      </div>

      <div className="text-xs font-semibold text-[var(--muted)]">
        Stored as Quill Delta JSON (DB-friendly).
      </div>
    </div>
  );
}
