"use client";

import AdminKpiCard from "../components/admin/AdminKpiCard";
import BookingTrendsChart from "../components/admin/charts/BookingTrendsChart";
import RevenueBreakdownChart from "../components/admin/charts/RevenueBreakdownChart";
import AdminActivityFeed from "../components/admin/AdminActivityFeed";
import AdminAuditLog from "../components/admin/AdminAuditLog";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type DashboardResponse = {
  kpis: {
    totalBookings: number;
    revenue: number;
    messages: number;
    totalTours: number;
  };
  bookingTrends: Array<{ name: string; bookings: number }>;
  revenueBreakdown: Array<{ name: string; value: number }>;
};

function formatMoney(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-emerald-900/10 ${className}`}
    />
  );
}

function DashboardKpiSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2! lg:grid-cols-4!">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm"
        >
          <SkeletonBlock className="h-3 w-28" />
          <div className="mt-3">
            <SkeletonBlock className="h-7 w-24" />
          </div>
          <div className="mt-3">
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPanelSkeleton({ heightClass }: { heightClass: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <SkeletonBlock className="h-3 w-36" />
        <div className="mt-2">
          <SkeletonBlock className="h-3 w-48" />
        </div>
      </div>
      <SkeletonBlock className={`${heightClass} w-full`} />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    axios
      .get<DashboardResponse>("/api/admin/dashboard")
      .then((res) => {
        if (!alive) return;
        setData(res.data);
      })
      .catch(() => {
        // ignore; Clerk middleware handles redirect
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const kpis = useMemo(() => {
    return (
      data?.kpis ?? {
        totalBookings: 0,
        revenue: 0,
        messages: 0,
        totalTours: 0,
      }
    );
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)] sm:text-3xl">
          Welcome back,{" "}
          <span className="text-[var(--color-primary)]">Admin</span>
        </h1>
        <p className="text-sm font-semibold text-[var(--muted)]">
          Monitor bookings, revenue and messages in one place.
        </p>
      </div>

      {loading ? (
        <DashboardKpiSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2! lg:grid-cols-4!">
          <AdminKpiCard
            title="Total Bookings"
            value={kpis.totalBookings.toLocaleString()}
            delta="From database"
            icon="calendar"
          />
          <AdminKpiCard
            title="Revenue"
            value={formatMoney(kpis.revenue)}
            delta="From database"
            icon="money"
          />
          <AdminKpiCard
            title="Messages"
            value={kpis.messages.toLocaleString()}
            delta="From database"
            icon="mail"
          />
          <AdminKpiCard
            title="Total Tours"
            value={kpis.totalTours.toLocaleString()}
            delta="From database"
            icon="map"
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3!">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              <DashboardPanelSkeleton heightClass="h-72" />
              <DashboardPanelSkeleton heightClass="h-44" />
            </div>
          ) : (
            <>
              <div className="rounded-2xl mb-4 border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                      Booking Trends
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                      Weekly bookings volume
                    </div>
                  </div>
                  <div className="inline-flex rounded-xl border border-emerald-900/10 bg-[#f6f8f7] p-1 text-xs font-extrabold text-[var(--color-secondary)]">
                    <span className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-white">
                      Week
                    </span>
                    <span className="px-3 py-1 opacity-60">Month</span>
                    <span className="px-3 py-1 opacity-60">Year</span>
                  </div>
                </div>

                <BookingTrendsChart data={data?.bookingTrends} />
              </div>
              <AdminAuditLog />
            </>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <DashboardPanelSkeleton heightClass="h-72" />
              <DashboardPanelSkeleton heightClass="h-44" />
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                  <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                    Revenue Breakdown
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                    By tour category
                  </div>
                </div>

                <RevenueBreakdownChart data={data?.revenueBreakdown} />
              </div>
              <AdminActivityFeed />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
