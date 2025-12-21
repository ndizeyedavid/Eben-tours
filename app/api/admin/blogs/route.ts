import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

type PostStatus = "draft" | "published";

type BlogRow = {
  id: string;
  title: string;
  category: string;
  author: string;
  status: PostStatus;
  readTime: string;
  updatedAt: string;
  content: any;
};

function toRow(p: any): BlogRow {
  return {
    id: p.publicId,
    title: p.title,
    category: p.category,
    author: p.authorName,
    status: p.status,
    readTime: p.readTime,
    updatedAt: p.updatedAt.toISOString().slice(0, 10),
    content: p.content,
  };
}

function newPublicId() {
  return `BLG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ rows: posts.map(toRow) });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<BlogRow>;

  const title = String(body.title ?? "").trim();
  const category = String(body.category ?? "").trim();
  const author = String(body.author ?? "Admin").trim() || "Admin";
  const readTime = String(body.readTime ?? "6 min").trim() || "6 min";
  const status = (body.status ?? "draft") as PostStatus;
  const content = body.content ?? { ops: [{ insert: "\n" }] };

  if (!title)
    return NextResponse.json({ error: "title required" }, { status: 400 });
  if (!category)
    return NextResponse.json({ error: "category required" }, { status: 400 });

  const created = await prisma.blogPost.create({
    data: {
      publicId:
        typeof body.id === "string" && body.id.trim()
          ? body.id.trim()
          : newPublicId(),
      title,
      category,
      authorName: author,
      status,
      readTime,
      content,
    },
  });

  return NextResponse.json({ row: toRow(created) });
}
