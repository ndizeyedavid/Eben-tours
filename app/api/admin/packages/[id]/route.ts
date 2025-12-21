import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

type PackageStatus = "active" | "draft" | "disabled";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = (await req.json()) as {
    title?: string;
    location?: string;
    durationDays?: number;
    price?: number;
    maxGroup?: number;
    featured?: boolean;
    status?: PackageStatus;
  };

  const updated = await prisma.package.update({
    where: { publicId: id },
    data: {
      ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
      ...(typeof body.location === "string"
        ? { location: body.location.trim() }
        : {}),
      ...(typeof body.durationDays === "number"
        ? { durationDays: body.durationDays }
        : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(typeof body.maxGroup === "number" ? { maxGroup: body.maxGroup } : {}),
      ...(typeof body.featured === "boolean"
        ? { featured: body.featured }
        : {}),
      ...(typeof body.status === "string" ? { status: body.status } : {}),
    },
  });

  return NextResponse.json({
    row: {
      id: updated.publicId,
      title: updated.title,
      location: updated.location,
      durationDays: updated.durationDays,
      price: updated.price,
      maxGroup: updated.maxGroup,
      featured: updated.featured,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString().slice(0, 10),
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.package.update({
      where: { publicId: id },
      data: { status: "disabled" },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Failed to disable package" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to disable package" },
      { status: 500 }
    );
  }
}
