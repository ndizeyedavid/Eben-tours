import AdminKpiCard from "../components/admin/AdminKpiCard";
import BookingTrendsChart from "../components/admin/charts/BookingTrendsChart";
import RevenueBreakdownChart from "../components/admin/charts/RevenueBreakdownChart";
import AdminActivityFeed from "../components/admin/AdminActivityFeed";
import AdminAuditLog from "../components/admin/AdminAuditLog";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-secondary)] sm:text-3xl">
          Welcome back,{" "}
          <span className="text-[var(--color-primary)]">Fabrice</span>
        </h1>
        <p className="text-sm font-semibold text-[var(--muted)]">
          Monitor bookings, revenue and messages in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2! lg:grid-cols-4!">
        <AdminKpiCard
          title="Total Bookings"
          value="2,547"
          delta="+12% from last month"
          icon="calendar"
        />
        <AdminKpiCard
          title="Revenue"
          value="$89.5K"
          delta="+8% from last month"
          icon="money"
        />
        <AdminKpiCard
          title="Messages"
          value="342"
          delta="+18% from last month"
          icon="mail"
        />
        <AdminKpiCard
          title="Total Tours"
          value="156"
          delta="+24 from last month"
          icon="map"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3!">
        <div className="lg:col-span-2">
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

            <BookingTrendsChart />
          </div>
          <AdminAuditLog />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                Revenue Breakdown
              </div>
              <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                By tour category
              </div>
            </div>

            <RevenueBreakdownChart />
          </div>
          <AdminActivityFeed />
        </div>
      </div>
    </div>
  );
}
