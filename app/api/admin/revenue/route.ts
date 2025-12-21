import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

type Period = "7d" | "30d" | "90d";

type RevenuePoint = {
  label: string;
  revenue: number;
  bookings: number;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const period = (url.searchParams.get("period") ?? "30d") as Period;
  const safePeriod: Period =
    period === "7d" || period === "30d" || period === "90d" ? period : "30d";

  const now = new Date();

  if (safePeriod === "7d") {
    const since = startOfDay(addDays(now, -6));
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(since, i);
      return {
        key: iso(d),
        label: dayLabels[d.getDay()],
        revenue: 0,
        bookings: 0,
      };
    });

    const rows = await prisma.booking.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, amount: true },
    });

    for (const b of rows) {
      const key = iso(b.createdAt);
      const bucket = buckets.find((x) => x.key === key);
      if (!bucket) continue;
      bucket.bookings += 1;
      bucket.revenue += b.amount;
    }

    const data: RevenuePoint[] = buckets.map(
      ({ label, revenue, bookings }) => ({
        label,
        revenue,
        bookings,
      })
    );

    const totalRevenue = data.reduce((a, d) => a + d.revenue, 0);
    const totalBookings = data.reduce((a, d) => a + d.bookings, 0);

    return NextResponse.json({
      period: safePeriod,
      data,
      kpis: {
        totalRevenue,
        totalBookings,
        aov: totalBookings === 0 ? 0 : Math.round(totalRevenue / totalBookings),
      },
    });
  }

  const weeks = safePeriod === "30d" ? 10 : 12;
  const days = safePeriod === "30d" ? 30 : 90;
  const since = startOfDay(addDays(now, -(days - 1)));

  const rows = await prisma.booking.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, amount: true },
    orderBy: { createdAt: "asc" },
  });

  const buckets = Array.from({ length: weeks }).map((_, idx) => ({
    label: safePeriod === "30d" ? `W${idx + 1}` : `M${idx + 1}`,
    revenue: 0,
    bookings: 0,
  }));

  for (const b of rows) {
    const diffDays = Math.floor(
      (startOfDay(b.createdAt).getTime() - since.getTime()) /
        (24 * 60 * 60 * 1000)
    );
    const ratio = safePeriod === "30d" ? diffDays / 30 : diffDays / 90;
    const idx = Math.min(weeks - 1, Math.max(0, Math.floor(ratio * weeks)));
    buckets[idx].bookings += 1;
    buckets[idx].revenue += b.amount;
  }

  const data: RevenuePoint[] = buckets;
  const totalRevenue = data.reduce((a, d) => a + d.revenue, 0);
  const totalBookings = data.reduce((a, d) => a + d.bookings, 0);

  return NextResponse.json({
    period: safePeriod,
    data,
    kpis: {
      totalRevenue,
      totalBookings,
      aov: totalBookings === 0 ? 0 : Math.round(totalRevenue / totalBookings),
    },
  });
}
