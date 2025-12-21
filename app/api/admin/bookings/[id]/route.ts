import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/mailer";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = (await req.json()) as
    | { status: "pending" | "confirmed" | "cancelled" }
    | { date: string; travellers: number };

  if ("status" in body) {
    const updated = await prisma.booking.update({
      where: { publicId: id },
      data: { status: body.status },
      include: { customer: true, package: true },
    });

    const customerEmail = updated.customer?.email;
    if (customerEmail) {
      const status = updated.status;
      const subject =
        status === "confirmed"
          ? `Booking confirmed: ${updated.package.title}`
          : status === "cancelled"
          ? `Booking update: ${updated.package.title}`
          : null;

      if (subject) {
        const statusLine =
          status === "confirmed"
            ? "Your booking has been confirmed."
            : "Your booking has been rejected.";

        await sendEmail({
          to: customerEmail,
          subject,
          text:
            `Hi ${updated.customer.name},\n\n` +
            `${statusLine}\n\n` +
            `Booking ID: ${updated.publicId}\n` +
            `Package: ${updated.package.title}\n` +
            `Date: ${updated.travelDate.toISOString().slice(0, 10)}\n` +
            `Travellers: ${updated.travellers}\n\n` +
            `— Eben Tours`,
        });
      }
    }

    return NextResponse.json({ ok: true });
  }

  if (typeof body.date !== "string" || !Number.isFinite(body.travellers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.booking.update({
    where: { publicId: id },
    data: {
      travelDate: new Date(body.date),
      travellers: body.travellers,
    },
  });

  return NextResponse.json({ ok: true });
}
