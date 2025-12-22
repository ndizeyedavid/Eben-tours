import {
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        background:
          "linear-gradient(135deg, rgba(30,86,49,0.95) 0%, rgba(45,90,71,0.98) 50%, rgba(30,86,49,0.95) 100%)",
        color: "#fff",
        padding: "80px 0 40px",
        marginTop: "80px",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "5%",
          opacity: 0.04,
          pointerEvents: "none",
        }}
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M150 10 Q220 50 220 150 Q220 220 150 260 Q80 220 80 150 Q80 50 150 10"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <circle
            cx="150"
            cy="150"
            r="60"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            opacity="0.6"
          />
          <circle
            cx="150"
            cy="150"
            r="90"
            fill="none"
            stroke="#fff"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 1.2fr 1.2fr 1.3fr",
            gap: "48px",
            marginBottom: "60px",
            alignItems: "start",
          }}
        >
          <div style={{ paddingRight: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "56px",
                  height: "56px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/log.webp"
                  alt="Eben Tours Logo"
                  width={48}
                  height={48}
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    background:
                      "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Eben Tours
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 500,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Safari Adventures
                </p>
              </div>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "15px",
                lineHeight: 1.8,
                margin: "0 0 24px",
                fontWeight: 400,
              }}
            >
              Experience the magic of African wilderness with expert guides and
              responsible tourism. Creating unforgettable memories across
              pristine landscapes and vibrant cultures.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <a className="footer-icon" href="#facebook" aria-label="Facebook">
                <Facebook style={{ fontSize: "18px" }} />
              </a>
              <a className="footer-icon" href="#twitter" aria-label="Twitter">
                <Twitter style={{ fontSize: "18px" }} />
              </a>
              <a
                className="footer-icon"
                href="#instagram"
                aria-label="Instagram"
              >
                <Instagram style={{ fontSize: "18px" }} />
              </a>
              <a className="footer-icon" href="#youtube" aria-label="YouTube">
                <Youtube style={{ fontSize: "18px" }} />
              </a>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "24px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))",
                  borderRadius: "2px",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "#fff",
                }}
              >
                Explore
              </h4>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "14px",
              }}
            >
              <li style={{ marginBottom: "12px" }}>
                <a className="footer-link text-white" href="#packages">
                  <ChevronRight style={{ fontSize: "12px", opacity: 0.6 }} />
                  Packages
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a className="footer-link text-white" href="#destinations">
                  <ChevronRight style={{ fontSize: "12px", opacity: 0.6 }} />
                  Destinations
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a className="footer-link text-white" href="#blog">
                  <ChevronRight style={{ fontSize: "12px", opacity: 0.6 }} />
                  Blog
                </a>
              </li>
              <li>
                <a className="footer-link text-white" href="#about">
                  <ChevronRight style={{ fontSize: "12px", opacity: 0.6 }} />
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "24px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))",
                  borderRadius: "2px",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "#fff",
                }}
              >
                Contact
              </h4>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <a className="footer-card" href="tel:+250786140897">
                <Phone
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "16px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  (+250) 786 140 897
                </span>
              </a>
              <a
                className="footer-card"
                href="mailto:administration@ebenconnections.com"
              >
                <Mail
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "13px",
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
                >
                  administration@ebenconnections.com
                </span>
              </a>
              <div className="footer-card" aria-hidden="true">
                <MapPin
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "16px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Kigali, Rwanda
                </span>
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "24px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))",
                  borderRadius: "2px",
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "#fff",
                }}
              >
                Updates
              </h4>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "13px",
                margin: "0 0 16px",
                fontWeight: 500,
              }}
            >
              Subscribe for exclusive tours and offers.
            </p>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 16px",
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.95) 100%)",
                  color: "var(--color-primary)",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))",
            margin: "60px 0 40px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              flexWrap: "wrap",
            }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
              &copy; {year} Eben Tours Safaris
            </p>
            <div
              style={{
                width: "1px",
                height: "16px",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
              All rights reserved
            </p>
            <div
              style={{
                width: "1px",
                height: "16px",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Designed by{" "}
              <a className="footer-inline-link" href="https://lerony.com">
                Lerony
              </a>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "13px",
              flexWrap: "wrap",
            }}
          >
            <a className="footer-inline-link" href="#privacy">
              Privacy
            </a>
            <a className="footer-inline-link" href="#terms">
              Terms
            </a>
            <a className="footer-inline-link" href="#sitemap">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
