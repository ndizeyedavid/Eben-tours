import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";
import "quill/dist/quill.snow.css";
import { ClerkProvider } from "@clerk/nextjs";
import PublicShell from "./components/PublicShell";
import { Toaster } from "sonner";
import RouteProgress from "./components/RouteProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    (
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      "https://ebentours.com"
    ).replace(/\/$/, "")
  ),
  title: {
    default: "Eben Tours Safaris",
    template: "%s | Eben Tours Safaris",
  },
  description:
    "Bespoke African safari experiences with Eben Tours Safaris. Explore Rwanda, Kenya, Tanzania & Uganda with curated packages, expert guides, and seamless booking.",
  applicationName: "Eben Tours Safaris",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Eben Tours Safaris",
    description:
      "Bespoke African safari experiences with curated tours, expert guides, and easy online booking.",
    siteName: "Eben Tours Safaris",
    images: [
      {
        url: "/Logo-011.webp",
        width: 512,
        height: 512,
        alt: "Eben Tours Safaris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eben Tours Safaris",
    description:
      "Bespoke African safari experiences with curated tours, expert guides, and easy online booking.",
    images: ["/Logo-011.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/log.webp",
    apple: "/favicon-apple.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <RouteProgress />
          <Toaster richColors position="top-right" />
          <PublicShell>{children}</PublicShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
