"use client";

import { useMemo, useState } from "react";
import { useAdminOps } from "@/app/components/admin/AdminOpsProvider";
import { exportBrandedXlsx } from "@/app/components/admin/export/brandedXlsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period = "7d" | "30d" | "90d";

type RevenuePoint = { label: string; revenue: number; bookings: number };

type RevenueExportRow = {
  period: Period;
  label: string;
  revenue: number;
  bookings: number;
  avg_order_value: number;
};

const weekly = [
  { label: "Mon", revenue: 520, bookings: 5 },
  { label: "Tue", revenue: 760, bookings: 7 },
  { label: "Wed", revenue: 620, bookings: 6 },
  { label: "Thu", revenue: 980, bookings: 9 },
  { label: "Fri", revenue: 840, bookings: 8 },
  { label: "Sat", revenue: 1120, bookings: 10 },
  { label: "Sun", revenue: 900, bookings: 8 },
];

const monthly = Array.from({ length: 10 }).map((_, idx) => ({
  label: `W${idx + 1}`,
  revenue: 1200 + idx * 140 + (idx % 2 ? 180 : 0),
  bookings: 12 + idx * 2 + (idx % 3 === 0 ? 3 : 0),
}));

const quarterly = Array.from({ length: 12 }).map((_, idx) => ({
  label: `M${idx + 1}`,
  revenue: 2800 + idx * 220 + (idx % 2 ? 300 : 0),
  bookings: 28 + idx * 2 + (idx % 4 === 0 ? 6 : 0),
}));

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-3 shadow-sm">
      <div className="text-xs font-extrabold text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
        Revenue: ${payload[0]?.value}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
        Bookings: {payload[1]?.value}
      </div>
    </div>
  );
}

export default function AdminRevenuePage() {
  const { pushActivity, pushAudit, pushNotification } = useAdminOps();
  const [period, setPeriod] = useState<Period>("30d");
  const [toast, setToast] = useState<null | string>(null);

  const data = useMemo(() => {
    if (period === "7d") return weekly;
    if (period === "30d") return monthly;
    return quarterly;
  }, [period]) as RevenuePoint[];

  const kpis = useMemo(() => {
    const totalRevenue = data.reduce((a, d) => a + d.revenue, 0);
    const totalBookings = data.reduce((a, d) => a + d.bookings, 0);
    const aov =
      totalBookings === 0 ? 0 : Math.round(totalRevenue / totalBookings);
    return { totalRevenue, totalBookings, aov };
  }, [data]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const exportRevenue = (format: "csv" | "xlsx") => {
    const exportData: RevenueExportRow[] = data.map((d) => ({
      period,
      label: d.label,
      revenue: d.revenue,
      bookings: d.bookings,
      avg_order_value:
        d.bookings === 0 ? 0 : Math.round(d.revenue / d.bookings),
    }));

    const stamp = new Date().toISOString().slice(0, 10);
    const base = `revenue_${period}_${stamp}`;

    if (format === "csv") {
      const headers: (keyof RevenueExportRow)[] = [
        "period",
        "label",
        "revenue",
        "bookings",
        "avg_order_value",
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
      void exportBrandedXlsx<RevenueExportRow>({
        filename: `${base}.xlsx`,
        sheetName: "Revenue",
        title: "Revenue Report",
        companyName: "Eben Tours",
        logoUrl: "/Logo-011.png",
        meta: [
          { label: "Generated", value: stamp },
          { label: "Period", value: period },
        ],
        columns: [
          { header: "Period", key: "period", width: 10 },
          { header: "Label", key: "label", width: 12 },
          { header: "Revenue", key: "revenue", width: 12 },
          { header: "Bookings", key: "bookings", width: 12 },
          { header: "Avg Order Value", key: "avg_order_value", width: 16 },
        ],
        rows: exportData,
      });
    }

    const time = "Just now";
    pushAudit({
      entity: "system",
      action: "export",
      actor: "Fab",
      summary: `Exported revenue report (${period}) as ${format.toUpperCase()}`,
      time,
      href: "/admin/revenue",
    });
    pushActivity({
      title: "Revenue exported",
      meta: `Period ${period} • ${format.toUpperCase()}`,
      time,
      tone: "blue",
      href: "/admin/revenue",
    });
    pushNotification({
      type: "system",
      title: "Export ready",
      body: `Downloaded revenue report as ${format.toUpperCase()}`,
      time,
      href: "/admin/revenue",
    });

    setToast(`Exported ${format.toUpperCase()} (${period})`);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)]">
            Revenue
          </h1>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Track earnings, bookings volume, and trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            type="button"
            onClick={() => exportRevenue("csv")}
            className="rounded-xl border border-emerald-900/10 bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportRevenue("xlsx")}
            className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-xs font-extrabold text-white hover:opacity-90"
          >
            Export XLSX
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
          <div className="text-xs font-extrabold text-[var(--muted)]">
            TOTAL REVENUE
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
            ${kpis.totalRevenue.toFixed(0)}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
          <div className="text-xs font-extrabold text-[var(--muted)]">
            BOOKINGS
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
            {kpis.totalBookings}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
          <div className="text-xs font-extrabold text-[var(--muted)]">
            AVG ORDER VALUE
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[var(--color-secondary)]">
            ${kpis.aov}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                Revenue trend
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                Smoothed overview
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#0f766e"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e6efe9" strokeDasharray="4 4" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#064e3b"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <div className="text-sm font-extrabold text-[var(--color-secondary)]">
              Bookings volume
            </div>
            <div className="text-xs font-semibold text-[var(--muted)]">
              Period breakdown
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#e6efe9" strokeDasharray="4 4" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
        <div className="text-sm font-extrabold text-[var(--color-secondary)]">
          Insights
        </div>
        <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4">
              <div className="text-xs font-extrabold text-[var(--muted)]">
                TOP DRIVER
              </div>
              <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                Gorilla trekking packages
              </div>
              <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                Highest conversion this period (mock).
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-4">
              <div className="text-xs font-extrabold text-[var(--muted)]">
                RECOMMENDED
              </div>
              <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                Promote "Akagera Safari" next weekend
              </div>
              <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                Forecast: higher demand (mock).
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-3 text-sm font-extrabold text-emerald-700">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
