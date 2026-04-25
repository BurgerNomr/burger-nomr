import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";
import { Flame, MapPin } from "lucide-react";

type Mode = "community" | "kashif";

const AREAS = ["All Areas", "City Bowl", "Atlantic Seaboard", "Southern Suburbs", "Northern Suburbs", "V&A Waterfront", "Observatory", "Other Cape Town"];
const CERTS = ["MJC", "SANHA", "NIHT", "ICSA", "Shura", "Halaal Foundation", "Muslim-Owned"];

const CERT_STYLE = (active: boolean): React.CSSProperties => ({
  padding: "5px 12px", borderRadius: 99, border: "1.5px solid",
  borderColor: active ? "#FFD166" : "#E8DDD0",
  background: active ? "#7A4800" : "transparent",
  color: active ? "#FFD166" : "#7A6A58",
  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
  whiteSpace: "nowrap" as const, transition: "all 0.15s", letterSpacing: "0.04em",
});

export default function Top10Page() {
  const [mode, setMode] = useState<Mode>("community");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [rawRestaurants, setRawRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const scoreCol = mode === "kashif" ? "kashif_score" : "community_score";
      let query = supabase
        .from("restaurants")
        .select("*, areas(name), restaurant_certifications(certifications(short_name))")
        .eq("is_published", true)
        .not(scoreCol, "is", null)
        .order(scoreCol, { ascending: false })
        .limit(10);

      const { data } = await query;
      setRawRestaurants(data || []);
      setIsLoading(false);
    }
    load();
  }, [mode]);

  const restaurants = useMemo(() => {
    let filtered = rawRestaurants.map((r) => ({
      ...r,
      areaName: (r.areas as any)?.name ?? "",
      certifications: (r.restaurant_certifications || []).map((rc: any) => rc.certifications?.short_name).filter(Boolean),
    }));
    if (selectedArea !== "All Areas") {
      filtered = filtered.filter((r) => r.areaName === selectedArea);
    }
    if (selectedCerts.length > 0) {
      filtered = filtered.filter((r) => selectedCerts.every((c) => r.certifications.includes(c)));
    }
    return filtered.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rawRestaurants, selectedArea, selectedCerts]);

  const toggleCert = (cert: string) => {
    setSelectedCerts((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]);
  };

  const displayScore = (r: any) => mode === "kashif" ? r.kashif_score : r.community_score;

  return (
    <div className="page-content">
      <div style={{ padding: "52px 20px 20px", background: "linear-gradient(180deg, #1A1208 0%, #2C1E0C 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, left: -30, width: 200, height: 200, background: "radial-gradient(circle, rgba(232,66,10,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Flame size={26} color="#E8420A" />
          <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", color: "white", margin: 0, letterSpacing: "0.04em" }}>TOP 10</h1>
        </div>
        <p style={{ color: "#7A6A58", fontSize: "0.82rem", margin: "0 0 16px" }}>Cape Town's highest-rated halaal burger spots</p>
        <div style={{ display: "flex", background: "rgba(122,106,88,0.2)", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {(["community", "kashif"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: mode === m ? "#E8420A" : "transparent", color: mode === m ? "white" : "#7A6A58", fontFamily: "var(--app-font-display)", fontSize: "0.9rem", letterSpacing: "0.04em", cursor: "pointer", transition: "all 0.15s" }}>
              {m === "community" ? "COMMUNITY" : "KASHIF'S"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto", padding: "12px 20px 0", background: "#FDF6EE" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content", paddingBottom: 8 }}>
          {AREAS.map((area) => (
            <button key={area} onClick={() => setSelectedArea(area)} style={{ padding: "5px 14px", borderRadius: 99, border: "1.5px solid", borderColor: selectedArea === area ? "#E8420A" : "#E8DDD0", background: selectedArea === area ? "#E8420A" : "transparent", color: selectedArea === area ? "white" : "#7A6A58", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
              {area}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto", padding: "8px 20px 12px", background: "#FDF6EE", borderBottom: "1px solid #F0E8DC" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {CERTS.map((cert) => (
            <button key={cert} onClick={() => toggleCert(cert)} style={CERT_STYLE(selectedCerts.includes(cert))}>{cert}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 76, background: "#F0E8DC", borderRadius: 14 }} />)}
          </div>
        )}

        {!isLoading && restaurants.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Flame size={48} color="#D4C8BC" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", color: "#1A1208", marginBottom: 8 }}>
              {mode === "kashif" ? "KASHIF HASN'T NOMMED HERE" : "NO RANKINGS YET"}
            </h3>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem" }}>
              {selectedCerts.length > 0 || selectedArea !== "All Areas" ? "Try adjusting your filters." : mode === "kashif" ? "Kashif hasn't dropped noms yet — check back soon." : "Once restaurants get noms, the top 10 will appear here."}
            </p>
          </div>
        )}

        {!isLoading && restaurants.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {restaurants.map((r) => {
              const score = displayScore(r);
              return (
                <Link key={r.id} href={`/restaurant/${r.id}`}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF9F2", border: "1px solid #E8DDD0", borderRadius: 16, padding: "12px 14px", cursor: "pointer", transition: "transform 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)"; }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F0E8DC", color: "#1A1208", fontFamily: "var(--app-font-display)", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: "0.02em" }}>
                      {r.rank}
                    </div>
                    {r.image_url && (
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                        <img src={r.image_url} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.15rem", letterSpacing: "0.04em", color: "#1A1208", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {r.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#7A6A58", fontSize: "0.75rem", marginTop: 2 }}>
                        <MapPin size={10} />
                        <span>{r.areaName}</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span>{r.total_noms} nom{r.total_noms !== 1 ? "s" : ""}</span>
                      </div>
                      {r.certifications.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                          {r.certifications.map((c: string) => (
                            <span key={c} style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", background: c === "Muslim-Owned" ? "#2C1E0C" : "#7A4800", color: c === "Muslim-Owned" ? "#D4C8BC" : "#FFD166", padding: "1px 6px", borderRadius: 99 }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {score != null ? (
                        <>
                          <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#E8420A", letterSpacing: "0.04em", lineHeight: 1 }}>{Number(score).toFixed(1)}</div>
                          <div style={{ fontSize: "0.58rem", color: "#7A6A58", fontWeight: 600, letterSpacing: "0.08em" }}>{mode === "kashif" ? "KASHIF" : "/10"}</div>
                        </>
                      ) : (
                        <div style={{ color: "#D4C8BC", fontSize: "0.75rem" }}>—</div>
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
