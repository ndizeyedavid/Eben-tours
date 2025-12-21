import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      { status: 500 }
    );
  }
}
