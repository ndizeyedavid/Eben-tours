import { NextResponse } from "next/server";
<<<<<<< HEAD
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

type PackageStatus = "active" | "draft" | "disabled";

type PackageRow = {
  id: string;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  maxGroup: number;
  featured: boolean;
  status: PackageStatus;
  updatedAt: string;
};

function toRow(p: any): PackageRow {
  return {
    id: p.publicId,
    title: p.title,
    location: p.location,
    durationDays: p.durationDays,
    price: p.price,
    maxGroup: p.maxGroup,
    featured: p.featured,
    status: p.status,
    updatedAt: p.updatedAt.toISOString().slice(0, 10),
  };
}

function newPublicId() {
  return `PKG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const packages = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ rows: packages.map(toRow) });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<PackageRow>;

  const title = String(body.title ?? "").trim();
  const location = String(body.location ?? "").trim();
  const durationDays = Number(body.durationDays);
  const price = Number(body.price);
  const maxGroup = Number(body.maxGroup);
  const featured = Boolean(body.featured);
  const status = (body.status ?? "active") as PackageStatus;

  if (!title)
    return NextResponse.json({ error: "title required" }, { status: 400 });
  if (!location)
    return NextResponse.json({ error: "location required" }, { status: 400 });
  if (!Number.isFinite(durationDays) || durationDays <= 0)
    return NextResponse.json(
      { error: "durationDays invalid" },
      { status: 400 }
    );
  if (!Number.isFinite(price) || price <= 0)
    return NextResponse.json({ error: "price invalid" }, { status: 400 });
  if (!Number.isFinite(maxGroup) || maxGroup <= 0)
    return NextResponse.json({ error: "maxGroup invalid" }, { status: 400 });

  const created = await prisma.package.create({
    data: {
      publicId:
        typeof body.id === "string" && body.id.trim()
          ? body.id.trim()
          : newPublicId(),
      title,
      location,
      durationDays,
      price,
      maxGroup,
      featured,
      status,
    },
  });

  return NextResponse.json({ row: toRow(created) });
=======
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
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
}
