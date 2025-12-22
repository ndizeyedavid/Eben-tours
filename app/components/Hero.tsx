"use client";

import Image from "next/image";
import "./Hero.module.css";
import { useEffect, useMemo, useState } from "react";

type HeroMediaType = "image" | "video";
type HeroMediaRow = { position: number; type: HeroMediaType; url: string };

const fallbackSlides: HeroMediaRow[] = [
  { position: 1, type: "image", url: "/ken2.webp" },
  {
    position: 2,
    type: "video",
    url: "/vids/458150_Lion_Lions_1920x1080.webm",
  },
  {
    position: 3,
    type: "image",
    url: "/kenyaaa.webp",
  },
];

export default function Hero() {
  const [rows, setRows] = useState<HeroMediaRow[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/hero-media")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data?.rows) ? data.rows : [];
        setRows(list);
      })
      .catch(() => {
        if (!alive) return;
        setRows([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const slides = useMemo(() => {
    const valid = rows
      .map((x: any) => ({
        position: Number(x?.position),
        type: x?.type === "image" || x?.type === "video" ? x.type : "image",
        url: String(x?.url ?? "").trim(),
      }))
      .filter((x) => [1, 2, 3].includes(x.position) && Boolean(x.url));

    return valid.length ? valid : fallbackSlides;
  }, [rows]);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const t = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <section
      className="video-hero"
      style={{ position: "relative", overflow: "hidden", minHeight: "90vh" }}
    >
      <div
        className="video-carousel"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {slides.map((s, idx) =>
          s.type === "video" ? (
            <video
              key={`${s.position}-${s.url}`}
              className="carousel-video"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: idx === active ? "block" : "none",
                filter: "brightness(0.6)",
              }}
              src={s.url}
            />
          ) : (
            <Image
              key={`${s.position}-${s.url}`}
              className="carousel-video"
              width={500}
              height={500}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: idx === active ? "block" : "none",
                filter: "brightness(0.6)",
              }}
              src={s.url}
              alt="Hero"
            />
          )
        )}
      </div>
      <div
        className="video-hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "520px",
          padding: "80px 20px 60px 20px",
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "48px",
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          The Ultimate Bespoke African Safari Experience Let the Adventure Begin
        </h1>

        <div
          className="mt-12"
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <a
            href="#packages"
            className="cta-primary transition-all hover:opacity-80 cursor-pointer"
            style={{
              flex: 1,
              background:
                "linear-gradient(135deg,rgba(30, 86, 49, 0.8),rgba(41, 81, 53, 0.8))",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.3px",
              backdropFilter: "blur(10px)",
              fontSize: "18px",
            }}
          >
            View Packages
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Contact Guide
          </a>
        </div>
      </div>

      <div className="overlay"></div>

      <div className="carousel-indicators" id="carouselIndicators">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`indicator${idx === active ? " active" : ""}`}
            onClick={() => setActive(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
}
