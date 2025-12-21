"use client";

import Link from "next/link";
import { useAdminOps } from "./AdminOpsProvider";

function dotClass(tone?: "emerald" | "amber" | "red" | "blue") {
  if (tone === "red") return "bg-red-600";
  if (tone === "amber") return "bg-amber-500";
  if (tone === "blue") return "bg-blue-600";
  return "bg-emerald-700";
}

export default function AdminActivityFeed() {
  const { activities } = useAdminOps();

  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-[var(--color-secondary)]">
            Activity feed
          </div>
          <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
            Recent actions and operational events
          </div>
        </div>
        <div className="rounded-xl border border-emerald-900/10 bg-[#f6f8f7] px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]">
          Live
        </div>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 6).map((a, idx) => (
          <div key={a.id} className="relative pl-7">
            {idx !== Math.min(5, activities.length - 1) ? (
              <div className="absolute left-[9px] top-[18px] h-[calc(100%-10px)] w-px bg-emerald-900/10" />
            ) : null}
            <div
              className={`absolute left-0 top-[6px] h-5 w-5 rounded-full ${dotClass(
                a.tone
              )}`}
            />

            <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-[var(--color-secondary)]">
                    {a.title}
                  </div>
                  <div className="mt-1 truncate text-xs font-semibold text-[var(--muted)]">
                    {a.meta}
                  </div>
                </div>
                <div className="shrink-0 text-xs font-extrabold text-[var(--muted)]">
                  {a.time}
                </div>
              </div>

              {a.href ? (
                <div className="mt-2">
                  <Link
                    href={a.href}
                    className="text-xs font-extrabold text-[var(--color-primary)] hover:underline"
                  >
                    Open
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {activities.length === 0 ? (
          <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4 text-sm font-semibold text-[var(--muted)]">
            No activity yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
