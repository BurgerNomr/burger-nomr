import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetRecentRestaurants, useGetKashifFeatured } from "@workspace/api-client-react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { PlusCircle, ChevronRight } from "lucide-react";

const AREAS = [
  "All",
  "City Bowl",
  "Atlantic Seaboard",
  "Southern Suburbs",
  "Northern Suburbs",
  "V&A Waterfront",
  "Observatory",
];

function scoreColor(score: number): string {
  if (score >= 8.5) return "#E8420A";
  if (score >= 7) return "#F07040";
  return "#7A6A58";
}

function KashifHero() {
  const [, navigate] = useLocation();
  const { data: featured, isLoading } = useGetKashifFeatured({ query: { queryKey: ["kashifFeatured"] } });

  if (isLoading) {
    return (
      <div style={{ margin: "0 0 0", height: 220, background: "#1A1208", borderRadius: 0 }} />
    );
  }

  if (!featured) return null;

  const { nom, restaurant } = featured;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#1A1208",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      {/* Background image */}
      {restaurant.image_url && (
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(26,18,8,0.95) 40%, rgba(232,66,10,0.2) 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "52px 20px 28px" }}>
        {/* Label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#E8420A",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            padding: "4px 10px",
            borderRadius: 99,
            marginBottom: 16,
          }}
        >
          KASHIF'S TOP PICK
        </div>

        {/* Score + name row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--app-font-display)",
                fontSize: "2.2rem",
                color: "white",
                margin: "0 0 4px",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
              }}
            >
              {restaurant.name}
            </h1>
            <p style={{ color: "#7A6A58", fontSize: "0.82rem", margin: "0 0 10px" }}>
              {restaurant.area}
            </p>
            {nom.burger_ordered && (
              <p style={{ color: "#D4C8BC", fontSize: "0.8rem", margin: "0 0 12px", fontStyle: "italic" }}>
                Kashif ordered: <span style={{ color: "white", fontStyle: "normal" }}>{nom.burger_ordered}</span>
              </p>
            )}
            {nom.comment && (
              <p
                style={{
                  color: "#D4C8BC",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  margin: 0,
                  fontStyle: "italic",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                "{nom.comment}"
              </p>
            )}
          </div>

          {/* Score bubble */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--app-font-display)",
                fontSize: "4rem",
                color: scoreColor(nom.score),
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              {nom.score.toFixed(1)}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#7A6A58", fontWeight: 600, letterSpacing: "0.08em" }}>
              /10
            </div>
          </div>
        </div>

        {/* See restaurant link */}
        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "#E8420A",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          See restaurant <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState("All");

  const { data: recent, isLoading } = useGetRecentRestaurants({
    limit: 20,
    area: selectedArea !== "All" ? selectedArea : undefined,
  });

  return (
    <div className="page-content">
      {/* Kashif Hero */}
      <KashifHero />

      {/* Area Filter Tabs */}
      <div
        style={{
          overflowX: "auto",
          padding: "16px 20px 12px",
          background: "#FDF6EE",
          borderBottom: "1px solid #F0E8DC",
        }}
      >
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                border: "1.5px solid",
                borderColor: selectedArea === area ? "#E8420A" : "#E8DDD0",
                background: selectedArea === area ? "#E8420A" : "transparent",
                color: selectedArea === area ? "white" : "#7A6A58",
                fontFamily: "var(--app-font-sans)",
                fontSize: "0.82rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", margin: 0, letterSpacing: "0.04em" }}>
            {selectedArea === "All" ? "RECENTLY ADDED" : selectedArea.toUpperCase()}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/submit">
              <button
                style={{
                  background: "none",
                  border: "1.5px solid #E8DDD0",
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#7A6A58",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                <PlusCircle size={14} color="#E8420A" />
                Add spot
              </button>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 220, background: "#F0E8DC", borderRadius: 16 }} />
            ))}
          </div>
        )}

        {!isLoading && (!recent || recent.length === 0) && (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", color: "#1A1208", marginBottom: 8 }}>
              NO SPOTS HERE YET
            </h3>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: 20 }}>
              {selectedArea !== "All"
                ? `No halaal burger spots in ${selectedArea} yet.`
                : "Be the first to add a halaal burger spot."}
            </p>
            <Link href="/submit">
              <button
                style={{
                  background: "#E8420A",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontFamily: "var(--app-font-display)",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                }}
              >
                ADD A SPOT
              </button>
            </Link>
          </div>
        )}

        {!isLoading && recent && recent.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recent.map((r) => (
              <RestaurantCard
                key={r.id}
                id={r.id}
                name={r.name}
                area={r.area}
                image_url={r.image_url}
                avg_score={r.avg_score}
                total_noms={r.total_noms}
                tags={r.tags}
                price_range={r.price_range}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
