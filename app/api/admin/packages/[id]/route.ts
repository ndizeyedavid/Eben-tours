import { NextResponse } from "next/server";
<<<<<<< HEAD
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

type PackageStatus = "active" | "draft" | "disabled";
=======
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
<<<<<<< HEAD
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
=======
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const actor =
      user?.fullName || user?.primaryEmailAddress?.emailAddress || "Admin";

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.package.update({
      where: { id },
      data: {
        title: body.title === undefined ? undefined : String(body.title),
        location:
          body.location === undefined ? undefined : String(body.location),
        durationDays:
          body.durationDays === undefined
            ? undefined
            : Number(body.durationDays),
        price: body.price === undefined ? undefined : Number(body.price),
        minGroup:
          body.minGroup === undefined ? undefined : Number(body.minGroup),
        maxGroup:
          body.maxGroup === undefined ? undefined : Number(body.maxGroup),
        featured:
          body.featured === undefined ? undefined : Boolean(body.featured),
        status:
          body.status === undefined
            ? undefined
            : body.status === "draft"
            ? "draft"
            : "active",

        description:
          body.description === undefined ? undefined : String(body.description),
        destination:
          body.destination === undefined ? undefined : String(body.destination),
        coverImageUrl:
          body.coverImageUrl === undefined
            ? undefined
            : String(body.coverImageUrl),
        galleryImages:
          body.galleryImages === undefined ? undefined : body.galleryImages,
        priceNote:
          body.priceNote === undefined ? undefined : String(body.priceNote),

        itinerary: body.itinerary === undefined ? undefined : body.itinerary,
        inclusions: body.inclusions === undefined ? undefined : body.inclusions,
        exclusions: body.exclusions === undefined ? undefined : body.exclusions,
        info: body.info === undefined ? undefined : body.info,

        supportPhone:
          body.supportPhone === undefined
            ? undefined
            : String(body.supportPhone),
        supportEmail:
          body.supportEmail === undefined
            ? undefined
            : String(body.supportEmail),
        whatsappUrl:
          body.whatsappUrl === undefined ? undefined : String(body.whatsappUrl),
      },
    });

    await writeAuditLog({
      entity: "package",
      action: "update",
      actor,
      summary: `Package updated: ${updated.title}`,
      href: "/admin/packages",
      clerkUserId: userId,
    });

    return NextResponse.json({ package: updated });
  } catch (err) {
    console.error("PATCH /api/admin/packages/[id] failed", err);
    return NextResponse.json(
      { error: "Server error updating package" },
      { status: 500 }
    );
  }
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
<<<<<<< HEAD
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
=======
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const actor =
      user?.fullName || user?.primaryEmailAddress?.emailAddress || "Admin";

    const { id } = await params;

    const deleted = await prisma.package.delete({ where: { id } });

    await writeAuditLog({
      entity: "package",
      action: "delete",
      actor,
      summary: `Package deleted: ${deleted.title}`,
      href: "/admin/packages",
      clerkUserId: userId,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/packages/[id] failed", err);
    return NextResponse.json(
      { error: "Server error deleting package" },
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
      { status: 500 }
    );
  }
}
