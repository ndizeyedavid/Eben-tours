import Image from "next/image";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DestinationSection from "./components/DestinationSection";
import CtaSection from "./components/CtaSection";
import Link from "next/link";
import SinglePackage from "./components/SinglePackage";
import PartnersSection from "./components/PartnersSection";
import SingleBlog from "./components/SingleBlog";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import { prisma } from "@/app/lib/prisma";
import type { BlogPost } from "./blogs/blogsData";
import type { Metadata } from "next";
import { Suspense } from "react";
import HomeLoading from "./components/HomeLoading";

export const metadata: Metadata = {
  title: "Eben Tours Safaris",
  description:
    "Bespoke African safari experiences with Eben Tours Safaris. Explore Rwanda, Kenya, Tanzania & Uganda with curated packages, expert guides, and seamless booking.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Eben Tours Safaris",
    description:
      "Bespoke African safari experiences with curated tours, expert guides, and easy online booking.",
    images: [
      {
        url: "/Logo-011.webp",
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
};

function deltaToParagraphs(delta: unknown): string[] {
  const ops = (delta as any)?.ops;
  if (!Array.isArray(ops)) return [];

  const text = ops
    .map((op: any) => (typeof op?.insert === "string" ? op.insert : ""))
    .join("");

  return text
    .split(/\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function excerptFromParagraphs(paragraphs: string[]): string {
  const joined = paragraphs.join(" ").trim();
  if (!joined) return "";
  if (joined.length <= 170) return joined;
  return `${joined.slice(0, 170).trim()}...`;
}

export default async function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const packages = await prisma.package.findMany({
    where: { status: "active" },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });

  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  const blogRows: BlogPost[] = posts.map((p: any) => {
    const paragraphs = deltaToParagraphs(p.content);
    return {
      id: p.publicId,
      title: p.title,
      excerpt: excerptFromParagraphs(paragraphs),
      image: p.imageUrl || "/gorila.webp",
      readTime: p.readTime,
      category: p.category,
      content: paragraphs,
    };
  });

  return (
    <>
      <Hero />
      <main className="container" id="home">
        <h2
          style={{
            position: "relative",
            zIndex: 10,
            marginTop: "60px",
            marginBottom: "30px",
            fontWeight: "600",
            fontSize: "36px",
          }}
        >
          Our Major Destinations
        </h2>
        <DestinationSection />
      </main>

      <CtaSection />

      <main className="container mb-[70px]!" id="home">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex flex-col">
            <h2
              style={{
                position: "relative",
                zIndex: 10,
                fontWeight: "600",
                fontSize: "36px",
              }}
            >
              Eben Safaris Packages
            </h2>
            <p>Browse for more packages</p>
          </div>
          <Link
            href="/packages"
            className="hover:translate-x-2"
            style={{
              fontWeight: 700,
              color: "var(--color-primary)",
              fontSize: "15px",
              transition: "all 0.3s ease",
            }}
          >
            View all Packages →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {packages.map((p) => (
            <SinglePackage
              key={p.publicId}
              id={p.publicId}
              title={p.title}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              featured={p.featured}
            />
          ))}
        </div>
      </main>

      {/* Testimonials */}
      <main className="container mb-[70px]!" id="home">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex flex-col">
            <h2
              style={{
                position: "relative",
                zIndex: 10,
                fontWeight: "600",
                fontSize: "36px",
              }}
            >
              What our guests say
            </h2>
            <p>Real reviews from Google - See what travelers think</p>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "28px",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div
            className="elfsight-app-956a7f1b-131c-40ea-8f4f-0bfe763eba98"
            data-elfsight-app-lazy
          ></div>
        </div>
      </main>

      {/* Partners */}
      <main className="container mb-[70px]!" id="home">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex flex-col">
            <h2
              style={{
                position: "relative",
                zIndex: 10,
                fontWeight: "600",
                fontSize: "36px",
              }}
            >
              Our Partners
            </h2>
          </div>
        </div>

        <PartnersSection />
      </main>

      {/* blog section */}
      <main className="container mb-[70px]!" id="home">
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex flex-col">
            <h2
              style={{
                position: "relative",
                zIndex: 10,
                fontWeight: "600",
                fontSize: "36px",
              }}
            >
              Latest from our Journal
            </h2>
            <p>Stories, tips, and insights from the trail</p>
          </div>
          <Link
            href="/blogs"
            className="hover:translate-x-2"
            style={{
              fontWeight: 700,
              color: "var(--color-primary)",
              fontSize: "15px",
              transition: "all 0.3s ease",
            }}
          >
            View all Posts →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {blogRows.map((post) => (
            <SingleBlog key={post.id} post={post} />
          ))}
        </div>
      </main>

      <ContactForm />
      {/* <HomeLoading /> */}
    </>
  );
}
