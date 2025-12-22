import { ArrowRight, InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IDestinationCard {
  bg: string;
  flag: string;
  isFeatured: boolean;
  title: string;
  description: string;
  peakSeason: string;
  href?: string;
}
export default function DestinationCard({
  bg,
  flag,
  isFeatured,
  title,
  description,
  peakSeason,
  href = "#",
}: IDestinationCard) {
  return (
    <div
      className="destination-card"
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(30,86,49,0.12)",
        transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        className="destination-image"
        style={{
          position: "relative",
          overflow: "hidden",
          height: "280px",
          background: "linear-gradient(135deg, #1E5631 0%, #295135 100%)",
          transition: "all 0.6s ease",
        }}
      >
        <Image
          src={bg}
          alt={title}
          width={500}
          height={500}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.6s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(135deg, rgba(30,86,49,0.4), rgba(30,86,49,0.6))",
            transition: "all 0.4s ease",
          }}
        ></div>

        {isFeatured && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.95)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "12px",
              color: "var(--color-primary)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Featured
          </div>
        )}
      </div>

      <div className="destination-content" style={{ padding: "28px" }}>
        <h3
          style={{
            margin: "0 0 12px",
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--color-primary)",
            fontFamily: "var(--font-serif)",
          }}
        >
          <Image
            src={flag}
            alt={title + " Flag"}
            width={28}
            height={28}
            style={{
              width: "28px",
              height: "auto",
              marginRight: "8px",
              display: "inline-block",
              verticalAlign: "middle",
              borderRadius: "4px",
            }}
          />
          {title}
        </h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "14px",
            lineHeight: "1.6",
            margin: "0 0 16px",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            margin: "16px 0",
            padding: "12px 0",
            borderTop: "1px solid rgba(30,86,49,0.1)",
            borderBottom: "1px solid rgba(30,86,49,0.1)",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <InfoIcon size={15} style={{ color: "var(--color-primary)" }} />
            Peak Season: {peakSeason}
          </span>
        </div>

        <Link
          href={`/packages?filter=${title.toLowerCase()}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-primary)",
            fontWeight: "700",
            textDecoration: "none",
            transition: "all 0.3s ease",
            fontSize: "14px",
          }}
        >
          Explore <ArrowRight size={18} className="relative top-0.5" />
        </Link>
      </div>
    </div>
  );
}
