interface ScoreBarProps {
  score: number;
  size?: "sm" | "lg";
}

function ScoreBar({ score, size = "sm" }: ScoreBarProps) {
  const pct = (score / 10) * 100;
  const color = pct >= 80 ? "#E8420A" : pct >= 60 ? "#F07040" : "#D4C8BC";
  return (
    <div
      style={{
        height: size === "lg" ? 10 : 7,
        background: "#F0E8DC",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: 99,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

export function NomScore({ score, size = "sm" }: { score?: number | null; size?: "sm" | "lg" }) {
  if (score == null) {
    return (
      <p style={{ color: "#7A6A58", fontSize: "0.85rem", margin: "8px 0" }}>
        No noms yet — be the first!
      </p>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size === "lg" ? 8 : 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: size === "lg" ? "0.85rem" : "0.78rem", color: "#7A6A58", fontWeight: 500 }}>
          Avg Nom Score
        </span>
        <span
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: size === "lg" ? "1.6rem" : "1.1rem",
            color: "#E8420A",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          {score.toFixed(1)}<span style={{ fontSize: "0.6em", color: "#7A6A58" }}>/10</span>
        </span>
      </div>
      <ScoreBar score={score} size={size} />
    </div>
  );
}

export function NomBadge({ score, size = "md" }: { score?: number | null; size?: "sm" | "md" | "lg" }) {
  if (score == null) return null;
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
      {score.toFixed(1)}
    </span>
  );
}
