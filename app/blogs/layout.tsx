import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Read travel stories, safari tips, and destination guides from Eben Tours Safaris.",
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
