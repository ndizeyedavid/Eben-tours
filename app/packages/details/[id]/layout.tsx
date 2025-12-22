import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const pkg = await prisma.package.findUnique({
    where: { publicId: id },
    select: {
      publicId: true,
      title: true,
      description: true,
      imageUrl: true,
      location: true,
      country: true,
      updatedAt: true,
      status: true,
    },
  });

  if (!pkg || pkg.status !== "active") {
    return {
      title: "Package Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = pkg.title || "Safari Package";
  const description =
    (pkg.description ?? "").trim() ||
    `Discover ${title} with Eben Tours Safaris. Explore ${
      pkg.location || "East Africa"
    } with expert guides and seamless booking.`;

  const image = pkg.imageUrl || "/Logo-011.webp";
  const url = `/packages/details/${encodeURIComponent(pkg.publicId)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function PackageDetailsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
