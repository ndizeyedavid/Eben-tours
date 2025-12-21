"use client";

type CountryKey = "all" | "rwanda" | "kenya" | "tanzania" | "uganda";

export default function Filter({
  value,
  onChange,
}: {
  value: CountryKey;
  onChange: (v: CountryKey) => void;
}) {
  const isActive = (k: CountryKey) => value === k;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "50px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className={`filter-btn${isActive("all") ? " active" : ""}`}
          onClick={() => onChange("all")}
          style={{
            padding: "12px 28px",
            border: "2px solid var(--color-primary)",
            background: isActive("all") ? "var(--color-primary)" : "#fff",
            color: isActive("all") ? "#fff" : "var(--color-primary)",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <i className="fas fa-earth-africa" style={{ marginRight: "8px" }}></i>
          All Destinations
        </button>
        <button
          type="button"
          className={`filter-btn${isActive("rwanda") ? " active" : ""}`}
          onClick={() => onChange("rwanda")}
          style={{
            padding: "12px 28px",
            border: "2px solid var(--color-primary)",
            background: isActive("rwanda") ? "var(--color-primary)" : "#fff",
            color: isActive("rwanda") ? "#fff" : "var(--color-primary)",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <i className="fas fa-flag" style={{ marginRight: "8px" }}></i>Rwanda
        </button>
        <button
          type="button"
          className={`filter-btn${isActive("kenya") ? " active" : ""}`}
          onClick={() => onChange("kenya")}
          style={{
            padding: "12px 28px",
            border: "2px solid var(--color-primary)",
            background: isActive("kenya") ? "var(--color-primary)" : "#fff",
            color: isActive("kenya") ? "#fff" : "var(--color-primary)",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <i className="fas fa-flag" style={{ marginRight: "8px" }}></i>Kenya
        </button>
        <button
          type="button"
          className={`filter-btn${isActive("tanzania") ? " active" : ""}`}
          onClick={() => onChange("tanzania")}
          style={{
            padding: "12px 28px",
            border: "2px solid var(--color-primary)",
            background: isActive("tanzania") ? "var(--color-primary)" : "#fff",
            color: isActive("tanzania") ? "#fff" : "var(--color-primary)",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <i className="fas fa-flag" style={{ marginRight: "8px" }}></i>
          Tanzania
        </button>
        <button
          type="button"
          className={`filter-btn${isActive("uganda") ? " active" : ""}`}
          onClick={() => onChange("uganda")}
          style={{
            padding: "12px 28px",
            border: "2px solid var(--color-primary)",
            background: isActive("uganda") ? "var(--color-primary)" : "#fff",
            color: isActive("uganda") ? "#fff" : "var(--color-primary)",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          <i className="fas fa-flag" style={{ marginRight: "8px" }}></i>Uganda
        </button>
      </div>
    </div>
  );
}
