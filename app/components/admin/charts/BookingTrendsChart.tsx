"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", bookings: 62 },
  { name: "Tue", bookings: 78 },
  { name: "Wed", bookings: 90 },
  { name: "Thu", bookings: 84 },
  { name: "Fri", bookings: 92 },
  { name: "Sat", bookings: 88 },
  { name: "Sun", bookings: 74 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs font-extrabold text-[var(--color-secondary)]">
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
        Bookings:{" "}
        <span className="font-extrabold text-[var(--color-secondary)]">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

export default function BookingTrendsChart() {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e9f1ec" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="bookings"
            stroke="#166534"
            strokeWidth={3}
            fill="url(#bookingsFill)"
            dot={{ r: 4, strokeWidth: 2, fill: "#166534", stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#16a34a",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
