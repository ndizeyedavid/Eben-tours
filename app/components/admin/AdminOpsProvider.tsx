"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type NotificationType = "booking" | "message" | "system";

type AdminNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

type AdminActivity = {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone?: "emerald" | "amber" | "red" | "blue";
  href?: string;
};

type AuditEntity = "booking" | "package" | "blog" | "customer" | "system";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "status_change"
  | "publish"
  | "unpublish"
  | "message"
  | "export"
  | "print";

type AdminAuditEntry = {
  id: string;
  entity: AuditEntity;
  action: AuditAction;
  actor: string;
  summary: string;
  time: string;
  href?: string;
};

type AdminOpsContextValue = {
  notifications: AdminNotification[];
  activities: AdminActivity[];
  audit: AdminAuditEntry[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (
    n: Omit<AdminNotification, "id" | "read"> & { id?: string }
  ) => void;
  pushActivity: (a: Omit<AdminActivity, "id"> & { id?: string }) => void;
  pushAudit: (e: Omit<AdminAuditEntry, "id"> & { id?: string }) => void;
};

const AdminOpsContext = createContext<AdminOpsContextValue | null>(null);

function id(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function AdminOpsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: "ntf-1",
      type: "booking",
      title: "New booking request",
      body: "John K. requested Akagera Big Five Safari.",
      time: "2m ago",
      read: false,
      href: "/admin/bookings",
    },
    {
      id: "ntf-2",
      type: "message",
      title: "Customer message",
      body: "Grace N. asked about availability for February.",
      time: "18m ago",
      read: false,
      href: "/admin/customers",
    },
    {
      id: "ntf-3",
      type: "system",
      title: "Reminder",
      body: "2 draft packages are not published.",
      time: "Today",
      read: true,
      href: "/admin/packages",
    },
  ]);

  const [audit, setAudit] = useState<AdminAuditEntry[]>([
    {
      id: "aud-1",
      entity: "booking",
      action: "status_change",
      actor: "Fab",
      summary: "BK-1025 marked as Pending",
      time: "Today",
      href: "/admin/bookings",
    },
    {
      id: "aud-2",
      entity: "package",
      action: "update",
      actor: "Fab",
      summary: "Updated price for Volcano & Gorilla Trekking",
      time: "Yesterday",
      href: "/admin/packages",
    },
  ]);

  const [activities, setActivities] = useState<AdminActivity[]>([
    {
      id: "act-1",
      title: "Booking created",
      meta: "BK-1025 • Akagera Safari • Pending",
      time: "2m ago",
      tone: "amber",
      href: "/admin/bookings",
    },
    {
      id: "act-2",
      title: "Package updated",
      meta: "Volcano & Gorilla Trekking • price adjusted",
      time: "Today",
      tone: "emerald",
      href: "/admin/packages",
    },
    {
      id: "act-3",
      title: "Blog published",
      meta: "Top 7 Experiences in Rwanda",
      time: "Yesterday",
      tone: "blue",
      href: "/admin/blogs",
    },
  ]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationRead = useCallback((nid: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === nid ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const pushNotification = useCallback(
    (n: Omit<AdminNotification, "id" | "read"> & { id?: string }) => {
      const created: AdminNotification = {
        id: n.id ?? id("ntf"),
        read: false,
        type: n.type,
        title: n.title,
        body: n.body,
        time: n.time,
        href: n.href,
      };
      setNotifications((prev) => [created, ...prev]);
    },
    []
  );

  const pushAudit = useCallback(
    (e: Omit<AdminAuditEntry, "id"> & { id?: string }) => {
      const created: AdminAuditEntry = {
        id: e.id ?? id("aud"),
        entity: e.entity,
        action: e.action,
        actor: e.actor,
        summary: e.summary,
        time: e.time,
        href: e.href,
      };
      setAudit((prev) => [created, ...prev].slice(0, 50));
    },
    []
  );

  const pushActivity = useCallback(
    (a: Omit<AdminActivity, "id"> & { id?: string }) => {
      const created: AdminActivity = {
        id: a.id ?? id("act"),
        title: a.title,
        meta: a.meta,
        time: a.time,
        tone: a.tone,
        href: a.href,
      };
      setActivities((prev) => [created, ...prev].slice(0, 20));
    },
    []
  );

  const value = useMemo<AdminOpsContextValue>(
    () => ({
      notifications,
      activities,
      audit,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
      pushNotification,
      pushActivity,
      pushAudit,
    }),
    [
      activities,
      audit,
      markAllNotificationsRead,
      markNotificationRead,
      notifications,
      pushActivity,
      pushAudit,
      pushNotification,
      unreadCount,
    ]
  );

  return (
    <AdminOpsContext.Provider value={value}>
      {children}
    </AdminOpsContext.Provider>
  );
}

export function useAdminOps() {
  const ctx = useContext(AdminOpsContext);
  if (!ctx) throw new Error("useAdminOps must be used within AdminOpsProvider");
  return ctx;
}

export type {
  AdminActivity,
  AdminAuditEntry,
  AdminNotification,
  AuditAction,
  AuditEntity,
  NotificationType,
};
