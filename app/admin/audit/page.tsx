"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";

type AuditEntity = "booking" | "package" | "blog" | "customer" | "system";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "status_change"
  | "publish"
  | "unpublish"
  | "message"
  | "export"
  | "print";

type AuditRow = {
  id: string;
  entity: AuditEntity;
  action: AuditAction;
  summary: string;
  href?: string | null;
  actor: string;
  createdAt: string;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function Pill({ tone, label }: { tone: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${tone}`}
    >
      {label}
    </span>
  );
}

function EntityPill({ entity }: { entity: AuditEntity }) {
  const tone =
    entity === "booking"
      ? "bg-blue-50 text-blue-700 border-blue-900/10"
      : entity === "package"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : entity === "blog"
      ? "bg-amber-50 text-amber-700 border-amber-900/10"
      : entity === "customer"
      ? "bg-violet-50 text-violet-700 border-violet-900/10"
      : "bg-slate-100 text-slate-700 border-slate-900/10";

  return <Pill tone={tone} label={entity.toUpperCase()} />;
}

function ActionPill({ action }: { action: AuditAction }) {
  const tone =
    action === "delete"
      ? "bg-red-50 text-red-700 border-red-900/10"
      : action === "publish"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : action === "unpublish"
      ? "bg-amber-50 text-amber-700 border-amber-900/10"
      : action === "export" || action === "print"
      ? "bg-blue-50 text-blue-700 border-blue-900/10"
      : "bg-slate-100 text-slate-700 border-slate-900/10";

  return <Pill tone={tone} label={action.replace(/_/g, " ").toUpperCase()} />;
}

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [entity, setEntity] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [q, setQ] = useState<string>("");

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/audit", {
        params: { entity, action, q },
      });
      setRows((res.data?.rows ?? []) as AuditRow[]);
    } catch (err: any) {
      setToast("Failed to load audit log");
      window.setTimeout(() => setToast(null), 1800);
    } finally {
      setLoading(false);
    }
  }, [action, entity, q]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const columns: ColumnDef<AuditRow>[] = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Time",
        cell: (info) => (
          <span className="text-xs font-semibold text-[var(--muted)]">
            {formatTime(String(info.getValue()))}
          </span>
        ),
      },
      {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => <EntityPill entity={row.original.entity} />,
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => <ActionPill action={row.original.action} />,
      },
      {
        accessorKey: "summary",
        header: "Summary",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-[var(--color-secondary)]">
              {row.original.summary}
            </div>
            <div className="mt-0.5 truncate text-xs font-semibold text-[var(--muted)]">
              Actor: {row.original.actor}
            </div>
          </div>
        ),
      },
      {
        id: "link",
        header: "",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.href ? (
            <Link
              href={row.original.href}
              className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Open
            </Link>
          ) : null,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
            Audit Log
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Track admin operations across bookings, packages, customers, and
            more.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
        <AdminDataTable
          data={rows}
          columns={columns}
          searchPlaceholder="Search audit by summary or actor..."
          pageSize={12}
          loading={loading}
          getRowId={(row) => (row as AuditRow).id}
          renderToolbar={() => {
            return (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  disabled={loading}
                  className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
                >
                  <option value="all">All entities</option>
                  <option value="booking">Booking</option>
                  <option value="package">Package</option>
                  <option value="blog">Blog</option>
                  <option value="customer">Customer</option>
                  <option value="system">System</option>
                </select>

                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  disabled={loading}
                  className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
                >
                  <option value="all">All actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="status_change">Status change</option>
                  <option value="publish">Publish</option>
                  <option value="unpublish">Unpublish</option>
                  <option value="message">Message</option>
                  <option value="export">Export</option>
                  <option value="print">Print</option>
                </select>

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter (server)"
                  disabled={loading}
                  className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
                />

                <button
                  type="button"
                  onClick={() => void fetchRows()}
                  disabled={loading}
                  className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            );
          }}
        />
      </div>

      {toast ? (
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-3 text-sm font-extrabold text-emerald-700">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
