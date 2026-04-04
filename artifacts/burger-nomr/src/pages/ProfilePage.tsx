import { useAuth } from "@/lib/auth";
import { useGetUser, useGetUserNoms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Settings } from "lucide-react";
import { NomBadge } from "@/components/NomScore";

function EmptyNoms() {
  return (
    <div style={{ textAlign: "center", padding: "40px 24px", background: "#FFF9F2", borderRadius: 14, border: "1px solid #E8DDD0" }}>
      <div
        style={{
          width: 64,
          height: 64,
          background: "#F0E8DC",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="12" width="20" height="10" rx="2.5" fill="#D4C8BC"/>
          <rect x="2" y="9" width="24" height="4" rx="2" fill="#C4B8AC"/>
          <ellipse cx="14" cy="9" rx="8" ry="5" fill="#D4C8BC"/>
        </svg>
      </div>
      <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.3rem", color: "#1A1208", marginBottom: 8 }}>
        NO NOMS YET
      </h3>
      <p style={{ color: "#7A6A58", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: 16 }}>
        You haven't nommed any burger spots yet. Get out there!
      </p>
      <Link href="/explore">
        <button style={{ background: "#E8420A", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "var(--app-font-display)", fontSize: "0.95rem", cursor: "pointer" }}>
          FIND A SPOT
        </button>
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: profile } = useGetUser(user?.id ?? "", {
    query: { enabled: !!user?.id, queryKey: ["getUser", user?.id] },
  });
  const { data: noms } = useGetUserNoms(user?.id ?? "", {
    query: { enabled: !!user?.id, queryKey: ["getUserNoms", user?.id] },
  });

  if (!user) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#FDF6EE" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#1A1208", marginBottom: 12 }}>
          SIGN IN TO SEE YOUR PROFILE
        </h2>
        <Link href="/">
          <button style={{ background: "#E8420A", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: "var(--app-font-display)", fontSize: "1rem", cursor: "pointer" }}>
            SIGN IN
          </button>
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Nomr";
  const initials = displayName.slice(0, 2).toUpperCase();
  const totalNoms = noms?.length ?? 0;
  const avgScore = noms && noms.length > 0
    ? noms.reduce((sum, n) => sum + n.score, 0) / noms.length
    : null;

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          padding: "52px 20px 28px",
          background: "linear-gradient(180deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "#E8420A",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--app-font-display)",
                fontSize: "1.8rem",
                color: "white",
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--app-font-display)",
                  fontSize: "1.8rem",
                  color: "white",
                  margin: 0,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {displayName}
              </h1>
              <p style={{ color: "#7A6A58", fontSize: "0.8rem", margin: "4px 0 0" }}>
                {user.email}
              </p>
            </div>
          </div>
          <Link href="/settings">
            <button
              style={{
                background: "rgba(122,106,88,0.2)",
                border: "none",
                borderRadius: 10,
                padding: "8px",
                cursor: "pointer",
                color: "#7A6A58",
              }}
            >
              <Settings size={18} />
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "white", letterSpacing: "0.04em" }}>
              {totalNoms}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#7A6A58", fontWeight: 500 }}>NOMS</div>
          </div>
          {avgScore != null && (
            <div>
              <div style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#E8420A", letterSpacing: "0.04em" }}>
                {avgScore.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#7A6A58", fontWeight: 500 }}>AVG SCORE</div>
            </div>
          )}
          {profile?.total_noms != null && (
            <div>
              <div style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "white", letterSpacing: "0.04em" }}>
                {profile.total_noms}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#7A6A58", fontWeight: 500 }}>TOTAL</div>
            </div>
          )}
        </div>
      </div>

      {/* Noms list */}
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", margin: "0 0 14px", letterSpacing: "0.04em" }}>
          MY NOMS
        </h2>

        {totalNoms === 0 ? (
          <EmptyNoms />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {noms?.map((nom) => (
              <Link key={nom.id} href={`/restaurant/${nom.restaurant_id}`}>
                <div
                  style={{
                    background: "#FFF9F2",
                    border: "1px solid #E8DDD0",
                    borderRadius: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: "0.75rem", color: "#7A6A58" }}>
                      {new Date(nom.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                    <NomBadge score={nom.score} size="sm" />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--app-font-display)",
                      fontSize: "2rem",
                      color: "#E8420A",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {nom.score.toFixed(1)}
                    <span style={{ fontSize: "0.9rem", color: "#7A6A58" }}>/10</span>
                  </div>
                  {nom.comment && (
                    <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "#7A6A58", fontStyle: "italic", lineHeight: 1.4 }}>
                      "{nom.comment.length > 80 ? nom.comment.slice(0, 80) + "..." : nom.comment}"
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
