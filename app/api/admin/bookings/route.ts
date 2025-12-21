import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/mailer";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, package: true },
  });

  return NextResponse.json({
    rows: bookings.map((b) => ({
      id: b.publicId,
      customer: b.customer.name,
      packageName: b.package.title,
      date: b.travelDate.toISOString().slice(0, 10),
      travellers: b.travellers,
      amount: b.amount,
      status: b.status,
    })),
  });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    bookingIds: string[];
    status: "pending" | "confirmed" | "cancelled";
  };

  if (!Array.isArray(body.bookingIds) || body.bookingIds.length === 0) {
    return NextResponse.json({ error: "bookingIds required" }, { status: 400 });
  }

  const targets = await prisma.booking.findMany({
    where: { publicId: { in: body.bookingIds } },
    include: { customer: true, package: true },
  });

  await prisma.booking.updateMany({
    where: { publicId: { in: body.bookingIds } },
    data: { status: body.status },
  });

  if (body.status === "confirmed" || body.status === "cancelled") {
    for (const b of targets) {
      const email = b.customer?.email;
      if (!email) continue;

      const subject =
        body.status === "confirmed"
          ? `Booking confirmed: ${b.package.title}`
          : `Booking update: ${b.package.title}`;

      const statusLine =
        body.status === "confirmed"
          ? "Your booking has been confirmed."
          : "Your booking has been rejected.";

      try {
        await sendEmail({
          to: email,
          subject,
          text:
            `Hi ${b.customer.name},\n\n` +
            `${statusLine}\n\n` +
            `Booking ID: ${b.publicId}\n` +
            `Package: ${b.package.title}\n` +
            `Date: ${b.travelDate.toISOString().slice(0, 10)}\n` +
            `Travellers: ${b.travellers}\n\n` +
            `— Eben Tours`,
        });
      } catch {
        // ignore per-recipient failures
      }
    }
  }

  return NextResponse.json({ ok: true });
}
