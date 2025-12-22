import type { MetadataRoute } from "next";
import { prisma } from "@/app/lib/prisma";

function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://ebentours.com";
  return raw.replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/destination`, lastModified: new Date() },
    { url: `${base}/packages`, lastModified: new Date() },
    { url: `${base}/blogs`, lastModified: new Date() },
    { url: `${base}/book`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  const packages = await prisma.package.findMany({
    where: { status: "active" },
    select: { publicId: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const packageRoutes: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${base}/packages/details/${encodeURIComponent(p.publicId)}`,
    lastModified: p.updatedAt,
  }));

  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { publicId: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blogs/read/${encodeURIComponent(p.publicId)}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes];
}
