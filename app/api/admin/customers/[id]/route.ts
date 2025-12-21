import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { note?: string };

  const note =
    typeof body.note === "string" ? body.note.trim().slice(0, 5000) : "";

  const updated = await prisma.customer.update({
    where: { publicId: id },
    data: { note },
  });

  return NextResponse.json({
    ok: true,
    customer: {
      id: updated.publicId,
      note: updated.note ?? "",
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}
