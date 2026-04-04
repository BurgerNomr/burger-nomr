interface NomScoreProps {
  overall_rating?: number | null;
  patty_rating?: number | null;
  bun_rating?: number | null;
  sauce_rating?: number | null;
  value_rating?: number | null;
  size?: "sm" | "lg";
}

function RatingBar({ label, value, size = "sm" }: { label: string; value?: number | null; size?: "sm" | "lg" }) {
  const pct = value ? (value / 5) * 100 : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: size === "lg" ? "0.85rem" : "0.78rem", color: "#7A6A58", fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: size === "lg" ? "1rem" : "0.9rem",
            color: "#1A1208",
            letterSpacing: "0.04em",
          }}
        >
          {value != null ? value.toFixed(1) : "—"}
        </span>
      </div>
      <div
        style={{
          height: size === "lg" ? 8 : 6,
          background: "#F0E8DC",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: pct >= 80 ? "#E8420A" : pct >= 60 ? "#F07040" : "#D4C8BC",
            borderRadius: 99,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

export function NomScore({ overall_rating, patty_rating, bun_rating, sauce_rating, value_rating, size = "sm" }: NomScoreProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size === "lg" ? 10 : 8 }}>
      <RatingBar label="Patty" value={patty_rating} size={size} />
      <RatingBar label="Bun" value={bun_rating} size={size} />
      <RatingBar label="Sauce" value={sauce_rating} size={size} />
      <RatingBar label="Value" value={value_rating} size={size} />
    </div>
  );
}

export function NomBadge({ rating, size = "md" }: { rating?: number | null; size?: "sm" | "md" | "lg" }) {
  if (rating == null) return null;
  const fontSize = size === "lg" ? "1.5rem" : size === "md" ? "1.1rem" : "0.85rem";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#E8420A",
        color: "white",
        fontFamily: "var(--app-font-display)",
        letterSpacing: "0.05em",
        padding: size === "lg" ? "4px 14px" : "2px 10px",
        borderRadius: 99,
        fontSize,
      }}
    >
      {rating.toFixed(1)} NOM+
    </span>
  );
}
