import { useGetTopRestaurants } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Flame, MapPin } from "lucide-react";

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
          <Flame size={28} color="#E8420A" />
          <h1
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "2.5rem",
              color: "white",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            TOP 10
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
              <div key={i} style={{ height: 80, background: "#F0E8DC", borderRadius: 14 }} />
            ))}
          </div>
        )}

        {!isLoading && restaurants && restaurants.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Flame size={48} color="#D4C8BC" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208", marginBottom: 8 }}>
              NO RANKINGS YET
            </h3>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem" }}>
              Once restaurants get noms, the top 10 will appear here.
            </p>
          </div>
        )}

        {!isLoading && restaurants && restaurants.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {restaurants.map((r) => {
              const rank = r.rank;
              return (
                <Link key={r.id} href={`/restaurant/${r.id}`}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: "#FFF9F2",
                      border: "1px solid #E8DDD0",
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
                    {/* Rank number */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "#F0E8DC",
                        color: "#1A1208",
                        fontFamily: "var(--app-font-display)",
                        fontSize: rank <= 9 ? "1.5rem" : "1.2rem",
                        letterSpacing: "0.03em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {rank}
                    </div>

                    {/* Image thumbnail */}
                    {r.image_url && (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={r.image_url}
                          alt={r.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--app-font-display)",
                          fontSize: "1.2rem",
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
                        <span>{r.total_noms} nom{r.total_noms !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {r.avg_score != null ? (
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
                            {(r.avg_score as number).toFixed(1)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.6rem",
                              color: "#7A6A58",
                              fontWeight: 600,
                              letterSpacing: "0.08em",
                            }}
                          >
                            /10
                          </div>
                        </>
                      ) : (
                        <div style={{ color: "#D4C8BC", fontSize: "0.8rem" }}>No noms</div>
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
