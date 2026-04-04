import { Link } from "wouter";
import { ChevronRight, Flame, PlusCircle } from "lucide-react";
import { useGetRecentRestaurants, useGetSummaryStats } from "@workspace/api-client-react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useAuth } from "@/lib/auth";

function EmptyHome() {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div
        style={{
          width: 80,
          height: 80,
          background: "#F0E8DC",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="18" width="28" height="14" rx="3" fill="#D4C8BC"/>
          <rect x="4" y="14" width="32" height="5" rx="2.5" fill="#C4B8AC"/>
          <ellipse cx="20" cy="14" rx="12" ry="6" fill="#D4C8BC"/>
          <rect x="12" y="30" width="16" height="3" rx="1.5" fill="#C4B8AC"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208", marginBottom: 8 }}>
        NO BURGERS YET
      </h3>
      <p style={{ color: "#7A6A58", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: 20 }}>
        Be the first to add a halaal burger spot to Cape Town's guide.
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
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { data: recent, isLoading } = useGetRecentRestaurants({ limit: 6 });
  const { data: stats } = useGetSummaryStats();

  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Nomr";

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          padding: "52px 20px 24px",
          background: "linear-gradient(180deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(232,66,10,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <p style={{ color: "#7A6A58", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
          Salaam, {displayName}
        </p>
        <h1
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "2.8rem",
            color: "white",
            margin: "4px 0 16px",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          WHAT'S YOUR NEXT<br />
          <span style={{ color: "#E8420A" }}>NOM?</span>
        </h1>

        {/* Stats Row */}
        {stats && (
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Spots", value: stats.total_restaurants },
              { label: "Reviews", value: stats.total_reviews },
              { label: "Top Area", value: stats.top_area ?? "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "white", letterSpacing: "0.04em" }}>
                  {value}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#7A6A58", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Quick Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 28 }}>
          <Link href="/top10" style={{ flex: 1 }}>
            <div
              style={{
                background: "#E8420A",
                color: "white",
                borderRadius: 14,
                padding: "16px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <Flame size={20} />
              <div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.1rem", letterSpacing: "0.04em" }}>TOP 10</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>Best rated spots</div>
              </div>
            </div>
          </Link>
          <Link href="/submit" style={{ flex: 1 }}>
            <div
              style={{
                background: "#F0E8DC",
                color: "#1A1208",
                borderRadius: 14,
                padding: "16px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <PlusCircle size={20} color="#E8420A" />
              <div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.1rem", letterSpacing: "0.04em" }}>ADD SPOT</div>
                <div style={{ fontSize: "0.72rem", color: "#7A6A58" }}>Know a place?</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Restaurants */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", margin: 0, letterSpacing: "0.04em" }}>
            RECENTLY ADDED
          </h2>
          <Link href="/explore">
            <button
              style={{
                background: "none",
                border: "none",
                color: "#E8420A",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              See all <ChevronRight size={14} />
            </button>
          </Link>
        </div>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 220,
                  background: "#F0E8DC",
                  borderRadius: 16,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {!isLoading && (!recent || recent.length === 0) && <EmptyHome />}

        {!isLoading && recent && recent.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recent.map((r) => (
              <RestaurantCard
                key={r.id}
                id={r.id}
                name={r.name}
                area={r.area}
                image_url={r.image_url}
                avg_rating={r.avg_rating}
                total_reviews={r.total_reviews}
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
