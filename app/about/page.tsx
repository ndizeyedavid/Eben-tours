import {
  ArrowRight,
  Check,
  Crown,
  Gem,
  Handshake,
  Heart,
  Leaf,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Eben Tours Safaris—our story, values, and commitment to crafting unforgettable African safari experiences with expert guides and sustainable tourism.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section
      className="about-us"
      id="about"
      style={{
        padding: "80px 0",
        background:
          "linear-gradient(135deg, rgba(30, 86, 49, 0.03) 0%, rgba(41, 81, 53, 0.03) 100%)",
      }}
    >
      <div className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "80px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "4px",
              background:
                "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
              borderRadius: "2px",
            }}
          />

          <div
            style={{
              display: "inline-block",
              padding: "10px 24px",
              background:
                "linear-gradient(135deg, rgba(30, 86, 49, 0.08), rgba(41, 81, 53, 0.05))",
              borderRadius: "30px",
              border: "1.5px solid var(--color-primary)",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--color-primary)",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Star
                size={16}
                style={{ marginRight: "6px", color: "var(--color-primary)" }}
              />
              OUR STORY
            </p>
          </div>

          <h2
            style={{
              fontSize: "56px",
              color: "var(--color-secondary)",
              margin: "0 0 20px 0",
              letterSpacing: "-1px",
              fontWeight: 800,
            }}
          >
            About Eben Tours Safaris
          </h2>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "18px",
                color: "var(--muted)",
                lineHeight: 1.9,
                fontWeight: 500,
              }}
            >
              Crafting unforgettable African safari experiences with passion,
              expertise, and sustainable tourism practices. We believe every
              journey should be transformative.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "-12px",
                right: "-12px",
                bottom: "-12px",
                background:
                  "linear-gradient(135deg, rgba(30, 86, 49, 0.1), rgba(41, 81, 53, 0.05))",
                borderRadius: "20px",
                zIndex: -1,
              }}
            />

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "18px",
                height: "520px",
                boxShadow: "0 30px 80px rgba(30, 86, 49, 0.2)",
                border: "2px solid rgba(30, 86, 49, 0.08)",
              }}
            >
              <img
                src="/lion.webp"
                alt="Safari Adventure"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition:
                    "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "32px",
                  left: "32px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.98), rgba(41, 81, 53, 0.98))",
                  padding: "24px 32px",
                  borderRadius: "14px",
                  color: "white",
                  backdropFilter: "blur(15px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 20px 50px rgba(30, 86, 49, 0.3)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontWeight: 800,
                    color: "white",
                    fontSize: "32px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  500+
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.95)",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  SATISFIED ADVENTURERS
                </p>
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                background: "rgba(30, 86, 49, 0.08)",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "1px solid rgba(30, 86, 49, 0.15)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trophy
                  size={16}
                  style={{ marginRight: "6px", color: "var(--color-primary)" }}
                />
                PREMIUM EXPERIENCE
              </p>
            </div>

            <h3
              style={{
                fontSize: "40px",
                color: "var(--color-secondary)",
                margin: "0 0 24px 0",
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              The Eben Experience
            </h3>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.9,
                color: "var(--color-secondary)",
                margin: "0 0 20px 0",
                fontWeight: 500,
              }}
            >
              Since 2015, Eben Tours Safaris has been your gateway to the most
              pristine wilderness experiences in East Africa. We believe that
              travel is more than just visiting places — it's about creating
              authentic connections with nature, culture, and fellow
              adventurers.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.9,
                color: "var(--muted)",
                margin: "0 0 32px 0",
                fontWeight: 500,
              }}
            >
              Our expert guides, carefully curated routes, and commitment to
              sustainable tourism ensure that every safari with us becomes a
              cherished memory. From the majestic volcanoes of Rwanda to the
              vast savannahs of Kenya, we deliver excellence at every step of
              your journey.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "20px",
                  background: "rgba(30, 86, 49, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(30, 86, 49, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "44px",
                    height: "44px",
                    background:
                      "linear-gradient(135deg, rgba(30, 86, 49, 0.2), rgba(41, 81, 53, 0.1))",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid rgba(30, 86, 49, 0.25)",
                  }}
                >
                  <Check
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "18px",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: 800,
                      color: "var(--color-secondary)",
                      fontSize: "15px",
                    }}
                  >
                    Expert Guides
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    Certified professionals with 10+ years of experience
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "20px",
                  background: "rgba(30, 86, 49, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(30, 86, 49, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "44px",
                    height: "44px",
                    background:
                      "linear-gradient(135deg, rgba(30, 86, 49, 0.2), rgba(41, 81, 53, 0.1))",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid rgba(30, 86, 49, 0.25)",
                  }}
                >
                  <Leaf
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "18px",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: 800,
                      color: "var(--color-secondary)",
                      fontSize: "15px",
                    }}
                  >
                    Sustainable Tourism
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    Carbon-neutral operations & eco-friendly practices
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "20px",
                  background: "rgba(30, 86, 49, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(30, 86, 49, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "44px",
                    height: "44px",
                    background:
                      "linear-gradient(135deg, rgba(30, 86, 49, 0.2), rgba(41, 81, 53, 0.1))",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid rgba(30, 86, 49, 0.25)",
                  }}
                >
                  <MapPin
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "18px",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: 800,
                      color: "var(--color-secondary)",
                      fontSize: "15px",
                    }}
                  >
                    Diverse Destinations
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    4+ premium locations across East Africa
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  padding: "20px",
                  background: "rgba(30, 86, 49, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(30, 86, 49, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: "44px",
                    height: "44px",
                    background:
                      "linear-gradient(135deg, rgba(30, 86, 49, 0.2), rgba(41, 81, 53, 0.1))",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid rgba(30, 86, 49, 0.25)",
                  }}
                >
                  <Crown
                    style={{
                      color: "var(--color-primary)",
                      fontSize: "18px",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: 800,
                      color: "var(--color-secondary)",
                      fontSize: "15px",
                    }}
                  >
                    Premium Quality
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    5-star accommodations & white-glove service
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/destination"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 40px",
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                color: "white",
                borderRadius: "12px",
                fontWeight: 800,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                border: "2px solid transparent",
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "15px",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                boxShadow: "0 12px 40px rgba(30, 86, 49, 0.25)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <ArrowRight style={{ fontSize: "16px" }} />
              Start Your Adventure
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: "100px", marginTop: "100px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                background: "rgba(30, 86, 49, 0.08)",
                borderRadius: "8px",
                marginBottom: "16px",
                border: "1px solid rgba(30, 86, 49, 0.15)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Gem
                  size={16}
                  style={{ marginRight: "6px", color: "var(--color-primary)" }}
                />
                WHAT DRIVES US
              </p>
            </div>
            <h3
              style={{
                fontSize: "48px",
                textAlign: "center",
                color: "var(--color-secondary)",
                margin: 0,
                fontWeight: 800,
              }}
            >
              Our Core Values
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            <div
              style={{
                padding: "40px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 247, 244, 0.8))",
                borderRadius: "18px",
                border: "1.5px solid rgba(30, 86, 49, 0.12)",
                boxShadow: "0 10px 35px rgba(30, 86, 49, 0.08)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "120px",
                  height: "120px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.08), transparent)",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.18), rgba(41, 81, 53, 0.12))",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "1.5px solid rgba(30, 86, 49, 0.2)",
                }}
              >
                <Heart
                  style={{ color: "var(--color-primary)", fontSize: "28px" }}
                />
              </div>
              <h4
                style={{
                  fontSize: "20px",
                  color: "var(--color-secondary)",
                  margin: "0 0 12px 0",
                  fontWeight: 800,
                }}
              >
                Passion
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "var(--muted)",
                  fontWeight: 500,
                }}
              >
                We are deeply passionate about sharing the wonders of African
                wilderness with adventurers. Every journey reflects our love for
                nature.
              </p>
            </div>

            <div
              style={{
                padding: "40px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 247, 244, 0.8))",
                borderRadius: "18px",
                border: "1.5px solid rgba(30, 86, 49, 0.12)",
                boxShadow: "0 10px 35px rgba(30, 86, 49, 0.08)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "120px",
                  height: "120px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.08), transparent)",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.18), rgba(41, 81, 53, 0.12))",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "1.5px solid rgba(30, 86, 49, 0.2)",
                }}
              >
                <Handshake
                  style={{ color: "var(--color-primary)", fontSize: "28px" }}
                />
              </div>
              <h4
                style={{
                  fontSize: "20px",
                  color: "var(--color-secondary)",
                  margin: "0 0 12px 0",
                  fontWeight: 800,
                }}
              >
                Integrity
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "var(--muted)",
                  fontWeight: 500,
                }}
              >
                Honesty, transparency, and authenticity form the foundation of
                every interaction. Your trust is our greatest asset.
              </p>
            </div>

            <div
              style={{
                padding: "40px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(250, 247, 244, 0.8))",
                borderRadius: "18px",
                border: "1.5px solid rgba(30, 86, 49, 0.12)",
                boxShadow: "0 10px 35px rgba(30, 86, 49, 0.08)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "120px",
                  height: "120px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.08), transparent)",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, rgba(30, 86, 49, 0.18), rgba(41, 81, 53, 0.12))",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "1.5px solid rgba(30, 86, 49, 0.2)",
                }}
              >
                <Leaf
                  style={{ color: "var(--color-primary)", fontSize: "28px" }}
                />
              </div>
              <h4
                style={{
                  fontSize: "20px",
                  color: "var(--color-secondary)",
                  margin: "0 0 12px 0",
                  fontWeight: 800,
                }}
              >
                Sustainability
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "var(--muted)",
                  fontWeight: 500,
                }}
              >
                Protecting our planet and respecting local communities ensures
                extraordinary safaris for generations to come.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
            borderRadius: "20px",
            padding: "80px 60px",
            color: "white",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "50px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 80px rgba(30, 86, 49, 0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              left: "-50px",
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "48px",
                fontWeight: 900,
                fontFamily: "var(--font-serif)",
                letterSpacing: "-1px",
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              500+
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Happy Adventurers
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "48px",
                fontWeight: 900,
                fontFamily: "var(--font-serif)",
                letterSpacing: "-1px",
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              8+
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Years of Experience
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "48px",
                fontWeight: 900,
                fontFamily: "var(--font-serif)",
                letterSpacing: "-1px",
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              15+
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Premium Tours
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "48px",
                fontWeight: 900,
                fontFamily: "var(--font-serif)",
                letterSpacing: "-1px",
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              4
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Countries Covered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
