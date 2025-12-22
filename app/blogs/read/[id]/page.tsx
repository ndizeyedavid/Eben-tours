import SectionHeader from "@/app/components/SectionHeader";
import BlogReaderEnhancements from "@/app/components/BlogReaderEnhancements";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";

export default async function BlogReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";

  const res = await fetch(`${origin}/api/blogs/${id}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  const post = data?.post as
    | {
        id: string;
        title: string;
        category: string;
        readTime: string;
        imageUrl?: string | null;
        excerpt?: string;
        content: string[];
      }
    | undefined;

  if (!res.ok || !post) notFound();

  return (
    <>
      <BlogReaderEnhancements
        title={post.title}
        content={post.content}
        backHref="/blogs"
      />

      <SectionHeader
        title={post.title}
        note={post.category}
        description={post.excerpt || ""}
      />

      <div className="container" style={{ paddingBottom: "60px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(30,86,49,0.12)",
            border: "1px solid rgba(30,86,49,0.08)",
          }}
        >
          <div style={{ position: "relative" }}>
            <Image
              src={post.imageUrl || "/gorila.webp"}
              alt={post.title}
              width={500}
              height={500}
              style={{ width: "100%", height: "420px", objectFit: "cover" }}
            />
          </div>

          <div style={{ padding: "28px" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "18px",
                color: "var(--muted)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <span>
                <i
                  className="fas fa-clock"
                  style={{ color: "var(--color-primary)", marginRight: "6px" }}
                />
                {post.readTime}
              </span>
              <span style={{ color: "#ccc" }}>•</span>
              <span>
                <i
                  className="fas fa-tag"
                  style={{ color: "var(--color-primary)", marginRight: "6px" }}
                />
                {post.category}
              </span>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {post.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: 0,
                    color: "var(--color-secondary)",
                    lineHeight: 1.9,
                    fontSize: "16px",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
