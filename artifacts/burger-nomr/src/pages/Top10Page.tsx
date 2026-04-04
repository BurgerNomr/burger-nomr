import { useGetTopRestaurants } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Trophy, Star, MapPin } from "lucide-react";

const RANK_STYLES: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "#E8420A", text: "white", border: "#C73508" },
  2: { bg: "#7A6A58", text: "white", border: "#6A5A48" },
  3: { bg: "#D4C8BC", text: "#1A1208", border: "#C4B8AC" },
};

export default function Top10Page() {
  const { data: restaurants, isLoading } = useGetTopRestaurants();

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          padding: "52px 20px 28px",
          background: "linear-gradient(180deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(232,66,10,0.25) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <Trophy size={28} color="#E8420A" />
          <h1
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "2.5rem",
              color: "white",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            TOP 10 NOMRS
          </h1>
        </div>
        <p style={{ color: "#7A6A58", fontSize: "0.85rem", margin: "8px 0 0" }}>
          Cape Town's highest-rated halaal burger spots
        </p>
      </div>

      <div style={{ padding: "20px" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: 90, background: "#F0E8DC", borderRadius: 14 }} />
            ))}
          </div>
        )}

        {!isLoading && restaurants && restaurants.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Trophy size={48} color="#D4C8BC" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208", marginBottom: 8 }}>
              NO RANKINGS YET
            </h3>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem" }}>
              Once restaurants get reviews, the top 10 will appear here.
            </p>
          </div>
        )}

        {!isLoading && restaurants && restaurants.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {restaurants.map((r) => {
              const rank = r.rank;
              const rankStyle = RANK_STYLES[rank] ?? { bg: "#F0E8DC", text: "#1A1208", border: "#E8DDD0" };

              return (
                <Link key={r.id} href={`/restaurant/${r.id}`}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: rank <= 3 ? "#FFF9F2" : "#FFF9F2",
                      border: rank <= 3 ? `2px solid ${rankStyle.border}` : "1px solid #E8DDD0",
                      borderRadius: 16,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
                    }}
                  >
                    {/* Rank Badge */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: rankStyle.bg,
                        color: rankStyle.text,
                        fontFamily: "var(--app-font-display)",
                        fontSize: rank <= 9 ? "1.6rem" : "1.3rem",
                        letterSpacing: "0.03em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {rank <= 3 ? <Trophy size={20} /> : rank}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--app-font-display)",
                          fontSize: "1.25rem",
                          letterSpacing: "0.04em",
                          color: "#1A1208",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: "#7A6A58",
                          fontSize: "0.78rem",
                          marginTop: 2,
                        }}
                      >
                        <MapPin size={10} />
                        <span>{r.area}</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span>{r.total_reviews} review{r.total_reviews !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {r.avg_rating != null ? (
                        <>
                          <div
                            style={{
                              fontFamily: "var(--app-font-display)",
                              fontSize: "1.8rem",
                              color: "#E8420A",
                              letterSpacing: "0.04em",
                              lineHeight: 1,
                            }}
                          >
                            {(r.avg_rating as number).toFixed(1)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.6rem",
                              color: "#7A6A58",
                              fontWeight: 600,
                              letterSpacing: "0.08em",
                            }}
                          >
                            NOM+
                          </div>
                        </>
                      ) : (
                        <div style={{ color: "#D4C8BC", fontSize: "0.8rem" }}>No rating</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
