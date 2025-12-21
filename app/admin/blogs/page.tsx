"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminConfirmModal from "@/app/components/admin/AdminConfirmModal";
import AdminDataTable from "@/app/components/admin/table/AdminDataTable";
import AdminDrawer from "@/app/components/admin/AdminDrawer";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";
import AdminQuillEditor, {
  QuillDelta,
} from "@/app/components/admin/AdminQuillEditor";

type PostStatus = "draft" | "published";

type BlogRow = {
  id: string;
  title: string;
  category: string;
  author: string;
  imageUrl?: string | null;
  status: PostStatus;
  readTime: string;
  updatedAt: string;
  content: QuillDelta;
};

function StatusBadge({ status }: { status: PostStatus }) {
  const styles =
    status === "published"
      ? "bg-emerald-50 text-emerald-700 border-emerald-900/10"
      : "bg-amber-50 text-amber-700 border-amber-900/10";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold ${styles}`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

export default function AdminBlogsPage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<null | string>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/blogs");
      setRows((res.data?.rows ?? []) as BlogRow[]);
    } catch (err: any) {
      setToast("Failed to load posts");
      window.setTimeout(() => setToast(null), 1800);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const editing = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState("Travel Guides");
  const [draftStatus, setDraftStatus] = useState<PostStatus>("draft");
  const [draftReadTime, setDraftReadTime] = useState("6 min");
  const [draftImageUrl, setDraftImageUrl] = useState<string>("");
  const [draftContent, setDraftContent] = useState<QuillDelta>({
    ops: [{ insert: "\n" }],
  });

  const openCreate = useCallback(() => {
    setEditingId(null);
    setDraftTitle("");
    setDraftCategory("Travel Guides");
    setDraftStatus("draft");
    setDraftReadTime("6 min");
    setDraftImageUrl("");
    setDraftContent({ ops: [{ insert: "\n" }] });
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback(
    (id: string) => {
      const post = rows.find((r) => r.id === id);
      if (!post) return;
      setEditingId(id);
      setDraftTitle(post.title);
      setDraftCategory(post.category);
      setDraftStatus(post.status);
      setDraftReadTime(post.readTime);
      setDraftImageUrl(typeof post.imageUrl === "string" ? post.imageUrl : "");
      setDraftContent(post.content);
      setDrawerOpen(true);
    },
    [rows]
  );

  const uploadImage = useCallback(
    async (file: File) => {
      if (uploadingImage) return;
      setUploadingImage(true);
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const sigRes = await fetch(
          `/api/admin/cloudinary-signature?timestamp=${timestamp}`
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

        const form = new FormData();
        form.append("file", file);
        form.append("api_key", apiKey);
        form.append("timestamp", String(timestamp));
        form.append("signature", signature);
        if (folder) form.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: form,
          }
        );
        const uploadText = await uploadRes.text();
        const uploadData = (() => {
          try {
            return JSON.parse(uploadText);
          } catch {
            return null;
          }
        })();

        if (!uploadRes.ok) {
          const msg =
            (uploadData as any)?.error?.message ||
            (typeof uploadText === "string" && uploadText.trim()
              ? uploadText.trim()
              : "Upload failed");
          throw new Error(msg);
        }

        const secureUrl = String(uploadData?.secure_url || "");
        if (!secureUrl) throw new Error("Upload failed");

        setDraftImageUrl(secureUrl);
      } catch (err: any) {
        setToast(err?.message || "Failed to upload image");
        window.setTimeout(() => setToast(null), 1800);
      } finally {
        setUploadingImage(false);
      }
    },
    [uploadingImage]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const savePost = useCallback(async () => {
    if (saving) return;
    if (!draftTitle.trim()) return;

    const time = "Just now";

    setSaving(true);

    try {
      if (!editingId) {
        await axios.post("/api/admin/blogs", {
          title: draftTitle.trim(),
          category: draftCategory,
          author: "Admin",
          imageUrl: draftImageUrl.trim() || null,
          status: draftStatus,
          readTime: draftReadTime,
          content: draftContent,
        });
      } else {
        await axios.patch(`/api/admin/blogs/${editingId}`, {
          title: draftTitle.trim(),
          category: draftCategory,
          author: "Admin",
          imageUrl: draftImageUrl.trim() || null,
          status: draftStatus,
          readTime: draftReadTime,
          content: draftContent,
        });
      }

      await fetchRows();
      setToast(editingId ? "Post updated" : "Draft saved");
      window.setTimeout(() => setToast(null), 1800);
      setDrawerOpen(false);
    } catch (err: any) {
      setToast("Failed to save post");
      window.setTimeout(() => setToast(null), 1800);
      return;
    } finally {
      setSaving(false);
    }

    pushAudit({
      entity: "blog",
      action: editingId ? "update" : "create",
      actor: "Fab",
      summary: `${editingId ?? "New post"} ${
        editingId ? "updated" : "created"
      }: ${draftTitle.trim()}`,
      time,
      href: "/admin/blogs",
    });
    pushActivity({
      title: editingId ? "Blog post updated" : "Blog draft created",
      meta: `${draftTitle.trim()} • ${draftStatus} • ${draftCategory}`,
      time,
      tone: draftStatus === "published" ? "emerald" : "amber",
      href: "/admin/blogs",
    });
    pushNotification({
      type: "system",
      title: editingId ? "Blog updated" : "Blog draft created",
      body: `${draftTitle.trim()} • ${draftStatus} • ${draftCategory}`,
      time,
      href: "/admin/blogs",
    });
  }, [
    draftCategory,
    draftContent,
    draftImageUrl,
    draftReadTime,
    draftStatus,
    draftTitle,
    editingId,
    fetchRows,
    pushActivity,
    pushAudit,
    pushNotification,
    saving,
  ]);

  const togglePublish = useCallback(
    async (id: string) => {
      if (togglingId) return;
      const time = "Just now";
      const post = rows.find((r) => r.id === id);
      const current = post?.status ?? "draft";
      const next = current === "published" ? "draft" : "published";

      try {
        setTogglingId(id);
        await axios.patch(`/api/admin/blogs/${id}`, { status: next });
        await fetchRows();
        setToast("Status updated");
        window.setTimeout(() => setToast(null), 1800);
      } catch (err: any) {
        setToast("Failed to update status");
        window.setTimeout(() => setToast(null), 1800);
        return;
      } finally {
        setTogglingId(null);
      }

      pushAudit({
        entity: "blog",
        action: next === "published" ? "publish" : "unpublish",
        actor: "Fab",
        summary: `${id} ${next === "published" ? "published" : "unpublished"}${
          post ? `: ${post.title}` : ""
        }`,
        time,
        href: "/admin/blogs",
      });
      pushActivity({
        title: next === "published" ? "Blog published" : "Blog unpublished",
        meta: post ? post.title : id,
        time,
        tone: next === "published" ? "emerald" : "amber",
        href: "/admin/blogs",
      });
      pushNotification({
        type: "system",
        title: next === "published" ? "Blog published" : "Blog unpublished",
        body: post ? post.title : id,
        time,
        href: "/admin/blogs",
      });
    },
    [fetchRows, pushActivity, pushAudit, pushNotification, rows, togglingId]
  );

  const openDelete = useCallback((id: string) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTargetId(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!confirmTargetId) return;
    if (deletingId) return;
    const time = "Just now";
    const deleted = rows.find((r) => r.id === confirmTargetId);

    try {
      setDeletingId(confirmTargetId);
      await axios.delete(`/api/admin/blogs/${confirmTargetId}`);
      await fetchRows();
      setToast("Post deleted");
      window.setTimeout(() => setToast(null), 1800);
      closeDelete();
    } catch (err: any) {
      setToast("Failed to delete post");
      window.setTimeout(() => setToast(null), 1800);
      return;
    } finally {
      setDeletingId(null);
    }

    pushAudit({
      entity: "blog",
      action: "delete",
      actor: "Fab",
      summary: `${confirmTargetId} deleted${
        deleted ? `: ${deleted.title}` : ""
      }`,
      time,
      href: "/admin/blogs",
    });
    pushActivity({
      title: "Blog deleted",
      meta: deleted ? deleted.title : confirmTargetId,
      time,
      tone: "red",
      href: "/admin/blogs",
    });
    pushNotification({
      type: "system",
      title: "Blog deleted",
      body: deleted ? deleted.title : confirmTargetId,
      time,
      href: "/admin/blogs",
    });
  }, [
    closeDelete,
    confirmTargetId,
    deletingId,
    fetchRows,
    pushActivity,
    pushAudit,
    pushNotification,
    rows,
  ]);

  const kpis = useMemo(() => {
    const published = rows.filter((r) => r.status === "published").length;
    const draft = rows.filter((r) => r.status === "draft").length;
    const categories = new Set(rows.map((r) => r.category)).size;
    return { published, draft, categories };
  }, [rows]);

  const columns: ColumnDef<BlogRow>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Post",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate font-extrabold text-[var(--color-secondary)]">
              {row.original.title}
            </div>
            <div className="mt-0.5 text-xs font-semibold text-[var(--muted)]">
              {row.original.category} • {row.original.readTime}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
          if (!value || value === "all") return true;
          return row.getValue(id) === value;
        },
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
              onClick={() => togglePublish(row.original.id)}
              disabled={Boolean(togglingId) || Boolean(deletingId) || loading}
              className={
                row.original.status === "published"
                  ? "rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50"
                  : "rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
              }
            >
              {togglingId === row.original.id
                ? "Updating..."
                : row.original.status === "published"
                ? "Unpublish"
                : "Publish"}
            </button>
            <button
              type="button"
              onClick={() => openEdit(row.original.id)}
              disabled={Boolean(togglingId) || Boolean(deletingId) || loading}
              className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => openDelete(row.original.id)}
              disabled={Boolean(togglingId) || Boolean(deletingId) || loading}
              className="rounded-xl border border-red-900/10 bg-white px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-50"
            >
              {deletingId === row.original.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ),
      },
    ],
    [deletingId, loading, openDelete, openEdit, togglePublish, togglingId]
  );

  return (
    <>
      <AdminConfirmModal
        open={confirmOpen}
        title="Delete post?"
        description="This will remove the post from the list."
        confirmLabel="Yes, delete"
        variant="danger"
        onClose={closeDelete}
        onConfirm={confirmDelete}
        footerNote="This action cannot be undone."
      />

      <AdminDrawer
        open={drawerOpen}
        title={editing ? `Edit: ${editing.title}` : "New post"}
        onClose={closeDrawer}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              EDITOR
            </div>
            <div className="mt-3 grid grid-cols-1! gap-3!">
              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Title
                </span>
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <div className="grid grid-cols-1! gap-2!">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Cover image
                  </span>
                  <label className="cursor-pointer rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50">
                    {uploadingImage ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        void uploadImage(f);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <input
                  value={draftImageUrl}
                  onChange={(e) => setDraftImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
                {draftImageUrl ? (
                  <div className="overflow-hidden rounded-xl border border-emerald-900/10 bg-[#f6f8f7]">
                    <img
                      src={draftImageUrl}
                      alt="Blog"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2!">
                <label className="grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Category
                  </span>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  >
                    <option>Travel Guides</option>
                    <option>Adventure</option>
                    <option>Culture</option>
                    <option>News</option>
                  </select>
                </label>
                <label className="grid-cols-1! gap-1!">
                  <span className="text-xs font-extrabold text-[var(--muted)]">
                    Status
                  </span>
                  <select
                    value={draftStatus}
                    onChange={(e) =>
                      setDraftStatus(e.target.value as PostStatus)
                    }
                    className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Read time
                </span>
                <input
                  value={draftReadTime}
                  onChange={(e) => setDraftReadTime(e.target.value)}
                  placeholder="e.g. 6 min"
                  className="w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm font-semibold text-[var(--color-secondary)]"
                />
              </label>

              <label className="grid grid-cols-1! gap-1!">
                <span className="text-xs font-extrabold text-[var(--muted)]">
                  Content
                </span>
                <AdminQuillEditor
                  value={draftContent}
                  onChange={setDraftContent}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeDrawer}
              disabled={saving}
              className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={savePost}
              disabled={saving}
              className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Save draft"}
            </button>
          </div>

          <div className="text-xs font-semibold text-[var(--muted)]">
            Mock editor scaffold. Next step: connect to your blog storage &
            render pipeline.
          </div>
        </div>
      </AdminDrawer>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
              Blogs
            </h1>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
              Draft, publish, and manage content.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={
              loading || saving || Boolean(togglingId) || Boolean(deletingId)
            }
            className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
          >
            New post
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-extrabold text-[var(--muted)]">
              PUBLISHED
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.published}
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
              CATEGORIES
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
              {kpis.categories}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
          <AdminDataTable
            data={rows}
            columns={columns}
            searchPlaceholder="Search posts by title or category..."
            pageSize={8}
            loading={loading}
            getRowId={(row) => (row as BlogRow).id}
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
                      <option value="published">Published</option>
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
