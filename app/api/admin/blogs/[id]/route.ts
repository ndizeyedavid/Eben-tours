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
  content: any;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as Partial<BlogRow>;

  const data: any = {};

  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.category === "string") data.category = body.category.trim();
  if (typeof body.author === "string") data.authorName = body.author.trim();
  if (typeof body.readTime === "string") data.readTime = body.readTime.trim();
  if (body.status === "draft" || body.status === "published")
    data.status = body.status;
  if (body.content !== undefined) data.content = body.content;

  const updated = await prisma.blogPost.update({
    where: { publicId: id },
    data,
  });

  return NextResponse.json({
    row: {
      id: updated.publicId,
      title: updated.title,
      category: updated.category,
      author: updated.authorName,
      status: updated.status,
      readTime: updated.readTime,
      updatedAt: updated.updatedAt.toISOString().slice(0, 10),
      content: updated.content,
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.blogPost.delete({
    where: { publicId: id },
  });

  return NextResponse.json({ ok: true });
}
