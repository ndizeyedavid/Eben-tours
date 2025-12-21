import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function coerceStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x ?? "").trim()).filter(Boolean);
}

function coerceItinerary(
  v: unknown
): Array<{ time: string; activity: string; description: string }> {
  if (!Array.isArray(v)) return [];
  return v
    .map((x: any) => ({
      time: String(x?.time ?? "").trim(),
      activity: String(x?.activity ?? "").trim(),
      description: String(x?.description ?? "").trim(),
    }))
    .filter((x) => x.time || x.activity || x.description);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const p = await prisma.package.findUnique({
    where: { publicId: id },
  });

  if (!p || p.status !== "active")
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    package: {
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
      itinerary: coerceItinerary(p.itinerary),
      inclusions: coerceStringArray(p.inclusions),
      exclusions: coerceStringArray(p.exclusions),
      info: coerceStringArray(p.info),
    },
  });
}
