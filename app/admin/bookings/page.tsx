"use client";

import { ColumnDef } from "@tanstack/react-table";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import AdminConfirmModal from "@/app/components/admin/AdminConfirmModal";
import { useCallback, useMemo, useState } from "react";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";
import { exportBrandedXlsx } from "@/app/components/admin/export/brandedXlsx";

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

type BookingExportRow = {
  booking_id: string;
  customer: string;
  package: string;
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
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<BookingRow[]>(bookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState<null | "copied" | "failed">(null);
  const [contacted, setContacted] = useState<null | "message" | "email">(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftDate, setDraftDate] = useState<string>("");
  const [draftTravellers, setDraftTravellers] = useState<string>("");
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

  const printBookingForm = useCallback(
    (id: string) => {
      const time = "Just now";
      pushAudit({
        entity: "booking",
        // @ts-ignore
        action: "print",
        actor: "Fab",
        summary: `Printed booking form for ${id}`,
        time,
        href: `/admin/bookings/print/${id}`,
      });
      pushActivity({
        title: "Booking form printed",
        meta: `${id} • Print booking form`,
        time,
        tone: "blue",
        href: `/admin/bookings/print/${id}`,
      });
      pushNotification({
        type: "booking",
        title: "Booking form printed",
        body: `Booking form opened for ${id}`,
        time,
        href: `/admin/bookings/print/${id}`,
      });

      const url = `/admin/bookings/print/${id}?auto=1`;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [pushActivity, pushAudit, pushNotification]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setCopied(null);
    setContacted(null);
    setIsEditing(false);
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

      const time = "Just now";
      const label = status[0].toUpperCase() + status.slice(1);
      pushAudit({
        entity: "booking",
        action: "status_change",
        actor: "Fab",
        summary: `${selected.id} marked as ${label}`,
        time,
        href: "/admin/bookings",
      });
      pushActivity({
        title: "Booking status updated",
        meta: `${selected.id} • ${selected.packageName} • ${label}`,
        time,
        tone:
          status === "cancelled"
            ? "red"
            : status === "pending"
            ? "amber"
            : "emerald",
        href: "/admin/bookings",
      });
      pushNotification({
        type: "booking",
        title: "Booking status updated",
        body: `${selected.customer} • ${selected.packageName} → ${label}`,
        time,
        href: "/admin/bookings",
      });
    },
    [pushActivity, pushAudit, pushNotification, selected]
  );

  const startEdit = useCallback(() => {
    if (!selected) return;
    setDraftDate(selected.date);
    setDraftTravellers(String(selected.travellers));
    setIsEditing(true);
  }, [selected]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraftDate("");
    setDraftTravellers("");
  }, []);

  const saveEdit = useCallback(() => {
    if (!selected) return;
    const travellersNum = Number(draftTravellers);
    if (!draftDate) return;
    if (!Number.isFinite(travellersNum) || travellersNum <= 0) return;

    setRows((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? { ...r, date: draftDate, travellers: travellersNum }
          : r
      )
    );
    setIsEditing(false);

    const time = "Just now";
    pushAudit({
      entity: "booking",
      action: "update",
      actor: "Fab",
      summary: `${selected.id} details updated (date/travellers)`,
      time,
      href: "/admin/bookings",
    });
    pushActivity({
      title: "Booking details updated",
      meta: `${selected.id} • ${draftDate} • ${travellersNum} travellers`,
      time,
      tone: "blue",
      href: "/admin/bookings",
    });
  }, [draftDate, draftTravellers, pushActivity, pushAudit, selected]);

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

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, []);

  const exportBookings = useCallback(
    ({
      format,
      exportRows,
      scope,
    }: {
      format: "csv" | "xlsx";
      exportRows: BookingRow[];
      scope: "selected" | "filtered";
    }) => {
      const exportData: BookingExportRow[] = exportRows.map((r) => ({
        booking_id: r.id,
        customer: r.customer,
        package: r.packageName,
        date: r.date,
        travellers: r.travellers,
        amount: r.amount,
        status: r.status,
      }));

      const stamp = new Date().toISOString().slice(0, 10);
      const base = `bookings_${scope}_${stamp}`;

      if (format === "csv") {
        const headers: (keyof BookingExportRow)[] = [
          "booking_id",
          "customer",
          "package",
          "date",
          "travellers",
          "amount",
          "status",
        ];

        const esc = (v: unknown) => {
          const s = String(v ?? "");
          if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
          return s;
        };

        const csv = [
          headers.join(","),
          ...exportData.map((row) => headers.map((h) => esc(row[h])).join(",")),
        ].join("\n");

        downloadBlob(
          new Blob([csv], { type: "text/csv;charset=utf-8" }),
          `${base}.csv`
        );
      } else {
        void exportBrandedXlsx<BookingExportRow>({
          filename: `${base}.xlsx`,
          sheetName: "Bookings",
          title: "Bookings Report",
          companyName: "Eben Tours",
          logoUrl: "/Logo-011.png",
          meta: [
            { label: "Generated", value: stamp },
            { label: "Scope", value: scope },
            { label: "Rows", value: String(exportRows.length) },
          ],
          columns: [
            { header: "Booking ID", key: "booking_id", width: 16 },
            { header: "Customer", key: "customer", width: 22 },
            { header: "Package", key: "package", width: 28 },
            { header: "Date", key: "date", width: 14 },
            { header: "Travellers", key: "travellers", width: 12 },
            { header: "Amount", key: "amount", width: 12 },
            { header: "Status", key: "status", width: 14 },
          ],
          rows: exportData,
        });
      }

      const time = "Just now";
      const count = exportRows.length;
      pushAudit({
        entity: "booking",
        action: "export",
        actor: "Fab",
        summary: `Exported ${count} booking(s) (${scope}) as ${format.toUpperCase()}`,
        time,
        href: "/admin/bookings",
      });
      pushActivity({
        title: "Bookings exported",
        meta: `${count} row(s) • ${scope} • ${format.toUpperCase()}`,
        time,
        tone: "blue",
        href: "/admin/bookings",
      });
      pushNotification({
        type: "booking",
        title: "Export ready",
        body: `Downloaded ${count} booking(s) as ${format.toUpperCase()}`,
        time,
        href: "/admin/bookings",
      });
    },
    [downloadBlob, pushActivity, pushAudit, pushNotification]
  );

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
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openDrawer(row.original.id)}
              className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => printBookingForm(row.original.id)}
              className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
            >
              Print
            </button>
          </div>
        ),
      },
    ],
    [openDrawer, printBookingForm]
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

          const newStatus =
            confirmAction === "cancel" ? "cancelled" : "confirmed";
          setStatusBulk(confirmIds, newStatus);

          const time = "Just now";
          const label = newStatus[0].toUpperCase() + newStatus.slice(1);
          pushAudit({
            entity: "booking",
            action: "status_change",
            actor: "Fab",
            summary: `Bulk update: ${confirmIds.length} booking(s) marked as ${label}`,
            time,
            href: "/admin/bookings",
          });
          pushActivity({
            title: "Bulk booking update",
            meta: `${confirmIds.length} booking(s) → ${label}`,
            time,
            tone: newStatus === "cancelled" ? "red" : "emerald",
            href: "/admin/bookings",
          });

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
            <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-white p-4">
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
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <StatusBadge status={selected.status} />
                  <div className="mt-2 text-xs font-semibold text-[var(--muted)]">
                    Total:{" "}
                    <span className="font-extrabold text-[var(--color-secondary)]">
                      ${selected.amount.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 gap-3 rounded-2xl border border-emerald-900/10 bg-white p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-extrabold text-[var(--muted)]">
                    DETAILS
                  </div>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2!">
                  <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-3">
                    <div className="text-[11px] font-extrabold text-[var(--muted)]">
                      DATE
                    </div>
                    {!isEditing ? (
                      <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                        {selected.date}
                      </div>
                    ) : (
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(e) => setDraftDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-bold text-[var(--color-secondary)]"
                      />
                    )}
                  </div>
                  <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-3">
                    <div className="text-[11px] font-extrabold text-[var(--muted)]">
                      TRAVELLERS
                    </div>
                    {!isEditing ? (
                      <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                        {selected.travellers}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={1}
                        value={draftTravellers}
                        onChange={(e) => setDraftTravellers(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-bold text-[var(--color-secondary)]"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2!">
              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                <div className="mb-3 text-xs font-extrabold text-[var(--muted)]">
                  CONTACT
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setContacted("message");
                      window.setTimeout(() => setContacted(null), 1800);
                    }}
                    className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Send message
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setContacted("email");
                      window.setTimeout(() => setContacted(null), 1800);
                    }}
                    className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
                  >
                    Email
                  </button>
                </div>
                {contacted === "message" && (
                  <div className="mt-2 text-xs font-semibold text-emerald-700">
                    Message queued (mock).
                  </div>
                )}
                {contacted === "email" && (
                  <div className="mt-2 text-xs font-semibold text-emerald-700">
                    Email draft opened (mock).
                  </div>
                )}
                <div className="mt-3 text-xs font-semibold text-[var(--muted)]">
                  Next step: wire this to WhatsApp / email provider.
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
                ACTIVITY
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "Booking created",
                    meta: `Requested for ${selected.date}`,
                    tone: "bg-emerald-700",
                  },
                  {
                    title:
                      selected.status === "confirmed"
                        ? "Payment confirmed"
                        : selected.status === "cancelled"
                        ? "Booking cancelled"
                        : "Awaiting confirmation",
                    meta:
                      selected.status === "confirmed"
                        ? "Status set to Confirmed"
                        : selected.status === "cancelled"
                        ? "Status set to Cancelled"
                        : "Status is Pending",
                    tone:
                      selected.status === "cancelled"
                        ? "bg-red-600"
                        : selected.status === "confirmed"
                        ? "bg-emerald-700"
                        : "bg-amber-500",
                  },
                  {
                    title: "Review & follow-up",
                    meta: "Send message or email to finalize details",
                    tone: "bg-[var(--color-secondary)]",
                  },
                ].map((item, idx, arr) => (
                  <div key={idx} className="relative pl-7">
                    {idx !== arr.length - 1 ? (
                      <div className="absolute left-[9px] top-[18px] h-[calc(100%-10px)] w-px bg-emerald-900/10" />
                    ) : null}
                    <div
                      className={`absolute left-0 top-[6px] h-5 w-5 rounded-full ${item.tone}`}
                    />
                    <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-3">
                      <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                        {item.meta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <div className="mb-3 text-xs font-extrabold text-[var(--muted)]">
                QUICK ACTIONS
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => printBookingForm(selected.id)}
                  className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                >
                  Print booking form
                </button>
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

              const selectedRows = table
                .getSelectedRowModel()
                .rows.map((r) => r.original as BookingRow);
              const filteredRows = table
                .getFilteredRowModel()
                .rows.map((r) => r.original as BookingRow);

              const exportRows =
                selectedRows.length > 0 ? selectedRows : filteredRows;
              const scope = selectedRows.length > 0 ? "selected" : "filtered";

              return (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      exportBookings({ format: "csv", exportRows, scope })
                    }
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      exportBookings({ format: "xlsx", exportRows, scope })
                    }
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Export XLSX
                  </button>

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
