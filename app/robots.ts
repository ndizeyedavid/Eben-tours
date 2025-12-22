import type { MetadataRoute } from "next";

function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://ebentours.com";
  return raw.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
