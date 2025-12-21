import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function toListRow(p: any) {
  return {
    id: p.publicId,
    title: p.title,
    country: p.country,
    location: p.location,
    durationDays: p.durationDays,
    price: p.price,
    maxGroup: p.maxGroup,
    featured: p.featured,
    imageUrl: p.imageUrl,
    description: p.description,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = String(searchParams.get("country") ?? "")
    .trim()
    .toLowerCase();
  const countryFilter = (
    ["rwanda", "kenya", "tanzania", "uganda"] as string[]
  ).includes(country)
    ? (country as any)
    : null;

  const rows = await prisma.package.findMany({
    where: {
      status: "active",
      ...(countryFilter ? { country: countryFilter } : {}),
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ rows: rows.map(toListRow) });
}
