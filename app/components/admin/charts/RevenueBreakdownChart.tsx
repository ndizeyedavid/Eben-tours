"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Safari", value: 42, color: "#166534" },
  { name: "Trekking", value: 33, color: "#16a34a" },
  { name: "Climbing", value: 25, color: "#84cc16" },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const p = payload[0];
  return (
    <div className="rounded-xl border border-emerald-900/10 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs font-extrabold text-[var(--color-secondary)]">
        {p.name}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
        Share:{" "}
        <span className="font-extrabold text-[var(--color-secondary)]">
          {p.value}%
        </span>
      </div>
    </div>
  );
}

export default function RevenueBreakdownChart() {
  return (
    <div className="w-full">
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-2">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              <span className="text-[var(--color-secondary)]">
                {entry.name}
              </span>
            </div>
            <span className="text-[var(--muted)]">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
