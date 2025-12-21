"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
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
  status: PostStatus;
  readTime: string;
  updatedAt: string;
  content: QuillDelta;
};

const seedPosts: BlogRow[] = [
  {
    id: "BLG-2001",
    title: "Top 7 Experiences in Rwanda",
    category: "Travel Guides",
    author: "Admin",
    status: "published",
    readTime: "6 min",
    updatedAt: "2025-12-12",
    content: {
      ops: [
        { insert: "Top 7 Experiences in Rwanda\n" },
        { attributes: { header: 2 }, insert: "\n" },
        {
          insert:
            "Write a short intro, then list the experiences with images and tips.\n",
        },
      ],
    },
  },
  {
    id: "BLG-2002",
    title: "How to Prepare for Gorilla Trekking",
    category: "Adventure",
    author: "Admin",
    status: "draft",
    readTime: "8 min",
    updatedAt: "2025-12-18",
    content: {
      ops: [
        { insert: "How to Prepare for Gorilla Trekking\n" },
        { attributes: { header: 2 }, insert: "\n" },
        {
          insert:
            "Add essentials: clothing, fitness, permits, camera tips, and timing.\n",
        },
      ],
    },
  },
];

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

function newId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function AdminBlogsPage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [rows, setRows] = useState<BlogRow[]>(seedPosts);
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
  const [draftCategory, setDraftCategory] = useState("Travel Guides");
  const [draftStatus, setDraftStatus] = useState<PostStatus>("draft");
  const [draftReadTime, setDraftReadTime] = useState("6 min");
  const [draftContent, setDraftContent] = useState<QuillDelta>({
    ops: [{ insert: "\n" }],
  });

  const openCreate = useCallback(() => {
    setEditingId(null);
    setDraftTitle("");
    setDraftCategory("Travel Guides");
    setDraftStatus("draft");
    setDraftReadTime("6 min");
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
      setDraftContent(post.content);
      setDrawerOpen(true);
    },
    [rows]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const savePost = useCallback(() => {
    if (!draftTitle.trim()) return;

    const now = new Date().toISOString().slice(0, 10);
    const time = "Just now";
    const idValue = editingId ?? newId("BLG");

    setRows((prev) => {
      if (!editingId) {
        const created: BlogRow = {
          id: idValue,
          title: draftTitle.trim(),
          category: draftCategory,
          author: "Admin",
          status: draftStatus,
          readTime: draftReadTime,
          updatedAt: now,
          content: draftContent,
        };
        return [created, ...prev];
      }

      return prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              title: draftTitle.trim(),
              category: draftCategory,
              status: draftStatus,
              readTime: draftReadTime,
              updatedAt: now,
              content: draftContent,
            }
          : r
      );
    });

    setToast(editingId ? "Post updated" : "Draft saved");
    window.setTimeout(() => setToast(null), 1800);
    setDrawerOpen(false);

    pushAudit({
      entity: "blog",
      action: editingId ? "update" : "create",
      actor: "Fab",
      summary: `${idValue} ${
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
    draftReadTime,
    draftStatus,
    draftTitle,
    editingId,
    pushActivity,
    pushAudit,
    pushNotification,
  ]);

  const togglePublish = useCallback(
    (id: string) => {
      const now = new Date().toISOString().slice(0, 10);
      const time = "Just now";
      const post = rows.find((r) => r.id === id);
      const current = post?.status ?? "draft";
      const next = current === "published" ? "draft" : "published";
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: next,
                updatedAt: now,
              }
            : r
        )
      );
      setToast("Status updated");
      window.setTimeout(() => setToast(null), 1800);

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
    [pushActivity, pushAudit, pushNotification, rows]
  );

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
    const time = "Just now";
    const deleted = rows.find((r) => r.id === confirmTargetId);
    setRows((prev) => prev.filter((r) => r.id !== confirmTargetId));
    setToast("Post deleted");
    window.setTimeout(() => setToast(null), 1800);
    closeDelete();

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
              className={
                row.original.status === "published"
                  ? "rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-50"
                  : "rounded-xl bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
              }
            >
              {row.original.status === "published" ? "Unpublish" : "Publish"}
            </button>
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
    [openDelete, openEdit, togglePublish]
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
        footerNote="Mock action (UI state only)."
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
              className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={savePost}
              className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
            >
              {editing ? "Save changes" : "Save draft"}
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
