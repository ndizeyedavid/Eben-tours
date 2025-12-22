import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Safari",
  description:
    "Request a booking with Eben Tours Safaris. Choose a package, share your travel details, and we’ll confirm availability.",
  alternates: {
    canonical: "/book",
  },
};

export default function BookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
