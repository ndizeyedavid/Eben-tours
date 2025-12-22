import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safari Packages",
  description:
    "Browse Eben Tours Safaris packages across East Africa. Find curated itineraries, transparent pricing, and book your next adventure.",
  alternates: {
    canonical: "/packages",
  },
};

export default function PackagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
