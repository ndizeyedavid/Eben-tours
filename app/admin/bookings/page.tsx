"use client";

import { ColumnDef } from "@tanstack/react-table";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import AdminConfirmModal from "@/app/components/admin/AdminConfirmModal";
import { useCallback, useMemo, useState } from "react";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type BookingRow = {
  id: string;
  customer: string;
  packageName: string;
  date: string;
  travellers: number;
  amount: number;
  status: BookingStatus;
};

const bookings: BookingRow[] = [
  {
    id: "BK-1024",
    customer: "Aline M.",
    packageName: "Volcano & Gorilla Trekking",
    date: "2025-01-12",
    travellers: 2,
    amount: 650,
    status: "confirmed",
  },
  {
    id: "BK-1025",
    customer: "John K.",
    packageName: "Akagera Big Five Safari",
    date: "2025-01-15",
    travellers: 4,
    amount: 480,
    status: "pending",
  },
  {
    id: "BK-1026",
    customer: "Fatima S.",
    packageName: "Nyungwe Chimpanzee Trek",
    date: "2025-01-20",
    travellers: 1,
    amount: 420,
    status: "cancelled",
  },
  {
    id: "BK-1027",
    customer: "Moses T.",
    packageName: "Volcano & Gorilla Trekking",
    date: "2025-02-03",
    travellers: 3,
    amount: 650,
    status: "confirmed",
  },
  {
    id: "BK-1028",
    customer: "Grace N.",
    packageName: "Akagera Big Five Safari",
    date: "2025-02-07",
    travellers: 2,
    amount: 480,
    status: "pending",
  },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : status === "pending"
      ? "bg-amber-50 text-amber-700 border-amber-900/10"
      : "bg-red-50 text-red-700 border-red-900/10";

  const label = status[0].toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${styles}`}
    >
      {label}
    </span>
  );
}

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>(bookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState<null | "copied" | "failed">(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmIds, setConfirmIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<
    "confirm" | "cancel" | null
  >(null);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId]
  );

  const openDrawer = useCallback((id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setCopied(null);
  }, []);

  const copyId = useCallback(async () => {
    if (!selected) return;
    setCopied(null);
    try {
      await navigator.clipboard.writeText(selected.id);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied(null), 1800);
  }, [selected]);

  const setStatus = useCallback(
    (status: BookingStatus) => {
      if (!selected) return;
      setRows((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status } : r))
      );
    },
    [selected]
  );

  const setStatusBulk = useCallback((ids: string[], status: BookingStatus) => {
    if (ids.length === 0) return;
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
    );
  }, []);

  const openBulkConfirm = useCallback(
    (action: "confirm" | "cancel", ids: string[]) => {
      setConfirmAction(action);
      setConfirmIds(ids);
      setConfirmOpen(true);
    },
    []
  );

  const closeBulkConfirm = useCallback(() => {
    setConfirmOpen(false);
    setConfirmIds([]);
    setConfirmAction(null);
  }, []);

  const columns: ColumnDef<BookingRow>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Booking ID",
        cell: (info) => (
          <span className="font-extrabold">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: "customer",
        header: "Customer",
      },
      {
        accessorKey: "packageName",
        header: "Package",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => {
          const raw = String(info.getValue());
          return <span className="text-[var(--muted)]">{raw}</span>;
        },
      },
      {
        accessorKey: "travellers",
        header: "Travellers",
        cell: (info) => (
          <span className="text-[var(--muted)]">{Number(info.getValue())}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => {
          const v = Number(info.getValue());
          return <span className="font-extrabold">${v.toFixed(0)}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
          if (!value || value === "all") return true;
          return row.getValue(id) === value;
        },
        cell: (info) => (
          <StatusBadge status={info.getValue() as BookingStatus} />
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openDrawer(row.original.id)}
            className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
          >
            View
          </button>
        ),
      },
    ],
    [openDrawer]
  );

  return (
    <>
      <AdminConfirmModal
        open={confirmOpen}
        title={
          confirmAction === "cancel"
            ? "Cancel selected bookings?"
            : "Confirm selected bookings?"
        }
        description={
          <span>
            You are about to {confirmAction === "cancel" ? "cancel" : "confirm"}{" "}
            <b>{confirmIds.length}</b> booking(s). This will update their
            status.
          </span>
        }
        confirmLabel={
          confirmAction === "cancel" ? "Yes, cancel" : "Yes, confirm"
        }
        variant={confirmAction === "cancel" ? "danger" : "default"}
        onClose={closeBulkConfirm}
        onConfirm={() => {
          if (!confirmAction) return;
          setStatusBulk(
            confirmIds,
            confirmAction === "cancel" ? "cancelled" : "confirmed"
          );
          closeBulkConfirm();
        }}
        footerNote="This is currently a mock action (UI state only)."
      />

      <AdminDrawer
        open={drawerOpen}
        title={selected ? `Booking ${selected.id}` : "Booking"}
        onClose={closeDrawer}
      >
        {!selected ? (
          <div className="text-sm font-semibold text-[var(--muted)]">
            No booking selected.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-[var(--muted)]">
                    CUSTOMER
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                    {selected.customer}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-[var(--muted)]">
                    Package: {selected.packageName}
                    <br />
                    Date: {selected.date}
                    <br />
                    Travellers: {selected.travellers}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                <div className="text-xs font-extrabold text-[var(--muted)]">
                  AMOUNT
                </div>
                <div className="mt-1 text-xl font-extrabold text-[var(--color-secondary)]">
                  ${selected.amount.toFixed(0)}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                <div className="text-xs font-extrabold text-[var(--muted)]">
                  BOOKING ID
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                    {selected.id}
                  </div>
                  <button
                    type="button"
                    onClick={copyId}
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Copy
                  </button>
                </div>
                {copied === "copied" && (
                  <div className="mt-2 text-xs font-semibold text-emerald-700">
                    Copied.
                  </div>
                )}
                {copied === "failed" && (
                  <div className="mt-2 text-xs font-semibold text-red-700">
                    Could not copy.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <div className="mb-3 text-xs font-extrabold text-[var(--muted)]">
                QUICK ACTIONS
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("confirmed")}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("cancelled")}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-3 text-xs font-semibold text-[var(--muted)]">
                These actions update the current UI only (mock). Next step is
                saving to a database.
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
            Bookings
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            View and manage booking requests.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
          <AdminDataTable
            data={rows}
            columns={columns}
            searchPlaceholder="Search bookings by id, customer, package..."
            pageSize={8}
            enableRowSelection
            getRowId={(row) => (row as BookingRow).id}
            renderToolbar={(table) => {
              const statusCol = table.getColumn("status");
              const value = (statusCol?.getFilterValue() as string) ?? "all";
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((r) => (r.original as BookingRow).id);

              return (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedIds.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          openBulkConfirm("confirm", selectedIds);
                        }}
                        className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                      >
                        Confirm selected
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openBulkConfirm("cancel", selectedIds);
                        }}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-red-700"
                      >
                        Cancel selected
                      </button>
                      <button
                        type="button"
                        onClick={() => table.resetRowSelection()}
                        className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                      >
                        Clear selection
                      </button>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[var(--muted)]">
                      Status
                    </span>
                    <select
                      value={value}
                      onChange={(e) =>
                        statusCol?.setFilterValue(e.target.value)
                      }
                      className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      statusCol?.setFilterValue("all");
                      table.setGlobalFilter("");
                      table.resetRowSelection();
                      closeBulkConfirm();
                    }}
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Reset
                  </button>
                </div>
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
