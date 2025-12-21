"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";

type Segment = "vip" | "new" | "returning";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: Segment;
  bookings: number;
  lastBooking: string;
  lifetimeValue: number;
};

const seedCustomers: CustomerRow[] = [
  {
    id: "CUS-3001",
    name: "Aline M.",
    email: "aline@example.com",
    phone: "+250 788 000 001",
    segment: "vip",
    bookings: 3,
    lastBooking: "2025-12-10",
    lifetimeValue: 1650,
  },
  {
    id: "CUS-3002",
    name: "John K.",
    email: "johnk@example.com",
    phone: "+250 788 000 014",
    segment: "new",
    bookings: 1,
    lastBooking: "2025-12-18",
    lifetimeValue: 480,
  },
  {
    id: "CUS-3003",
    name: "Grace N.",
    email: "grace.n@example.com",
    phone: "+250 788 000 022",
    segment: "returning",
    bookings: 2,
    lastBooking: "2025-11-29",
    lifetimeValue: 960,
  },
];

function SegmentPill({ segment }: { segment: Segment }) {
  const styles =
    segment === "vip"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : segment === "new"
      ? "bg-amber-50 text-amber-700 border-amber-900/10"
      : "bg-blue-50 text-blue-700 border-blue-900/10";

  const label =
    segment === "vip" ? "VIP" : segment === "new" ? "New" : "Returning";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${styles}`}
    >
      {label}
    </span>
  );
}

export default function AdminCustomersPage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<CustomerRow[]>(seedCustomers);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<null | string>(null);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId]
  );

  const openProfile = useCallback(
    (id: string) => {
      setSelectedId(id);
      setDrawerOpen(true);
      setNote("");

      const time = "Just now";
      const customer = rows.find((r) => r.id === id);
      pushAudit({
        entity: "customer",
        action: "update",
        actor: "Fab",
        summary: `Viewed customer profile: ${customer ? customer.name : id}`,
        time,
        href: "/admin/customers",
      });
      pushActivity({
        title: "Customer opened",
        meta: customer ? `${customer.name} • ${customer.segment}` : id,
        time,
        tone: "blue",
        href: "/admin/customers",
      });
      pushNotification({
        type: "system",
        title: "Customer profile opened",
        body: customer ? customer.name : id,
        time,
        href: "/admin/customers",
      });
    },
    [pushActivity, pushAudit, pushNotification, rows]
  );

  const closeProfile = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const saveNote = useCallback(() => {
    if (!note.trim()) return;
    setToast("Note saved (mock)");
    window.setTimeout(() => setToast(null), 1800);
    setNote("");

    const time = "Just now";
    pushAudit({
      entity: "customer",
      action: "update",
      actor: "Fab",
      summary: `Internal note saved for ${
        selected ? selected.name : "customer"
      }`,
      time,
      href: "/admin/customers",
    });
    pushActivity({
      title: "Customer note saved",
      meta: selected ? selected.name : "Customer",
      time,
      tone: "emerald",
      href: "/admin/customers",
    });
    pushNotification({
      type: "system",
      title: "Customer note saved",
      body: selected ? selected.name : "Customer",
      time,
      href: "/admin/customers",
    });
  }, [note, pushActivity, pushAudit, pushNotification, selected]);

  const kpis = useMemo(() => {
    const vip = rows.filter((r) => r.segment === "vip").length;
    const total = rows.length;
    const ltv =
      total === 0
        ? 0
        : Math.round(rows.reduce((a, r) => a + r.lifetimeValue, 0) / total);
    return { vip, total, ltv };
  }, [rows]);

  const columns: ColumnDef<CustomerRow>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate font-extrabold text-[var(--color-secondary)]">
              {row.original.name}
            </div>
            <div className="mt-0.5 truncate text-xs font-semibold text-[var(--muted)]">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "segment",
        header: "Segment",
        filterFn: (row, id, value) => {
          if (!value || value === "all") return true;
          return row.getValue(id) === value;
        },
        cell: ({ row }) => <SegmentPill segment={row.original.segment} />,
      },
      {
        accessorKey: "bookings",
        header: "Bookings",
        cell: (info) => (
          <span className="text-sm font-extrabold text-[var(--color-secondary)]">
            {Number(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "lastBooking",
        header: "Last booking",
        cell: (info) => (
          <span className="text-xs font-semibold text-[var(--muted)]">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "lifetimeValue",
        header: "LTV",
        cell: (info) => (
          <span className="text-sm font-extrabold text-[var(--color-secondary)]">
            ${Number(info.getValue()).toFixed(0)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openProfile(row.original.id)}
            className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
          >
            View
          </button>
        ),
      },
    ],
    [openProfile]
  );

  return (
    <>
      <AdminDrawer
        open={drawerOpen}
        title={selected ? selected.name : "Customer"}
        onClose={closeProfile}
      >
        {!selected ? (
          <div className="text-sm font-semibold text-[var(--muted)]">
            No customer selected.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-[var(--muted)]">
                    CONTACT
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                    {selected.email}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                    {selected.phone}
                  </div>
                </div>
                <div className="shrink-0">
                  <SegmentPill segment={selected.segment} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                <div className="text-xs font-extrabold text-[var(--muted)]">
                  BOOKINGS
                </div>
                <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
                  {selected.bookings}
                </div>
                <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  Last: {selected.lastBooking}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                <div className="text-xs font-extrabold text-[var(--muted)]">
                  LIFETIME VALUE
                </div>
                <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
                  ${selected.lifetimeValue.toFixed(0)}
                </div>
                <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  Estimated (mock)
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <div className="mb-2 text-xs font-extrabold text-[var(--muted)]">
                QUICK ACTIONS
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setToast("Message queued (mock)");
                    window.setTimeout(() => setToast(null), 1800);

                    const time = "Just now";
                    pushAudit({
                      entity: "customer",
                      action: "message",
                      actor: "Fab",
                      summary: `Message queued for ${selected.name}`,
                      time,
                      href: "/admin/customers",
                    });
                    pushActivity({
                      title: "Message queued",
                      meta: selected.name,
                      time,
                      tone: "amber",
                      href: "/admin/customers",
                    });
                    pushNotification({
                      type: "message",
                      title: "Message queued",
                      body: selected.name,
                      time,
                      href: "/admin/customers",
                    });
                  }}
                  className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                >
                  Send message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToast("Email draft opened (mock)");
                    window.setTimeout(() => setToast(null), 1800);

                    const time = "Just now";
                    pushAudit({
                      entity: "customer",
                      action: "message",
                      actor: "Fab",
                      summary: `Email draft opened for ${selected.name}`,
                      time,
                      href: "/admin/customers",
                    });
                    pushActivity({
                      title: "Email draft opened",
                      meta: selected.name,
                      time,
                      tone: "blue",
                      href: "/admin/customers",
                    });
                    pushNotification({
                      type: "message",
                      title: "Email draft opened",
                      body: selected.name,
                      time,
                      href: "/admin/customers",
                    });
                  }}
                  className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
                >
                  Email
                </button>
              </div>
              <div className="mt-3 text-xs font-semibold text-[var(--muted)]">
                Next step: wire to WhatsApp, email, and CRM.
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <div className="mb-2 text-xs font-extrabold text-[var(--muted)]">
                INTERNAL NOTES
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder="Add a note for future follow-up..."
                className="w-full resize-none rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={saveNote}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
                >
                  Save note
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
            Customers
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            View customer profiles, segments, and engagement.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              TOTAL
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.total}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              VIP
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.vip}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              AVG LTV
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              ${kpis.ltv}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
          <AdminDataTable
            data={rows}
            columns={columns}
            searchPlaceholder="Search customers by name or email..."
            pageSize={8}
            getRowId={(row) => (row as CustomerRow).id}
            renderToolbar={(table) => {
              const segCol = table.getColumn("segment");
              const value = (segCol?.getFilterValue() as string) ?? "all";

              return (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[var(--muted)]">
                      Segment
                    </span>
                    <select
                      value={value}
                      onChange={(e) => segCol?.setFilterValue(e.target.value)}
                      className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
                    >
                      <option value="all">All</option>
                      <option value="vip">VIP</option>
                      <option value="new">New</option>
                      <option value="returning">Returning</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      segCol?.setFilterValue("all");
                      table.setGlobalFilter("");
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

        {toast ? (
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-3 text-sm font-extrabold text-emerald-700">
            {toast}
          </div>
        ) : null}
      </div>
    </>
  );
}
