"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: Array<{
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "bookings"
    | "packages"
    | "hero"
    | "blogs"
    | "emails"
    | "customers"
    | "revenue"
    | "audit"
    | "settings";
}> = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Bookings", href: "/admin/bookings", icon: "bookings" },
  { label: "Packages", href: "/admin/packages", icon: "packages" },
  { label: "Hero Media", href: "/admin/hero-media", icon: "hero" },
  { label: "Blogs", href: "/admin/blogs", icon: "blogs" },
  { label: "Emails", href: "/admin/emails", icon: "emails" },
  { label: "Customers", href: "/admin/customers", icon: "customers" },
  { label: "Revenue", href: "/admin/revenue", icon: "revenue" },
  { label: "Audit", href: "/admin/audit", icon: "audit" },
  // { label: "Settings", href: "/admin/settings", icon: "settings" },
];

function Icon({ name }: { name: (typeof navItems)[number]["icon"] }) {
  const common = "h-4 w-4";

  if (name === "dashboard")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "emails")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "hero")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm2 0v12h12V6H6Zm3 3h2v2H9V9Zm0 4h6v2H9v-2Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "bookings")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 8H5v10h14V10Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "packages")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 7h-3V4H7v3H4v2h16V7Zm-2 4H6v9h12v-9Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "blogs")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4h16v2H4V4Zm0 4h10v2H4V8Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "customers")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 6c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "revenue")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm1 17.93V20h-2v-1.07c-1.943-.31-3.276-1.62-3.4-3.32H9.6c.09.85.79 1.53 2.4 1.53 1.7 0 2.3-.68 2.3-1.36 0-.71-.38-1.09-2.6-1.62-2.46-.6-4.22-1.52-4.22-3.59 0-1.67 1.3-2.89 3.32-3.23V4h2v1.09c2.12.36 3.18 1.77 3.28 3.1h-1.98c-.1-.9-.7-1.5-2.3-1.5-1.5 0-2.2.54-2.2 1.28 0 .69.58 1.04 2.6 1.54 2.02.5 4.22 1.28 4.22 3.66 0 1.78-1.25 3.09-3.32 3.44Z"
          fill="currentColor"
        />
      </svg>
    );

  if (name === "audit")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1a9 9 0 1 0 9 9c0-1.1-.2-2.15-.56-3.13l-1.74 1.01c.2.66.3 1.37.3 2.12a7 7 0 1 1-7-7c1.1 0 2.12.25 3.03.7l1-1.73A8.95 8.95 0 0 0 12 1Zm7.59 3.17-8.2 8.2-2.98-2.98-1.41 1.41 4.39 4.39 9.61-9.61-1.41-1.41Z"
          fill="currentColor"
        />
      </svg>
    );

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94 0 .31.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.23.4.32.64.22l2.39-.96c.5.4 1.05.72 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96c.24.1.51 0 .64-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] shrink-0 overflow-y-auto border-r border-emerald-900/10 bg-white px-4 py-6 lg:block">
      <div className="mb-6">
        <div className="text-lg font-extrabold tracking-tight text-[var(--color-secondary)]">
          Eben Tours
        </div>
        <div className="text-xs font-semibold text-[var(--muted)]">
          ADMIN DASHBOARD
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) =>
          (() => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-extrabold text-white!"
                    : "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
                }
              >
                <span
                  className={
                    active ? "text-white!" : "text-[var(--color-primary)]"
                  }
                >
                  <Icon name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })()
        )}
      </nav>

      {/* <div className="mt-8">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
        >
          <span className="text-[var(--color-primary)]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 17l5-5-5-5v10Z" fill="currentColor" />
              <path
                d="M4 4h9v2H6v12h7v2H4V4Zm16 0h-7v2h5v12h-5v2h7V4Z"
                fill="currentColor"
              />
            </svg>
          </span>
          Logout
        </button>
      </div> */}
    </aside>
  );
}
