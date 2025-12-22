import Link from "next/link";
import type { BlogPost } from "../blogs/blogsData";
import { Clock, Shield } from "lucide-react";
import Image from "next/image";

export default function SingleBlog({ post }: { post: BlogPost }) {
  return (
    <article className="card">
      <Image
        width={100}
        height={100}
        src={post.image || "/gorila.webp"}
        alt={post.title}
        loading="lazy"
      />
      <div>
        <h3>{post.title}</h3>
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            lineHeight: 1.5,
            margin: 0,
            flex: 1,
          }}
        >
          {post.excerpt}
        </p>
        <p className="meta">
          <Clock size={14} style={{ color: "var(--color-primary)" }} />{" "}
          {post.readTime} <span style={{ color: "#ccc" }}>•</span>{" "}
          <Shield size={14} style={{ color: "var(--color-primary)" }} />{" "}
          {post.category}
          {post.category}
        </p>
        <Link href={`/blogs/read/${post.id}`} className="read-more">
          Read Article
        </Link>
      </div>
    </article>
  );
}
