import { NextResponse } from "next/server";
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
}
