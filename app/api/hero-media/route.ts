import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const items = await prisma.heroMedia.findMany({
    where: { enabled: true },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({
    rows: items.map((x: any) => ({
      position: x.position,
      type: x.type,
      url: x.url,
    })),
  });
}
