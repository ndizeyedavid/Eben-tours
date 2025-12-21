import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

type HeroMediaType = "image" | "video";

type HeroMediaRow = {
  position: 1 | 2 | 3;
  type: HeroMediaType;
  url: string;
  enabled: boolean;
};

function coerceRow(x: any): HeroMediaRow | null {
  const position = Number(x?.position);
  if (![1, 2, 3].includes(position)) return null;

  const type = String(x?.type ?? "").toLowerCase();
  if (type !== "image" && type !== "video") return null;

  const url = String(x?.url ?? "").trim();

  return {
    position: position as 1 | 2 | 3,
    type,
    url,
    enabled: Boolean(x?.enabled),
  };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.heroMedia.findMany({
    orderBy: { position: "asc" },
  });

  return NextResponse.json({
    rows: items.map((x: any) => ({
      position: x.position,
      type: x.type,
      url: x.url,
      enabled: x.enabled,
    })),
  });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rowsRaw = Array.isArray(body?.rows) ? body.rows : [];

  const rows = rowsRaw.map(coerceRow).filter(Boolean) as HeroMediaRow[];

  for (const r of rows) {
    if (!r.url) {
      await prisma.heroMedia.deleteMany({ where: { position: r.position } });
      continue;
    }

    await prisma.heroMedia.upsert({
      where: { position: r.position },
      update: {
        type: r.type as any,
        url: r.url,
        enabled: r.enabled,
      },
      create: {
        position: r.position,
        type: r.type as any,
        url: r.url,
        enabled: r.enabled,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
