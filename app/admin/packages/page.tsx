"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminConfirmModal from "@/app/components/admin/AdminConfirmModal";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";
import axios from "axios";

type PackageStatus = "active" | "draft" | "disabled";

type PackageRow = {
  id: string;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  maxGroup: number;
  featured: boolean;
  status: PackageStatus;
  updatedAt: string;
};

function StatusPill({ status }: { status: PackageStatus }) {
  const styles =
    status === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : status === "draft"
      ? "bg-amber-50 text-amber-700 border-amber-900/10"
      : "bg-slate-100 text-slate-700 border-slate-900/10";
  const label =
    status === "active" ? "Active" : status === "draft" ? "Draft" : "Disabled";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${styles}`}
    >
      {label}
    </span>
  );
}

function FeaturedPill({ featured }: { featured: boolean }) {
  if (!featured) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-900/10 bg-white px-2.5 py-1 text-xs font-extrabold text-[var(--color-secondary)]">
      Featured
    </span>
  );
}

export default function AdminPackagesPage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<null | string>(null);

  const fetchRows = useCallback(async () => {
    const res = await axios.get<{ rows: PackageRow[] }>("/api/admin/packages");
    setRows(res.data.rows);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRows()
      .catch(() => {
        // ignore for now; Clerk middleware handles redirect
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [fetchRows]);

  const editing = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const [draftTitle, setDraftTitle] = useState("");
  const [draftLocation, setDraftLocation] = useState("");
  const [draftDuration, setDraftDuration] = useState("3");
  const [draftPrice, setDraftPrice] = useState("450");
  const [draftMaxGroup, setDraftMaxGroup] = useState("10");
  const [draftFeatured, setDraftFeatured] = useState(false);
  const [draftStatus, setDraftStatus] = useState<PackageStatus>("active");

  const openCreate = useCallback(() => {
    setEditingId(null);
    setDraftTitle("");
    setDraftLocation("");
    setDraftDuration("3");
    setDraftPrice("450");
    setDraftMaxGroup("10");
    setDraftFeatured(false);
    setDraftStatus("active");
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback(
    (id: string) => {
      const pkg = rows.find((r) => r.id === id);
      if (!pkg) return;
      setEditingId(id);
      setDraftTitle(pkg.title);
      setDraftLocation(pkg.location);
      setDraftDuration(String(pkg.durationDays));
      setDraftPrice(String(pkg.price));
      setDraftMaxGroup(String(pkg.maxGroup));
      setDraftFeatured(pkg.featured);
      setDraftStatus(pkg.status);
      setDrawerOpen(true);
    },
    [rows]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const savePackage = useCallback(() => {
    const durationDays = Number(draftDuration);
    const price = Number(draftPrice);
    const maxGroup = Number(draftMaxGroup);

    if (!draftTitle.trim()) return;
    if (!draftLocation.trim()) return;
    if (!Number.isFinite(durationDays) || durationDays <= 0) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(maxGroup) || maxGroup <= 0) return;

    const time = "Just now";
    const actionLabel = editingId ? "updated" : "created";
    const targetId = editingId ?? "";

    const payload = {
      title: draftTitle.trim(),
      location: draftLocation.trim(),
      durationDays,
      price,
      maxGroup,
      featured: draftFeatured,
      status: draftStatus,
    };

    if (editingId) {
      void axios
        .patch(`/api/admin/packages/${editingId}`, payload)
        .then(() => fetchRows())
        .catch(() => {
          // ignore
        });
    } else {
      void axios
        .post(`/api/admin/packages`, payload)
        .then(() => fetchRows())
        .catch(() => {
          // ignore
        });
    }

    setToast(editingId ? "Package updated" : "Package created");
    window.setTimeout(() => setToast(null), 1800);
    setDrawerOpen(false);

    pushAudit({
      entity: "package",
      action: editingId ? "update" : "create",
      actor: "Fab",
      summary: `${
        targetId ? `${targetId} ` : ""
      }${actionLabel}: ${draftTitle.trim()}`,
      time,
      href: "/admin/packages",
    });
    pushActivity({
      title: editingId ? "Package updated" : "Package created",
      meta: `${draftTitle.trim()} • ${draftStatus} • $${price.toFixed(0)}`,
      time,
      tone: draftStatus === "draft" ? "amber" : "emerald",
      href: "/admin/packages",
    });
    pushNotification({
      type: "system",
      title: editingId ? "Package updated" : "Package created",
      body: `${draftTitle.trim()} • ${draftStatus} • $${price.toFixed(0)}`,
      time,
      href: "/admin/packages",
    });
  }, [
    draftDuration,
    draftFeatured,
    draftLocation,
    draftMaxGroup,
    draftPrice,
    draftStatus,
    draftTitle,
    editingId,
    fetchRows,
    pushActivity,
    pushAudit,
    pushNotification,
  ]);

  const openDisable = useCallback((id: string) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  }, []);

  const closeDisable = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTargetId(null);
  }, []);

  const confirmDisable = useCallback(() => {
    if (!confirmTargetId) return;
    const time = "Just now";
    const deleted = rows.find((r) => r.id === confirmTargetId);

    void axios
      .delete(`/api/admin/packages/${confirmTargetId}`)
      .then(() => fetchRows())
      .then(() => {
        setToast("Package disabled");
        window.setTimeout(() => setToast(null), 1800);
        closeDisable();

        pushAudit({
          entity: "package",
          action: "update",
          actor: "Fab",
          summary: `${confirmTargetId} disabled${
            deleted ? `: ${deleted.title}` : ""
          }`,
          time,
          href: "/admin/packages",
        });
        pushActivity({
          title: "Package disabled",
          meta: deleted ? deleted.title : confirmTargetId,
          time,
          tone: "amber",
          href: "/admin/packages",
        });
        pushNotification({
          type: "system",
          title: "Package disabled",
          body: deleted ? deleted.title : confirmTargetId,
          time,
          href: "/admin/packages",
        });
      })
      .catch((err) => {
        const status = err?.response?.status as number | undefined;
        const msg = err?.response?.data?.error as string | undefined;
        if (status) {
          setToast(msg || "Disable failed");
          window.setTimeout(() => setToast(null), 2600);
          return;
        }

        setToast("Disable failed");
        window.setTimeout(() => setToast(null), 2600);
      });
  }, [
    closeDisable,
    confirmTargetId,
    fetchRows,
    pushActivity,
    pushAudit,
    pushNotification,
    rows,
  ]);

  const kpis = useMemo(() => {
    const active = rows.filter((r) => r.status === "active").length;
    const draft = rows.filter((r) => r.status === "draft").length;
    const featured = rows.filter((r) => r.featured).length;
    const avgPrice =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((acc, r) => acc + r.price, 0) / rows.length);

    return { active, draft, featured, avgPrice };
  }, [rows]);

  const columns: ColumnDef<PackageRow>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Package",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate font-extrabold text-[var(--color-secondary)]">
              {row.original.title}
            </div>
            <div className="mt-0.5 truncate text-xs font-semibold text-[var(--muted)]">
              {row.original.location}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "durationDays",
        header: "Duration",
        cell: (info) => (
          <span className="text-sm font-extrabold text-[var(--color-secondary)]">
            {Number(info.getValue())}d
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => (
          <span className="text-sm font-extrabold text-[var(--color-secondary)]">
            ${Number(info.getValue()).toFixed(0)}
          </span>
        ),
      },
      {
        accessorKey: "maxGroup",
        header: "Max group",
        cell: (info) => (
          <span className="text-sm font-extrabold text-[var(--color-secondary)]">
            {Number(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
          if (!value || value === "all") return true;
          return row.getValue(id) === value;
        },
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={row.original.status} />
            <FeaturedPill featured={row.original.featured} />
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: (info) => (
          <span className="text-xs font-semibold text-[var(--muted)]">
            {String(info.getValue())}
          </span>
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
              onClick={() => openEdit(row.original.id)}
              className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => openDisable(row.original.id)}
              disabled={row.original.status === "disabled"}
              className="rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Disable
            </button>
          </div>
        ),
      },
    ],
    [openDisable, openEdit]
  );

  return (
    <>
      <AdminConfirmModal
        open={confirmOpen}
        title="Disable package?"
        description={
          <span>
            This will disable the package. Existing bookings remain intact.
          </span>
        }
        confirmLabel="Yes, disable"
        cancelLabel="Cancel"
        variant="default"
        onClose={closeDisable}
        onConfirm={confirmDisable}
        footerNote="Disabled packages can be re-enabled later."
      />

      <AdminDrawer
        open={drawerOpen}
        title={editing ? `Edit: ${editing.title}` : "Create package"}
        onClose={closeDrawer}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              BASICS
            </div>
            <div className="mt-3 grid grid-cols-2! gap-3!">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Title
                </span>
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. Volcano & Gorilla Trekking"
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Location
                </span>
                <input
                  value={draftLocation}
                  onChange={(e) => setDraftLocation(e.target.value)}
                  placeholder="e.g. Ruhengeri, Rwanda"
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              PRICING & CAPACITY
            </div>
            <div className="mt-3 grid grid-cols-1! gap-3! sm:grid-cols-3">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Duration (days)
                </span>
                <input
                  type="number"
                  min={1}
                  value={draftDuration}
                  onChange={(e) => setDraftDuration(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Price
                </span>
                <input
                  type="number"
                  min={1}
                  value={draftPrice}
                  onChange={(e) => setDraftPrice(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Max group
                </span>
                <input
                  type="number"
                  min={1}
                  value={draftMaxGroup}
                  onChange={(e) => setDraftMaxGroup(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              VISIBILITY
            </div>
            <div className="mt-3 grid grid-cols-1! gap-3! sm:grid-cols-2">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Status
                </span>
                <select
                  value={draftStatus}
                  onChange={(e) =>
                    setDraftStatus(e.target.value as PackageStatus)
                  }
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-emerald-900/10 bg-[#f6f8f7] px-3 py-2">
                <span className="text-sm font-extrabold text-[var(--color-secondary)]">
                  Featured
                </span>
                <input
                  type="checkbox"
                  checked={draftFeatured}
                  onChange={(e) => setDraftFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={savePackage}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
            >
              {editing ? "Save changes" : "Create package"}
            </button>
          </div>

          <div className="text-xs font-semibold text-[var(--muted)]">
            This is mock state for now. Next step is wiring to your database /
            API.
          </div>
        </div>
      </AdminDrawer>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
              Packages
            </h1>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
              Create, price, and publish tour packages.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
          >
            New package
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4!">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              ACTIVE
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.active}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              DRAFTS
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.draft}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              FEATURED
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.featured}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              AVG PRICE
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              ${kpis.avgPrice}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
          <AdminDataTable
            data={rows}
            columns={columns}
            searchPlaceholder="Search packages by name, location..."
            pageSize={8}
            getRowId={(row) => (row as PackageRow).id}
            renderToolbar={(table) => {
              const statusCol = table.getColumn("status");
              const value = (statusCol?.getFilterValue() as string) ?? "all";

              return (
                <div className="flex flex-wrap items-center gap-2">
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
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      statusCol?.setFilterValue("all");
                      table.setGlobalFilter("");
                    }}
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void fetchRows();
                    }}
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
    </>
  );
}
