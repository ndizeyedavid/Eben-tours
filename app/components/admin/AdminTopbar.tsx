"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAdminOps } from "./AdminOpsProvider";

export default function AdminTopbar() {
  const [query, setQuery] = useState("");
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
  } = useAdminOps();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!popoverRef.current) return;
      if (popoverRef.current.contains(e.target as Node)) return;
      close();
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  const recent = useMemo(() => notifications.slice(0, 6), [notifications]);

  return (
    <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[var(--color-primary)] sm:flex">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3H3v7h7V3Zm11 0h-7v7h7V3ZM10 14H3v7h7v-7Zm11 0h-7v7h7v-7Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm9 16-3.1-3.1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookings, tours..."
              className="w-full rounded-xl border border-emerald-900/10 bg-white px-9 py-2.5 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={toggleOpen}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-[var(--color-secondary)] hover:bg-emerald-50"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white">
                  {unreadCount}
                </span>
              ) : null}
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {open ? (
              <div className="absolute right-0 top-12 z-40 w-[340px] overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-900/10 p-3">
                  <div>
                    <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                      Notifications
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-[var(--muted)]">
                      {unreadCount} unread
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead()}
                    className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-[360px] overflow-auto p-2">
                  {recent.length === 0 ? (
                    <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4 text-sm font-semibold text-[var(--muted)]">
                      No notifications.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recent.map((n) => {
                        const Wrapper = n.href ? Link : ("div" as any);

                        return (
                          <Wrapper
                            key={n.id}
                            {...(n.href ? { href: n.href } : {})}
                            onClick={() => {
                              markNotificationRead(n.id);
                              close();
                            }}
                            className={
                              n.href
                                ? "block rounded-2xl border border-emerald-900/10 bg-white p-3 hover:bg-emerald-50"
                                : "rounded-2xl border border-emerald-900/10 bg-white p-3"
                            }
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  {!n.read ? (
                                    <span className="h-2 w-2 rounded-full bg-red-600" />
                                  ) : (
                                    <span className="h-2 w-2 rounded-full bg-emerald-900/10" />
                                  )}
                                  <div className="truncate text-sm font-extrabold text-[var(--color-secondary)]">
                                    {n.title}
                                  </div>
                                </div>
                                <div className="mt-1 line-clamp-2 text-xs font-semibold text-[var(--muted)]">
                                  {n.body}
                                </div>
                              </div>
                              <div className="shrink-0 text-[10px] font-extrabold text-[var(--muted)]">
                                {n.time}
                              </div>
                            </div>

                            {!n.read ? (
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    markNotificationRead(n.id);
                                  }}
                                  className="text-xs font-extrabold text-[var(--color-primary)] hover:underline"
                                >
                                  Mark read
                                </button>
                              </div>
                            ) : null}
                          </Wrapper>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/10 bg-white text-[var(--color-secondary)] hover:bg-emerald-50"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h16v12H5.17L4 17.17V4Zm2 4h12v2H6V8Zm0 4h9v2H6v-2Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="ml-1 flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-xs font-extrabold text-white">
              FB
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-extrabold text-[var(--color-secondary)]">
                Fab
              </div>
              <div className="text-[10px] font-semibold text-[var(--muted)]">
                Manager
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
