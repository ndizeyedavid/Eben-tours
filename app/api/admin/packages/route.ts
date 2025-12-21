import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

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
  const country = (body.country ?? "rwanda") as PackageCountry;
  const location = String(body.location ?? "").trim();
  const durationDays = Number(body.durationDays);
  const price = Number(body.price);
  const maxGroup = Number(body.maxGroup);
  const featured = Boolean(body.featured);
  const status = (body.status ?? "active") as PackageStatus;
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : null;
  const description =
    typeof body.description === "string" ? body.description.trim() : null;
  const itinerary = body.itinerary ?? null;
  const inclusions = body.inclusions ?? null;
  const exclusions = body.exclusions ?? null;
  const info = body.info ?? null;

  if (!title)
    return NextResponse.json({ error: "title required" }, { status: 400 });
  if (
    !(["rwanda", "kenya", "tanzania", "uganda"] as string[]).includes(country)
  )
    return NextResponse.json({ error: "country invalid" }, { status: 400 });
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
      country,
      location,
      durationDays,
      price,
      maxGroup,
      imageUrl,
      description,
      itinerary,
      inclusions,
      exclusions,
      info,
      featured,
      status,
    } as any,
  });

  return NextResponse.json({ row: toRow(created) });
}
