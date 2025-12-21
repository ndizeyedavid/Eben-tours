import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packages = await prisma.package.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ packages });
  } catch (err) {
    console.error("GET /api/admin/packages failed", err);
    return NextResponse.json(
      { error: "Server error loading packages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    const actor =
      user?.fullName || user?.primaryEmailAddress?.emailAddress || "Admin";

    const body = await req.json();

    const created = await prisma.package.create({
      data: {
        title: String(body.title ?? ""),
        location: String(body.location ?? ""),
        durationDays: Number(body.durationDays ?? 1),
        price: Number(body.price ?? 0),
        minGroup: Number(body.minGroup ?? 1),
        maxGroup: Number(body.maxGroup ?? 1),
        featured: Boolean(body.featured ?? false),
        status: body.status === "draft" ? "draft" : "active",

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
      action: "create",
      actor,
      summary: `Package created: ${created.title}`,
      href: "/admin/packages",
      clerkUserId: userId,
    });

    return NextResponse.json({ package: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/packages failed", err);
    return NextResponse.json(
      { error: "Server error creating package" },
      { status: 500 }
    );
  }
}
