"use client";

import SectionHeader from "@/app/components/SectionHeader";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PhoneInput } from "react-international-phone";

type TabKey = "itinerary" | "inclusions" | "exclusions" | "info";

type ItineraryItem = {
  time: string;
  activity: string;
  description: string;
};

type PackageDetailsRow = {
  id: string;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  maxGroup: number;
  featured: boolean;
  imageUrl?: string | null;
  description?: string | null;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  info: string[];
};

export default function PackageDetails() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? "");
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState<PackageDetailsRow | null>(null);

  useEffect(() => {
    let alive = true;
    if (!id) return;
    setLoading(true);
    fetch(`/api/packages/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setPkg(data?.package ?? null);
      })
      .catch(() => {
        if (!alive) return;
        setPkg(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const safePkg = useMemo(() => {
    if (!pkg)
      return {
        id,
        title: "Package",
        location: "",
        durationDays: 1,
        price: 0,
        maxGroup: 0,
        featured: false,
        imageUrl: null,
        description: null,
        itinerary: [] as ItineraryItem[],
        inclusions: [] as string[],
        exclusions: [] as string[],
        info: [] as string[],
      };
    return pkg;
  }, [id, pkg]);

  const durationLabel = `${safePkg.durationDays} Day${
    safePkg.durationDays === 1 ? "" : "s"
  }`;
  return (
    <>
      <SectionHeader
        title={loading ? "Loading..." : safePkg.title}
        note="Tour Details"
        description={
          loading
            ? ""
            : safePkg.description ||
              "Discover this tour package and create unforgettable memories."
        }
      />

      <div className="container">
        <div
          style={{
            width: "100%",
            height: "500px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(30,86,49,0.15)",
            marginBottom: "60px",
          }}
        >
          <img
            src={safePkg.imageUrl || "/canopy_walk.jpg"}
            alt={safePkg.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "40px",
            marginBottom: "60px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: "4px solid var(--color-primary)",
                  boxShadow: "0 4px 12px rgba(30,86,49,0.08)",
                }}
              >
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                  }}
                >
                  <i
                    className="fas fa-calendar"
                    style={{ marginRight: "6px" }}
                  />
                  Duration
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {durationLabel}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: "4px solid var(--color-primary)",
                  boxShadow: "0 4px 12px rgba(30,86,49,0.08)",
                }}
              >
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                  }}
                >
                  <i
                    className="fas fa-map-marker-alt"
                    style={{ marginRight: "6px" }}
                  />
                  Destination
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {safePkg.location || "-"}
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: "4px solid var(--color-primary)",
                  boxShadow: "0 4px 12px rgba(30,86,49,0.08)",
                }}
              >
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                  }}
                >
                  <i
                    className="fas fa-people-group"
                    style={{ marginRight: "6px" }}
                  />
                  Min Group
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {safePkg.maxGroup ? `${safePkg.maxGroup} People` : "-"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 0,
                marginBottom: "32px",
                borderBottom: "2px solid rgba(30,86,49,0.1)",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="tab-btn"
                onClick={() => setActiveTab("itinerary")}
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  color:
                    activeTab === "itinerary"
                      ? "var(--color-primary)"
                      : "var(--muted)",
                  borderBottom:
                    activeTab === "itinerary"
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-map" style={{ marginRight: "8px" }} />
                Itinerary
              </button>

              <button
                type="button"
                className="tab-btn"
                onClick={() => setActiveTab("inclusions")}
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  color:
                    activeTab === "inclusions"
                      ? "var(--color-primary)"
                      : "var(--muted)",
                  borderBottom:
                    activeTab === "inclusions"
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{ marginRight: "8px" }}
                />
                Inclusions
              </button>

              <button
                type="button"
                className="tab-btn"
                onClick={() => setActiveTab("exclusions")}
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  color:
                    activeTab === "exclusions"
                      ? "var(--color-primary)"
                      : "var(--muted)",
                  borderBottom:
                    activeTab === "exclusions"
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ marginRight: "8px" }}
                />
                Exclusions
              </button>

              <button
                type="button"
                className="tab-btn"
                onClick={() => setActiveTab("info")}
                style={{
                  padding: "16px 24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  color:
                    activeTab === "info"
                      ? "var(--color-primary)"
                      : "var(--muted)",
                  borderBottom:
                    activeTab === "info"
                      ? "3px solid var(--color-primary)"
                      : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className="fas fa-info-circle"
                  style={{ marginRight: "8px" }}
                />
                Info
              </button>
            </div>

            {activeTab === "itinerary" && (
              <div className="tab-content">
                <h2
                  style={{
                    fontSize: "28px",
                    margin: "0 0 32px",
                    color: "var(--color-secondary)",
                  }}
                >
                  Tour Itinerary
                </h2>

                {safePkg.itinerary.length ? (
                  safePkg.itinerary.map((item, idx) => (
                    <div
                      key={`${item.time}-${idx}`}
                      style={{
                        display: "flex",
                        gap: "24px",
                        marginBottom:
                          idx === safePkg.itinerary.length - 1 ? 0 : "40px",
                        position: "relative",
                        paddingBottom:
                          idx === safePkg.itinerary.length - 1 ? 0 : "40px",
                        borderBottom:
                          idx === safePkg.itinerary.length - 1
                            ? "none"
                            : "1px solid rgba(30,86,49,0.1)",
                      }}
                    >
                      <div style={{ flexShrink: 0, width: "100px" }}>
                        <div
                          style={{
                            background: "var(--color-primary)",
                            color: "#fff",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "14px",
                            textAlign: "center",
                          }}
                        >
                          {item.time || "--"}
                        </div>
                      </div>
                      <div>
                        <h3
                          style={{
                            margin: "0 0 8px",
                            fontSize: "20px",
                            color: "var(--color-primary)",
                            fontFamily: "var(--font-serif)",
                          }}
                        >
                          {item.activity || "Activity"}
                        </h3>
                        <p
                          style={{
                            color: "var(--muted)",
                            margin: 0,
                            lineHeight: 1.6,
                          }}
                        >
                          {item.description || ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    No itinerary has been published for this package yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "inclusions" && (
              <div className="tab-content">
                <h2
                  style={{
                    fontSize: "28px",
                    margin: "0 0 32px",
                    color: "var(--color-secondary)",
                  }}
                >
                  What's Included
                </h2>
                {safePkg.inclusions.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "16px",
                    }}
                  >
                    {safePkg.inclusions.map((item, idx) => (
                      <div
                        key={`${idx}-${item}`}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                          padding: "20px",
                          background: "#fff",
                          borderRadius: "12px",
                          borderLeft: "4px solid var(--color-primary)",
                        }}
                      >
                        <i
                          className="fas fa-check"
                          style={{
                            color: "var(--color-primary)",
                            fontSize: "20px",
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <h4
                            style={{
                              margin: 0,
                              color: "var(--color-primary)",
                              fontWeight: 700,
                            }}
                          >
                            {item}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    No inclusions have been published for this package yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "exclusions" && (
              <div className="tab-content">
                <h2
                  style={{
                    fontSize: "28px",
                    margin: "0 0 32px",
                    color: "var(--color-secondary)",
                  }}
                >
                  What's Not Included
                </h2>
                {safePkg.exclusions.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "16px",
                    }}
                  >
                    {safePkg.exclusions.map((item, idx) => (
                      <div
                        key={`${idx}-${item}`}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                          padding: "20px",
                          background: "#fff",
                          borderRadius: "12px",
                          borderLeft: "4px solid #d32f2f",
                        }}
                      >
                        <i
                          className="fas fa-times"
                          style={{
                            color: "#d32f2f",
                            fontSize: "20px",
                            marginTop: "2px",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <h4
                            style={{
                              margin: 0,
                              color: "#d32f2f",
                              fontWeight: 700,
                            }}
                          >
                            {item}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    No exclusions have been published for this package yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div className="tab-content">
                <h2
                  style={{
                    fontSize: "28px",
                    margin: "0 0 32px",
                    color: "var(--color-secondary)",
                  }}
                >
                  Essential Information
                </h2>
                {safePkg.info.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "20px",
                    }}
                  >
                    {safePkg.info.map((item, idx) => (
                      <div key={`${idx}-${item}`}>
                        <h4
                          style={{
                            margin: "0 0 12px",
                            color: "var(--color-primary)",
                            fontWeight: 700,
                            fontSize: "16px",
                          }}
                        >
                          <i
                            className="fas fa-info-circle"
                            style={{ marginRight: "8px" }}
                          />
                          Info
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            color: "var(--muted)",
                            lineHeight: 1.7,
                          }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    No additional info has been published for this package yet.
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                background: "#fff",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(30,86,49,0.12)",
                border: "1px solid rgba(30,86,49,0.1)",
                marginBottom: "24px",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "14px",
                    margin: "0 0 8px",
                    fontWeight: 600,
                  }}
                >
                  Price Per Person
                </p>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    margin: 0,
                  }}
                >
                  ${safePkg.price.toFixed(0)}
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    margin: "8px 0 0",
                    fontWeight: 500,
                  }}
                >
                  Based on minimum 2 people
                </p>
              </div>

              <div
                style={{
                  height: "1px",
                  background: "rgba(30,86,49,0.1)",
                  marginBottom: "24px",
                }}
              />

              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Rambo"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid rgba(30,86,49,0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid rgba(30,86,49,0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Contact Number
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-end",
                    }}
                  >
                    <div className="contact-phone">
                      <PhoneInput
                        defaultCountry="rw"
                        value={phone}
                        onChange={setPhone}
                        inputProps={{
                          name: "phone",
                          placeholder: "7XX XXX XXX",
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={20}
                    defaultValue={2}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid rgba(30,86,49,0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid rgba(30,86,49,0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div
                  style={{
                    background: "rgba(30,86,49,0.05)",
                    padding: "14px",
                    borderRadius: "8px",
                    borderLeft: "3px solid var(--color-primary)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--color-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    Total:{" "}
                    <span style={{ color: "var(--color-primary)" }}>
                      ${safePkg.price.toFixed(0)}
                    </span>
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "var(--muted)",
                    }}
                  >
                    Includes all services & lunch
                  </p>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i
                    className="fas fa-calendar-check"
                    style={{ marginRight: "8px" }}
                  />
                  Book Now
                </button>

                <a
                  href="https://wa.me/+250786140897"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "14px",
                    background: "rgba(30,86,49,0.1)",
                    color: "var(--color-primary)",
                    border: "2px solid var(--color-primary)",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="fab fa-whatsapp"
                    style={{ marginRight: "8px" }}
                  />
                  Chat on WhatsApp
                </a>
              </form>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,86,49,0.08), rgba(30,86,49,0.02))",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid rgba(30,86,49,0.1)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                Have Questions?
              </h4>
              <a
                href="tel:+250786140897"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "12px",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-phone" style={{ fontSize: "16px" }} />
                (+250) 786 140 897
              </a>
              <a
                href="mailto:administration@ebenconnections.com"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  color: "var(--color-primary)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fas fa-envelope" style={{ fontSize: "16px" }} />
                administration@ebenconnections.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
