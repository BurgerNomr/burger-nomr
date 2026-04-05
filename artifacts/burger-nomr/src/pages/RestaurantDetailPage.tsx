import { useRoute, Link, useLocation } from "wouter";
import { useGetRestaurant, useGetRestaurantNoms } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, PenSquare } from "lucide-react";
import { NomScore, NomBadge } from "@/components/NomScore";
import { useAuth } from "@/lib/auth";

const HALAAL_CERT_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#7A4800",
  color: "#FFD166",
  fontSize: "0.7rem",
  fontWeight: 700,
  padding: "3px 10px",
  borderRadius: 99,
  letterSpacing: "0.06em",
};

const MUSLIM_OWNED_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#2C1E0C",
  color: "#D4C8BC",
  fontSize: "0.7rem",
  fontWeight: 700,
  padding: "3px 10px",
  borderRadius: 99,
  letterSpacing: "0.06em",
};

interface Nom {
  id: string;
  user_name: string;
  score: number;
  burger_ordered?: string | null;
  comment?: string | null;
  created_at: string;
}

function CertChip({ cert }: { cert: string }) {
  const style = cert === "Muslim-Owned" ? MUSLIM_OWNED_STYLE : HALAAL_CERT_STYLE;
  return <span style={style}>{cert}</span>;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1208" }}>{nom.user_name}</div>
          {nom.burger_ordered && (
            <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 1, fontStyle: "italic" }}>
              {nom.burger_ordered}
            </div>
          )}
          <div style={{ fontSize: "0.72rem", color: "#D4C8BC", marginTop: 1 }}>{date}</div>
        </div>
        <NomBadge score={nom.score} size="sm" />
      </div>
      {nom.comment && (
        <p
          style={{
            marginTop: 8,
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
  const [, navigate] = useLocation();
  const id = params?.id ?? "";
  const { user } = useAuth();

  const { data: restaurant, isLoading } = useGetRestaurant(id, {
    query: { enabled: !!id, queryKey: ["getRestaurant", id] },
  });
  const { data: noms } = useGetRestaurantNoms(id, {
    query: { enabled: !!id, queryKey: ["getRestaurantNoms", id] },
  });

  const kashifNom = noms?.find((n) => n.user_name === "Kashif");
  const communityNoms = noms?.filter((n) => n.user_name !== "Kashif") ?? [];
  const communityAvg = communityNoms.length > 0
    ? communityNoms.reduce((s, n) => s + n.score, 0) / communityNoms.length
    : null;

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

  const hasNomButton = user
    ? `/rate/${restaurant.id}`
    : `/auth?return=/rate/${restaurant.id}`;

  return (
    <div className="page-content">
      {/* Back button */}
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 50, padding: "0 20px" }}>
        <button
          onClick={() => window.history.back()}
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
      </div>

      {/* Hero */}
      <div
        style={{
          height: 260,
          background: restaurant.image_url ? "none" : "linear-gradient(135deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {restaurant.image_url && (
          <img src={restaurant.image_url} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, #FDF6EE)" }} />
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "2.4rem",
            margin: "-20px 0 4px",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#1A1208",
          }}
        >
          {restaurant.name}
        </h1>

        {/* Area */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7A6A58", fontSize: "0.85rem", marginBottom: 12 }}>
          <MapPin size={13} />
          <span>{restaurant.area}</span>
          {restaurant.address && (
            <>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{restaurant.address}</span>
            </>
          )}
        </div>

        {/* Certification chips */}
        {restaurant.certifications && restaurant.certifications.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {restaurant.certifications.map((cert) => (
              <CertChip key={cert} cert={cert} />
            ))}
          </div>
        )}

        {/* Tags + price */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {restaurant.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
            {restaurant.price_range && (
              <span style={{ display: "inline-flex", alignItems: "center", background: "#1A1208", color: "white", fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>
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

        {/* Kashif's featured card */}
        {kashifNom && (
          <div
            style={{
              background: "#1A1208",
              borderRadius: 18,
              padding: "18px 20px",
              marginBottom: 14,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 140,
                height: 140,
                background: "radial-gradient(circle, rgba(232,66,10,0.3) 0%, transparent 70%)",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "#E8420A", marginBottom: 4 }}>
                  KASHIF'S TAKE
                </div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.05rem", color: "white", letterSpacing: "0.04em", marginBottom: 2 }}>
                  Kashif
                </div>
                {kashifNom.burger_ordered && (
                  <div style={{ fontSize: "0.78rem", color: "#7A6A58", marginBottom: 10 }}>
                    Ordered: <span style={{ color: "#D4C8BC" }}>{kashifNom.burger_ordered}</span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "var(--app-font-display)",
                    fontSize: "3.5rem",
                    color: "#E8420A",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {kashifNom.score.toFixed(1)}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#7A6A58", letterSpacing: "0.06em" }}>/10</div>
              </div>
            </div>
            {kashifNom.comment && (
              <p style={{ margin: "8px 0 0", fontSize: "0.88rem", color: "#D4C8BC", lineHeight: 1.5, fontStyle: "italic" }}>
                "{kashifNom.comment}"
              </p>
            )}
          </div>
        )}

        {/* Community score */}
        <div
          style={{
            background: "#FFF9F2",
            border: "1px solid #E8DDD0",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", margin: 0, letterSpacing: "0.04em", color: "#1A1208" }}>
                COMMUNITY SCORE
              </h3>
              <div style={{ fontSize: "0.72rem", color: "#7A6A58", marginTop: 2 }}>
                {communityNoms.length} community nom{communityNoms.length !== 1 ? "s" : ""}
              </div>
            </div>
            <NomBadge score={communityAvg} size="md" />
          </div>
          <NomScore score={communityAvg} size="sm" />
        </div>

        {/* Nom CTA */}
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
          <Link href={`/auth?return=/rate/${restaurant.id}`}>
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
              SIGN IN TO NOM
            </button>
          </Link>
        )}

        {/* Noms list */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.3rem", margin: "0 0 14px", letterSpacing: "0.04em" }}>
            ALL NOMS ({noms?.length ?? 0})
          </h2>
          {noms && noms.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 24px", background: "#FFF9F2", borderRadius: 14, border: "1px solid #E8DDD0" }}>
              <p style={{ color: "#7A6A58", fontSize: "0.9rem", margin: 0 }}>
                No noms yet — be the first Nomr!
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {noms?.map((nom) => (
              <NomItem key={nom.id} nom={nom} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
