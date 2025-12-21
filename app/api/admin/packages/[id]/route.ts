import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

type PackageStatus = "active" | "draft" | "disabled";
type PackageCountry = "rwanda" | "kenya" | "tanzania" | "uganda";

type PackageRow = {
  id: string;
  title: string;
  country: PackageCountry;
  location: string;
  durationDays: number;
  price: number;
  maxGroup: number;
  imageUrl?: string | null;
  description?: string | null;
  itinerary?: unknown;
  inclusions?: unknown;
  exclusions?: unknown;
  info?: unknown;
  featured: boolean;
  status: PackageStatus;
  updatedAt: string;
};

function toRow(p: any): PackageRow {
  return {
    id: p.publicId,
    title: p.title,
    country: p.country,
    location: p.location,
    durationDays: p.durationDays,
    price: p.price,
    maxGroup: p.maxGroup,
    imageUrl: p.imageUrl,
    description: p.description,
    itinerary: p.itinerary,
    inclusions: p.inclusions,
    exclusions: p.exclusions,
    info: p.info,
    featured: p.featured,
    status: p.status,
    updatedAt: p.updatedAt.toISOString().slice(0, 10),
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const pkg = await prisma.package.findUnique({
    where: { publicId: id },
  });

  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ row: toRow(pkg) });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = (await req.json()) as Partial<PackageRow>;

  const updated = await prisma.package.update({
    where: { publicId: id },
    data: {
      ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
      ...(typeof body.country === "string"
        ? { country: body.country as any }
        : {}),
      ...(typeof body.location === "string"
        ? { location: body.location.trim() }
        : {}),
      ...(typeof body.durationDays === "number"
        ? { durationDays: body.durationDays }
        : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(typeof body.maxGroup === "number" ? { maxGroup: body.maxGroup } : {}),
      ...(typeof body.imageUrl === "string"
        ? { imageUrl: body.imageUrl.trim() || null }
        : {}),
      ...(typeof body.description === "string"
        ? { description: body.description.trim() || null }
        : {}),
      ...("itinerary" in body ? { itinerary: body.itinerary ?? null } : {}),
      ...("inclusions" in body ? { inclusions: body.inclusions ?? null } : {}),
      ...("exclusions" in body ? { exclusions: body.exclusions ?? null } : {}),
      ...("info" in body ? { info: body.info ?? null } : {}),
      ...(typeof body.featured === "boolean"
        ? { featured: body.featured }
        : {}),
      ...(typeof body.status === "string" ? { status: body.status } : {}),
    } as any,
  });

  return NextResponse.json({ row: toRow(updated) });
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
