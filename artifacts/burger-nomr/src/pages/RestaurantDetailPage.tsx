import { useRoute, Link } from "wouter";
import { useGetRestaurant, useGetRestaurantNoms } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, PenSquare } from "lucide-react";
import { NomScore, NomBadge } from "@/components/NomScore";
import { useAuth } from "@/lib/auth";

interface Nom {
  id: string;
  user_name: string;
  score: number;
  comment?: string | null;
  created_at: string;
}

function NomItem({ nom }: { nom: Nom }) {
  const date = new Date(nom.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        background: "#FFF9F2",
        borderRadius: 14,
        border: "1px solid #E8DDD0",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1208" }}>{nom.user_name}</div>
          <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 2 }}>{date}</div>
        </div>
        <NomBadge score={nom.score} size="sm" />
      </div>
      {nom.comment && (
        <p
          style={{
            marginTop: 0,
            marginBottom: 0,
            fontSize: "0.88rem",
            color: "#1A1208",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          "{nom.comment}"
        </p>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  const [, params] = useRoute("/restaurant/:id");
  const id = params?.id ?? "";
  const { user } = useAuth();

  const { data: restaurant, isLoading } = useGetRestaurant(id, {
    query: { enabled: !!id, queryKey: ["getRestaurant", id] },
  });
  const { data: noms } = useGetRestaurantNoms(id, {
    query: { enabled: !!id, queryKey: ["getRestaurantNoms", id] },
  });

  const kashifNom = noms?.find((n) => n.user_name === "Kashif");

  if (isLoading) {
    return (
      <div style={{ padding: "52px 20px" }}>
        <div style={{ height: 240, background: "#F0E8DC", borderRadius: 16, marginBottom: 16 }} />
        <div style={{ height: 32, background: "#F0E8DC", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 20, background: "#F0E8DC", borderRadius: 8, width: "60%" }} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ padding: "52px 20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208" }}>
          SPOT NOT FOUND
        </h2>
        <Link href="/explore">
          <button style={{ marginTop: 16, background: "#E8420A", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}>
            Back to Explore
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back button */}
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 50, padding: "0 20px" }}>
        <Link href="/explore">
          <button
            style={{
              background: "rgba(26,18,8,0.7)",
              backdropFilter: "blur(8px)",
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </Link>
      </div>

      {/* Hero Image */}
      <div
        style={{
          height: 260,
          background: restaurant.image_url
            ? "none"
            : "linear-gradient(135deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="12" y="36" width="56" height="28" rx="6" fill="rgba(232,66,10,0.2)"/>
              <rect x="8" y="28" width="64" height="10" rx="5" fill="rgba(232,66,10,0.3)"/>
              <ellipse cx="40" cy="28" rx="24" ry="12" fill="rgba(232,66,10,0.2)"/>
              <rect x="24" y="60" width="32" height="6" rx="3" fill="rgba(232,66,10,0.2)"/>
            </svg>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: "linear-gradient(transparent, #FDF6EE)",
          }}
        />
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Name & Area */}
        <h1
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "2.5rem",
            margin: "-20px 0 4px",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#1A1208",
          }}
        >
          {restaurant.name}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#7A6A58",
            fontSize: "0.85rem",
            marginBottom: 12,
          }}
        >
          <MapPin size={13} />
          <span>{restaurant.area}</span>
          {restaurant.address && (
            <>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{restaurant.address}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {restaurant.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
            {restaurant.price_range && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#1A1208",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 99,
                }}
              >
                {restaurant.price_range}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <p style={{ fontSize: "0.9rem", color: "#1A1208", lineHeight: 1.6, marginBottom: 20 }}>
            {restaurant.description}
          </p>
        )}

        {/* Kashif's featured nom */}
        {kashifNom && (
          <div
            style={{
              background: "#1A1208",
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(232,66,10,0.35) 0%, transparent 70%)",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#E8420A",
                    marginBottom: 4,
                  }}
                >
                  KASHIF'S TAKE
                </div>
                <div
                  style={{
                    fontFamily: "var(--app-font-display)",
                    fontSize: "1rem",
                    color: "white",
                    letterSpacing: "0.04em",
                  }}
                >
                  Kashif
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--app-font-display)",
                  fontSize: "3rem",
                  color: "#E8420A",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {kashifNom.score.toFixed(1)}
                <span style={{ fontSize: "1rem", color: "#7A6A58" }}>/10</span>
              </div>
            </div>
            {kashifNom.comment && (
              <p
                style={{
                  margin: 0,
                  fontSize: "0.88rem",
                  color: "#D4C8BC",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                "{kashifNom.comment}"
              </p>
            )}
          </div>
        )}

        {/* Overall Nom Score */}
        <div
          style={{
            background: "#FFF9F2",
            border: "1px solid #E8DDD0",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.2rem", margin: 0, letterSpacing: "0.04em" }}>
                NOM SCORE
              </h3>
              <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 2 }}>
                Based on {restaurant.total_noms} nom{restaurant.total_noms !== 1 ? "s" : ""}
              </div>
            </div>
            <NomBadge score={restaurant.avg_score} size="lg" />
          </div>
          <NomScore score={restaurant.avg_score} size="lg" />
        </div>

        {/* CTA */}
        {user ? (
          <Link href={`/rate/${restaurant.id}`}>
            <button
              style={{
                width: "100%",
                padding: "14px",
                background: "#E8420A",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--app-font-display)",
                fontSize: "1.2rem",
                letterSpacing: "0.06em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <PenSquare size={18} />
              DROP YOUR NOM
            </button>
          </Link>
        ) : (
          <div
            style={{
              background: "#F0E8DC",
              borderRadius: 12,
              padding: "14px",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <p style={{ margin: "0 0 10px", color: "#7A6A58", fontSize: "0.85rem" }}>
              Sign in to drop a nom
            </p>
            <Link href="/">
              <button
                style={{
                  background: "#E8420A",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontFamily: "var(--app-font-display)",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                SIGN IN
              </button>
            </Link>
          </div>
        )}

        {/* Noms list */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "1.4rem",
              margin: "0 0 14px",
              letterSpacing: "0.04em",
            }}
          >
            NOMS ({noms?.length ?? 0})
          </h2>
          {noms && noms.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#FFF9F2",
                borderRadius: 14,
                border: "1px solid #E8DDD0",
              }}
            >
              <p style={{ color: "#7A6A58", fontSize: "0.9rem", margin: 0 }}>
                No noms yet. Be the first Nomr!
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {noms?.map((nom) => (
              <NomItem key={nom.id} nom={nom} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
