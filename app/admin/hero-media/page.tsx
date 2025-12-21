"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminDrawer from "@/app/components/admin/AdminDrawer";

type HeroMediaType = "image" | "video";

type HeroRow = {
  position: 1 | 2 | 3;
  type: HeroMediaType;
  url: string;
  enabled: boolean;
};

function emptyRow(position: 1 | 2 | 3): HeroRow {
  return { position, type: "video", url: "", enabled: true };
}

export default function AdminHeroMediaPage() {
  const [rows, setRows] = useState<HeroRow[]>([
    emptyRow(1),
    emptyRow(2),
    emptyRow(3),
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPos, setUploadingPos] = useState<null | 1 | 2 | 3>(null);
  const [toast, setToast] = useState<null | string>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<null | 1 | 2 | 3>(null);

  const editing = useMemo(
    () => rows.find((r) => r.position === editingPos) ?? null,
    [editingPos, rows]
  );

  const openEdit = useCallback((pos: 1 | 2 | 3) => {
    setEditingPos(pos);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const fetchRows = useCallback(async () => {
    const res = await axios.get<{
      rows: Array<{
        position: number;
        type: HeroMediaType;
        url: string;
        enabled: boolean;
      }>;
    }>("/api/admin/hero-media");

    const base = [emptyRow(1), emptyRow(2), emptyRow(3)];
    for (const r of res.data?.rows ?? []) {
      if (r.position === 1 || r.position === 2 || r.position === 3) {
        base[r.position - 1] = {
          position: r.position,
          type: r.type,
          url: r.url,
          enabled: Boolean(r.enabled),
        };
      }
    }

    setRows(base);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRows()
      .catch(() => {
        // ignore
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [fetchRows]);

  const saveAll = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await axios.put("/api/admin/hero-media", { rows });
      setToast("Saved");
      window.setTimeout(() => setToast(null), 1500);
      await fetchRows();
      setDrawerOpen(false);
    } catch {
      setToast("Failed to save");
      window.setTimeout(() => setToast(null), 1800);
    } finally {
      setSaving(false);
    }
  }, [fetchRows, rows, saving]);

  const uploadFile = useCallback(
    async (pos: 1 | 2 | 3, file: File) => {
      if (uploadingPos) return;
      setUploadingPos(pos);
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const sigRes = await fetch(
          `/api/admin/cloudinary-signature?timestamp=${timestamp}&folder=${encodeURIComponent(
            "eben-tours/hero"
          )}`
        );
        const sigData = await sigRes.json();
        if (!sigRes.ok)
          throw new Error(sigData?.error || "Failed to sign upload");

        const cloudName = String(sigData.cloudName || "");
        const apiKey = String(sigData.apiKey || "");
        const signature = String(sigData.signature || "");
        const folder = String(sigData.folder || "");

        if (!cloudName || !apiKey || !signature)
          throw new Error("Cloudinary is not configured");

        const isVideo = Boolean(file.type) && file.type.startsWith("video/");
        const type: HeroMediaType = isVideo ? "video" : "image";

        const form = new FormData();
        form.append("file", file);
        form.append("api_key", apiKey);
        form.append("timestamp", String(timestamp));
        form.append("signature", signature);
        if (folder) form.append("folder", folder);

        const endpoint = isVideo
          ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const uploadRes = await fetch(endpoint, {
          method: "POST",
          body: form,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData?.error?.message || "Upload failed");

        const secureUrl = String(uploadData?.secure_url || "");
        if (!secureUrl) throw new Error("Upload failed");

        setRows((prev) =>
          prev.map((r) =>
            r.position === pos
              ? {
                  ...r,
                  type,
                  url: secureUrl,
                }
              : r
          )
        );
      } catch (err: any) {
        setToast(err?.message || "Failed to upload");
        window.setTimeout(() => setToast(null), 1800);
      } finally {
        setUploadingPos(null);
      }
    },
    [uploadingPos]
  );

  const updateEditing = useCallback(
    (patch: Partial<HeroRow>) => {
      if (!editingPos) return;
      setRows((prev) =>
        prev.map((r) => (r.position === editingPos ? { ...r, ...patch } : r))
      );
    },
    [editingPos]
  );

  return (
    <>
      <AdminDrawer
        open={drawerOpen}
        title={editing ? `Hero slide ${editing.position}` : "Hero slide"}
        onClose={closeDrawer}
      >
        {editing ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <div className="text-xs font-extrabold text-[var(--muted)]">
                MEDIA
              </div>

              <div className="mt-3 grid grid-cols-1! gap-3!">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-extrabold text-[var(--muted)]">
                    Upload (image/video)
                  </div>
                  <label className="cursor-pointer rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50">
                    {uploadingPos === editing.position
                      ? "Uploading..."
                      : "Upload"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      disabled={uploadingPos === editing.position}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        void uploadFile(editing.position, f);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <label className="grid grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Type
                  </span>
                  <select
                    value={editing.type}
                    onChange={(e) =>
                      updateEditing({ type: e.target.value as HeroMediaType })
                    }
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </label>

                <label className="grid grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    URL
                  </span>
                  <input
                    value={editing.url}
                    onChange={(e) => updateEditing({ url: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]">
                  <input
                    type="checkbox"
                    checked={editing.enabled}
                    onChange={(e) =>
                      updateEditing({ enabled: e.target.checked })
                    }
                  />
                  Enabled
                </label>

                {editing.url ? (
                  editing.type === "video" ? (
                    <div className="overflow-hidden rounded-xl border border-emerald-900/10 bg-[#f6f8f7]">
                      <video
                        src={editing.url}
                        controls
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-emerald-900/10 bg-[#f6f8f7]">
                      <img
                        src={editing.url}
                        alt="Hero"
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  )
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDrawer}
                disabled={saving}
                className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAll}
                disabled={saving}
                className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : null}
      </AdminDrawer>

      <div className="p-6">
        <div className="mb-4">
          <div className="text-lg font-extrabold text-[var(--color-secondary)]">
            Hero Media
          </div>
          <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Upload up to 3 slides (image or video). Only enabled slides will
            show on the homepage hero.
          </div>
        </div>

        {toast ? (
          <div className="mb-4 rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)]">
            {toast}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rows.map((r) => (
            <div
              key={r.position}
              className="rounded-2xl border border-emerald-900/10 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-extrabold text-[var(--muted)]">
                  SLIDE {r.position}
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(r.position)}
                  disabled={loading}
                  className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                >
                  Edit
                </button>
              </div>

              <div className="mt-3 text-sm font-semibold text-[var(--color-secondary)]">
                {r.enabled ? "Enabled" : "Disabled"} • {r.type}
              </div>

              <div className="mt-3">
                {r.url ? (
                  r.type === "video" ? (
                    <video
                      src={r.url}
                      muted
                      playsInline
                      className="h-40 w-full rounded-xl border border-emerald-900/10 object-cover"
                    />
                  ) : (
                    <img
                      src={r.url}
                      alt={`Slide ${r.position}`}
                      className="h-40 w-full rounded-xl border border-emerald-900/10 object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-xl border border-emerald-900/10 bg-[#f6f8f7] text-sm font-semibold text-[var(--muted)]">
                    No media uploaded
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
