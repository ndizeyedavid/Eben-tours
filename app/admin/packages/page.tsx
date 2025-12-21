"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminConfirmModal from "@/app/components/admin/AdminConfirmModal";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";
import axios from "axios";

type PackageStatus = "active" | "draft";

type PackageRow = {
  id: string;
  externalId?: string | null;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  minGroup?: number;
  maxGroup: number;
  featured: boolean;
  status: PackageStatus;
  updatedAt: string;

  description?: string | null;
  destination?: string | null;
  coverImageUrl?: string | null;
  galleryImages?: any;
  priceNote?: string | null;
  itinerary?: any;
  inclusions?: any;
  exclusions?: any;
  info?: any;
  supportPhone?: string | null;
  supportEmail?: string | null;
  whatsappUrl?: string | null;
};

function StatusPill({ status }: { status: PackageStatus }) {
  const styles =
    status === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : "bg-amber-50 text-amber-700 border-amber-900/10";
  const label = status === "active" ? "Active" : "Draft";

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

function newId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function toRow(p: any): PackageRow {
  const updated = p?.updatedAt ? new Date(p.updatedAt) : null;

  return {
    id: String(p.id),
    externalId: p.externalId ?? null,
    title: String(p.title ?? ""),
    location: String(p.location ?? ""),
    durationDays: Number(p.durationDays ?? 0),
    price: Number(p.price ?? 0),
    minGroup:
      p.minGroup === undefined || p.minGroup === null
        ? undefined
        : Number(p.minGroup),
    maxGroup: Number(p.maxGroup ?? 0),
    featured: Boolean(p.featured ?? false),
    status: p.status === "draft" ? "draft" : "active",
    updatedAt: updated ? updated.toISOString().slice(0, 10) : "",

    description: p.description ?? null,
    destination: p.destination ?? null,
    coverImageUrl: p.coverImageUrl ?? null,
    galleryImages: p.galleryImages ?? null,
    priceNote: p.priceNote ?? null,
    itinerary: p.itinerary ?? null,
    inclusions: p.inclusions ?? null,
    exclusions: p.exclusions ?? null,
    info: p.info ?? null,
    supportPhone: p.supportPhone ?? null,
    supportEmail: p.supportEmail ?? null,
    whatsappUrl: p.whatsappUrl ?? null,
  };
}

export default function AdminPackagesPage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<null | string>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<null | string>(null);

  const editing = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const [draftTitle, setDraftTitle] = useState("");
  const [draftLocation, setDraftLocation] = useState("");
  const [draftDuration, setDraftDuration] = useState("3");
  const [draftPrice, setDraftPrice] = useState("450");
  const [draftMinGroup, setDraftMinGroup] = useState("2");
  const [draftMaxGroup, setDraftMaxGroup] = useState("10");
  const [draftFeatured, setDraftFeatured] = useState(false);
  const [draftStatus, setDraftStatus] = useState<PackageStatus>("active");

  const [draftDescription, setDraftDescription] = useState("");
  const [draftDestination, setDraftDestination] = useState("");
  const [draftCoverImageUrl, setDraftCoverImageUrl] = useState("");
  const [draftGalleryUrls, setDraftGalleryUrls] = useState("");
  const [draftPriceNote, setDraftPriceNote] = useState("");

  const [draftItineraryJson, setDraftItineraryJson] = useState("");
  const [draftInclusionsJson, setDraftInclusionsJson] = useState("");
  const [draftExclusionsJson, setDraftExclusionsJson] = useState("");
  const [draftInfoJson, setDraftInfoJson] = useState("");

  const [draftSupportPhone, setDraftSupportPhone] = useState("");
  const [draftSupportEmail, setDraftSupportEmail] = useState("");
  const [draftWhatsappUrl, setDraftWhatsappUrl] = useState("");

  const fetchPackages = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/packages");
      const list = Array.isArray(res.data?.packages) ? res.data.packages : [];
      setRows(list.map(toRow));
    } catch (e: any) {
      setLoadError(
        e?.response?.data?.error
          ? String(e.response.data.error)
          : "Could not load packages."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setDraftTitle("");
    setDraftLocation("");
    setDraftDuration("3");
    setDraftPrice("450");
    setDraftMinGroup("2");
    setDraftMaxGroup("10");
    setDraftFeatured(false);
    setDraftStatus("active");

    setDraftDescription("");
    setDraftDestination("");
    setDraftCoverImageUrl("");
    setDraftGalleryUrls("");
    setDraftPriceNote("");

    setDraftItineraryJson(
      JSON.stringify(
        [
          {
            time: "04:00 AM",
            title: "Departure",
            description: "Describe the departure step...",
          },
        ],
        null,
        2
      )
    );
    setDraftInclusionsJson(JSON.stringify([], null, 2));
    setDraftExclusionsJson(JSON.stringify([], null, 2));
    setDraftInfoJson(
      JSON.stringify(
        {
          whatToBring: "",
          physicalRequirements: "",
          bestTimeToVisit: "",
        },
        null,
        2
      )
    );

    setDraftSupportPhone("(+250) 786 140 897");
    setDraftSupportEmail("administration@ebenconnections.com");
    setDraftWhatsappUrl("https://wa.me/+250786140897");
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
      setDraftMinGroup(String(pkg.minGroup ?? 2));
      setDraftMaxGroup(String(pkg.maxGroup));
      setDraftFeatured(pkg.featured);
      setDraftStatus(pkg.status);

      setDraftDescription(pkg.description ?? "");
      setDraftDestination(pkg.destination ?? "");
      setDraftCoverImageUrl(pkg.coverImageUrl ?? "");
      setDraftGalleryUrls(
        Array.isArray(pkg.galleryImages)
          ? pkg.galleryImages.filter(Boolean).join("\n")
          : ""
      );
      setDraftPriceNote(pkg.priceNote ?? "");

      setDraftItineraryJson(
        pkg.itinerary ? JSON.stringify(pkg.itinerary, null, 2) : "[]"
      );
      setDraftInclusionsJson(
        pkg.inclusions ? JSON.stringify(pkg.inclusions, null, 2) : "[]"
      );
      setDraftExclusionsJson(
        pkg.exclusions ? JSON.stringify(pkg.exclusions, null, 2) : "[]"
      );
      setDraftInfoJson(pkg.info ? JSON.stringify(pkg.info, null, 2) : "{}");

      setDraftSupportPhone(pkg.supportPhone ?? "");
      setDraftSupportEmail(pkg.supportEmail ?? "");
      setDraftWhatsappUrl(pkg.whatsappUrl ?? "");
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
    const minGroup = Number(draftMinGroup);
    const maxGroup = Number(draftMaxGroup);

    if (!draftTitle.trim()) return;
    if (!draftLocation.trim()) return;
    if (!Number.isFinite(durationDays) || durationDays <= 0) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(minGroup) || minGroup <= 0) return;
    if (!Number.isFinite(maxGroup) || maxGroup <= 0) return;

    const galleryImages = draftGalleryUrls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    let itinerary: any = undefined;
    let inclusions: any = undefined;
    let exclusions: any = undefined;
    let info: any = undefined;

    try {
      itinerary = draftItineraryJson.trim()
        ? JSON.parse(draftItineraryJson)
        : undefined;
      inclusions = draftInclusionsJson.trim()
        ? JSON.parse(draftInclusionsJson)
        : undefined;
      exclusions = draftExclusionsJson.trim()
        ? JSON.parse(draftExclusionsJson)
        : undefined;
      info = draftInfoJson.trim() ? JSON.parse(draftInfoJson) : undefined;
    } catch {
      setToast("Invalid JSON in details sections");
      window.setTimeout(() => setToast(null), 2200);
      return;
    }

    const actionLabel = editingId ? "updated" : "created";
    const friendlyId = editingId
      ? editing?.externalId ?? editingId
      : newId("PKG");
    const time = "Just now";

    (async () => {
      try {
        if (!editingId) {
          const res = await axios.post("/api/admin/packages", {
            title: draftTitle.trim(),
            location: draftLocation.trim(),
            durationDays,
            price,
            minGroup,
            maxGroup,
            featured: draftFeatured,
            status: draftStatus,

            description: draftDescription.trim()
              ? draftDescription.trim()
              : null,
            destination: draftDestination.trim()
              ? draftDestination.trim()
              : null,
            coverImageUrl: draftCoverImageUrl.trim()
              ? draftCoverImageUrl.trim()
              : null,
            galleryImages,
            priceNote: draftPriceNote.trim() ? draftPriceNote.trim() : null,

            itinerary,
            inclusions,
            exclusions,
            info,

            supportPhone: draftSupportPhone.trim()
              ? draftSupportPhone.trim()
              : null,
            supportEmail: draftSupportEmail.trim()
              ? draftSupportEmail.trim()
              : null,
            whatsappUrl: draftWhatsappUrl.trim()
              ? draftWhatsappUrl.trim()
              : null,
          });

          const created = res.data?.package ? toRow(res.data.package) : null;
          if (created) setRows((prev) => [created, ...prev]);
        } else {
          const res = await axios.patch(`/api/admin/packages/${editingId}`, {
            title: draftTitle.trim(),
            location: draftLocation.trim(),
            durationDays,
            price,
            minGroup,
            maxGroup,
            featured: draftFeatured,
            status: draftStatus,

            description: draftDescription.trim()
              ? draftDescription.trim()
              : null,
            destination: draftDestination.trim()
              ? draftDestination.trim()
              : null,
            coverImageUrl: draftCoverImageUrl.trim()
              ? draftCoverImageUrl.trim()
              : null,
            galleryImages,
            priceNote: draftPriceNote.trim() ? draftPriceNote.trim() : null,

            itinerary,
            inclusions,
            exclusions,
            info,

            supportPhone: draftSupportPhone.trim()
              ? draftSupportPhone.trim()
              : null,
            supportEmail: draftSupportEmail.trim()
              ? draftSupportEmail.trim()
              : null,
            whatsappUrl: draftWhatsappUrl.trim()
              ? draftWhatsappUrl.trim()
              : null,
          });

          const updated = res.data?.package ? toRow(res.data.package) : null;
          if (updated)
            setRows((prev) =>
              prev.map((r) => (r.id === editingId ? updated : r))
            );
        }

        setToast(editingId ? "Package updated" : "Package created");
        window.setTimeout(() => setToast(null), 1800);
        setDrawerOpen(false);

        pushAudit({
          entity: "package",
          action: editingId ? "update" : "create",
          actor: "Fab",
          summary: `${friendlyId} ${actionLabel}: ${draftTitle.trim()}`,
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
      } catch {
        setToast("Save failed");
        window.setTimeout(() => setToast(null), 1800);
      }
    })();
  }, [
    draftDuration,
    draftFeatured,
    draftMinGroup,
    draftLocation,
    draftMaxGroup,
    draftPrice,
    draftStatus,
    draftTitle,
    draftCoverImageUrl,
    draftDescription,
    draftDestination,
    draftExclusionsJson,
    draftGalleryUrls,
    draftInclusionsJson,
    draftInfoJson,
    draftItineraryJson,
    draftPriceNote,
    draftSupportEmail,
    draftSupportPhone,
    draftWhatsappUrl,
    editingId,
    editing,
    pushActivity,
    pushAudit,
    pushNotification,
  ]);

  const openDelete = useCallback((id: string) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTargetId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!confirmTargetId) return;
    const deleted = rows.find((r) => r.id === confirmTargetId);
    const time = "Just now";

    (async () => {
      try {
        await axios.delete(`/api/admin/packages/${confirmTargetId}`);
        setRows((prev) => prev.filter((r) => r.id !== confirmTargetId));
        setToast("Package deleted");
        window.setTimeout(() => setToast(null), 1800);
        closeDelete();

        pushAudit({
          entity: "package",
          action: "delete",
          actor: "Fab",
          summary: `${deleted?.externalId ?? confirmTargetId} deleted${
            deleted ? `: ${deleted.title}` : ""
          }`,
          time,
          href: "/admin/packages",
        });
        pushActivity({
          title: "Package deleted",
          meta: deleted ? deleted.title : confirmTargetId,
          time,
          tone: "red",
          href: "/admin/packages",
        });
        pushNotification({
          type: "system",
          title: "Package deleted",
          body: deleted ? deleted.title : confirmTargetId,
          time,
          href: "/admin/packages",
        });
      } catch {
        setToast("Delete failed");
        window.setTimeout(() => setToast(null), 1800);
      }
    })();
  }, [
    closeDelete,
    confirmTargetId,
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
        accessorKey: "externalId",
        header: "ID",
        cell: ({ row }) => (
          <span className="text-xs font-extrabold text-[var(--color-secondary)]">
            {row.original.externalId ?? row.original.id}
          </span>
        ),
      },
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
              onClick={() => openDelete(row.original.id)}
              className="rounded-xl border border-red-900/10 bg-white px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [openDelete, openEdit]
  );

  return (
    <>
      <AdminConfirmModal
        open={confirmOpen}
        title="Delete package?"
        description={
          <span>
            This will remove the package from the list. You can re-add it later.
          </span>
        }
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        variant="danger"
        onClose={closeDelete}
        onConfirm={confirmDelete}
        footerNote="Mock action (UI state only)."
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
                  Min group
                </span>
                <input
                  type="number"
                  min={1}
                  value={draftMinGroup}
                  onChange={(e) => setDraftMinGroup(e.target.value)}
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

            <div className="mt-3 grid grid-cols-1! gap-3!">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Price note
                </span>
                <input
                  value={draftPriceNote}
                  onChange={(e) => setDraftPriceNote(e.target.value)}
                  placeholder="e.g. Based on minimum 2 people"
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              DETAILS PAGE CONTENT
            </div>
            <div className="mt-3 grid grid-cols-1! gap-3!">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Short description (hero)
                </span>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <div className="grid grid-cols-1! gap-3! sm:grid-cols-2">
                <label className="grid grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Destination
                  </span>
                  <input
                    value={draftDestination}
                    onChange={(e) => setDraftDestination(e.target.value)}
                    placeholder="e.g. Rwanda"
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  />
                </label>
                <label className="grid grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Cover image URL
                  </span>
                  <input
                    value={draftCoverImageUrl}
                    onChange={(e) => setDraftCoverImageUrl(e.target.value)}
                    placeholder="/canopy_walk.jpg or https://..."
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  />
                </label>
              </div>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Gallery images (one URL per line)
                </span>
                <textarea
                  value={draftGalleryUrls}
                  onChange={(e) => setDraftGalleryUrls(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Itinerary (JSON)
                </span>
                <textarea
                  value={draftItineraryJson}
                  onChange={(e) => setDraftItineraryJson(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 font-mono text-xs font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Inclusions (JSON)
                </span>
                <textarea
                  value={draftInclusionsJson}
                  onChange={(e) => setDraftInclusionsJson(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 font-mono text-xs font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Exclusions (JSON)
                </span>
                <textarea
                  value={draftExclusionsJson}
                  onChange={(e) => setDraftExclusionsJson(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 font-mono text-xs font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Info (JSON)
                </span>
                <textarea
                  value={draftInfoJson}
                  onChange={(e) => setDraftInfoJson(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 font-mono text-xs font-semibold text-[var(--color-secondary)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              SUPPORT CONTACTS
            </div>
            <div className="mt-3 grid grid-cols-1! gap-3! sm:grid-cols-2">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Support phone
                </span>
                <input
                  value={draftSupportPhone}
                  onChange={(e) => setDraftSupportPhone(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Support email
                </span>
                <input
                  value={draftSupportEmail}
                  onChange={(e) => setDraftSupportEmail(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>
              <label className="grid grid-cols-1! gap-1! sm:col-span-2">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  WhatsApp URL
                </span>
                <input
                  value={draftWhatsappUrl}
                  onChange={(e) => setDraftWhatsappUrl(e.target.value)}
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
          {loading ? (
            <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4 text-sm font-semibold text-[var(--muted)]">
              Loading packages...
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-red-900/10 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {loadError}
            </div>
          ) : (
            <AdminDataTable
              data={rows}
              columns={columns}
              searchPlaceholder="Search packages by id, name, location..."
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
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
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
                  </div>
                );
              }}
            />
          )}
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
