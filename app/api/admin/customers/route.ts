import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

type Segment = "vip" | "new" | "returning";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: Segment;
  bookings: number;
  lastBooking: string;
  lifetimeValue: number;
  note?: string | null;
};

function asSegment(v: unknown): Segment {
  const s = String(v ?? "").toLowerCase();
  if (s === "vip" || s === "new" || s === "returning") return s;
  return "new";
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      bookings: {
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const rows: CustomerRow[] = customers.map((c) => {
    const bookingsCount = c.bookings.length;
    const lastBooking =
      c.lastBooking ?? c.bookings[0]?.createdAt ?? c.createdAt ?? null;
    const lifetimeValue = c.bookings.reduce((a, b) => a + (b.amount ?? 0), 0);

    return {
      id: c.publicId,
      name: c.name,
      email: c.email,
      phone: c.phone ?? "",
      segment: asSegment(c.segment),
      bookings: bookingsCount,
      lastBooking: lastBooking ? lastBooking.toISOString().slice(0, 10) : "-",
      lifetimeValue,
      note: c.note ?? null,
    };
  });

  return NextResponse.json({ rows });
}
