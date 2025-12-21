"use client";

import Link from "next/link";
import { useAdminOps } from "./AdminOpsProvider";

function badge(entity: string) {
  if (entity === "booking")
    return "bg-amber-50 text-amber-700 border-amber-900/10";
  if (entity === "package")
    return "bg-emerald-50 text-emerald-700 border-emerald-900/10";
  if (entity === "blog") return "bg-blue-50 text-blue-700 border-blue-900/10";
  if (entity === "customer")
    return "bg-violet-50 text-violet-700 border-violet-900/10";
  return "bg-slate-50 text-slate-700 border-slate-900/10";
}

export default function AdminAuditLog() {
  const { audit } = useAdminOps();

  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-[var(--color-secondary)]">
            Audit log
          </div>
          <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
            Track admin actions across the system
          </div>
        </div>
        <div className="rounded-xl border border-emerald-900/10 bg-[#f6f8f7] px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]">
          Global
        </div>
      </div>

      <div className="space-y-2">
        {audit.slice(0, 8).map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${badge(
                      e.entity
                    )}`}
                  >
                    {e.entity.toUpperCase()}
                  </span>
                  <div className="truncate text-sm font-extrabold text-[var(--color-secondary)]">
                    {e.summary}
                  </div>
                </div>
                <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  {e.actor} • {e.action.replaceAll("_", " ")}
                </div>
              </div>

              <div className="shrink-0 text-[10px] font-extrabold text-[var(--muted)]">
                {e.time}
              </div>
            </div>

            {e.href ? (
              <div className="mt-2">
                <Link
                  href={e.href}
                  className="text-xs font-extrabold text-[var(--color-primary)] hover:underline"
                >
                  Open
                </Link>
              </div>
            ) : null}
          </div>
        ))}

        {audit.length === 0 ? (
          <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4 text-sm font-semibold text-[var(--muted)]">
            No audit events yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
