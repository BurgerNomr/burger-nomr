import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, PenSquare } from "lucide-react";
import { NomScore, NomBadge } from "@/components/NomScore";
import { useAuth } from "@/lib/auth";

const HALAAL_CERT_STYLE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", background: "#7A4800", color: "#FFD166",
  fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.06em",
};

const MUSLIM_OWNED_STYLE: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", background: "#2C1E0C", color: "#D4C8BC",
  fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.06em",
};

function CertChip({ cert }: { cert: string }) {
  return <span style={cert === "Muslim-Owned" ? MUSLIM_OWNED_STYLE : HALAAL_CERT_STYLE}>{cert}</span>;
}

function NomItem({ nom }: { nom: any }) {
  const date = new Date(nom.created_at).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
  return (
    <div style={{ background: "#FFF9F2", borderRadius: 14, border: "1px solid #E8DDD0", padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1208" }}>{nom.profiles?.username ?? "Nomr"}</div>
          {nom.burger_name && <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 1, fontStyle: "italic" }}>{nom.burger_name}</div>}
          <div style={{ fontSize: "0.72rem", color: "#D4C8BC", marginTop: 1 }}>{date}</div>
        </div>
        <NomBadge score={nom.score} size="sm" />
      </div>
      {nom.comment && <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.88rem", color: "#1A1208", lineHeight: 1.5, fontStyle: "italic" }}>"{nom.comment}"</p>}
    </div>
  );
}

export default function RestaurantDetailPage() {
  const [, params] = useRoute("/restaurant/:id");
  const id = params?.id ?? "";
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [noms, setNoms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setIsLoading(true);
      const { data: rest } = await supabase
        .from("restaurants")
        .select("*, areas(name), restaurant_certifications(certifications(name, short_name))")
        .eq("id", id)
        .single();
      setRestaurant(rest);

      const { data: ratings } = await supabase
        .from("ratings")
        .select("*, profiles(username)")
        .eq("restaurant_id", id)
        .order("created_at", { ascending: false });
      setNoms(ratings || []);
      setIsLoading(false);
    }
    load();
  }, [id]);

  const certifications = (restaurant?.restaurant_certifications || [])
    .map((rc: any) => rc.certifications?.short_name)
    .filter(Boolean);

  const areaName = (restaurant?.areas as any)?.name ?? "";

  const communityNoms = noms;
  const communityAvg = communityNoms.length > 0
    ? communityNoms.reduce((s: number, n: any) => s + n.score, 0) / communityNoms.length
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
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208" }}>SPOT NOT FOUND</h2>
        <Link href="/explore">
          <button style={{ marginTop: 16, background: "#E8420A", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}>Back to Explore</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 50, padding: "0 20px" }}>
        <button onClick={() => window.history.back()} style={{ background: "rgba(26,18,8,0.7)", backdropFilter: "blur(8px)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ height: 260, background: restaurant.image_url ? "none" : "linear-gradient(135deg, #1A1208 0%, #2C1E0C 100%)", position: "relative", overflow: "hidden" }}>
        {restaurant.image_url && <img src={restaurant.image_url} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, #FDF6EE)" }} />
      </div>

      <div style={{ padding: "0 20px" }}>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.4rem", margin: "-20px 0 4px", letterSpacing: "0.04em", lineHeight: 1, color: "#1A1208" }}>{restaurant.name}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7A6A58", fontSize: "0.85rem", marginBottom: 12 }}>
          <MapPin size={13} />
          <span>{areaName}</span>
          {restaurant.address && <><span style={{ opacity: 0.4 }}>•</span><span>{restaurant.address}</span></>}
        </div>

        {certifications.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {certifications.map((cert: string) => <CertChip key={cert} cert={cert} />)}
            {restaurant.is_muslim_owned && <CertChip cert="Muslim-Owned" />}
          </div>
        )}

        {restaurant.price_range && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", background: "#1A1208", color: "white", fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>{restaurant.price_range}</span>
          </div>
        )}

        {restaurant.kashif_score && (
          <div style={{ background: "#1A1208", borderRadius: 18, padding: "18px 20px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, background: "radial-gradient(circle, rgba(232,66,10,0.3) 0%, transparent 70%)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "#E8420A", marginBottom: 4 }}>KASHIF'S TAKE</div>
                {restaurant.entry_burger && <div style={{ fontSize: "0.78rem", color: "#7A6A58", marginBottom: 10 }}>Ordered: <span style={{ color: "#D4C8BC" }}>{restaurant.entry_burger}</span></div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "3.5rem", color: "#E8420A", letterSpacing: "0.02em", lineHeight: 1 }}>{Number(restaurant.kashif_score).toFixed(1)}</div>
                <div style={{ fontSize: "0.7rem", color: "#7A6A58", letterSpacing: "0.06em" }}>/10</div>
              </div>
            </div>
            {restaurant.kashif_verdict && <p style={{ margin: "8px 0 0", fontSize: "0.88rem", color: "#D4C8BC", lineHeight: 1.5, fontStyle: "italic" }}>"{restaurant.kashif_verdict}"</p>}
          </div>
        )}

        <div style={{ background: "#FFF9F2", border: "1px solid #E8DDD0", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", margin: 0, letterSpacing: "0.04em", color: "#1A1208" }}>COMMUNITY SCORE</h3>
              <div style={{ fontSize: "0.72rem", color: "#7A6A58", marginTop: 2 }}>{communityNoms.length} community nom{communityNoms.length !== 1 ? "s" : ""}</div>
            </div>
            <NomBadge score={communityAvg} size="md" />
          </div>
          <NomScore score={communityAvg} size="sm" />
        </div>

        {user ? (
          <Link href={`/rate/${restaurant.id}`}>
            <button style={{ width: "100%", padding: "14px", background: "#E8420A", color: "white", border: "none", borderRadius: 12, fontFamily: "var(--app-font-display)", fontSize: "1.2rem", letterSpacing: "0.06em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <PenSquare size={18} /> DROP YOUR NOM
            </button>
          </Link>
        ) : (
          <Link href={`/auth?return=/rate/${restaurant.id}`}>
            <button style={{ width: "100%", padding: "14px", background: "#E8420A", color: "white", border: "none", borderRadius: 12, fontFamily: "var(--app-font-display)", fontSize: "1.2rem", letterSpacing: "0.06em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              <PenSquare size={18} /> SIGN IN TO NOM
            </button>
          </Link>
        )}

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.3rem", margin: "0 0 14px", letterSpacing: "0.04em" }}>ALL NOMS ({noms.length})</h2>
          {noms.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 24px", background: "#FFF9F2", borderRadius: 14, border: "1px solid #E8DDD0" }}>
              <p style={{ color: "#7A6A58", fontSize: "0.9rem", margin: 0 }}>No noms yet — be the first Nomr!</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {noms.map((nom) => <NomItem key={nom.id} nom={nom} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
