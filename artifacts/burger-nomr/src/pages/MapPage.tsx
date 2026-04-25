import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin } from "lucide-react";
import { Link } from "wouter";

const AREA_COORDS: Record<string, { color: string }> = {
  "City Bowl": { color: "#E8420A" },
  "Atlantic Seaboard": { color: "#F07040" },
  "Southern Suburbs": { color: "#7A6A58" },
  "Northern Suburbs": { color: "#1A1208" },
  "V&A Waterfront": { color: "#E8420A" },
  "Observatory": { color: "#F07040" },
  "Gardens": { color: "#7A6A58" },
  "Other Cape Town": { color: "#D4C8BC" },
};

export default function MapPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("restaurants")
        .select("*, areas(name)")
        .eq("is_published", true)
        .order("name", { ascending: true })
        .limit(100);
      setRestaurants(data || []);
    }
    load();
  }, []);

  const byArea: Record<string, any[]> = {};
  for (const r of restaurants) {
    const areaName = (r.areas as any)?.name ?? "Other Cape Town";
    if (!byArea[areaName]) byArea[areaName] = [];
    byArea[areaName].push(r);
  }
  const areas = Object.keys(byArea).sort();

  return (
    <div className="page-content">
      <div style={{ padding: "52px 20px 20px" }}>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", margin: "0 0 4px", letterSpacing: "0.04em" }}>MAP</h1>
        <p style={{ color: "#7A6A58", fontSize: "0.85rem", margin: 0 }}>Burger spots across Cape Town</p>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: "#1A1208", borderRadius: 20, padding: 20, position: "relative", overflow: "hidden", minHeight: 220 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(122,106,88,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(122,106,88,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "#7A6A58", fontSize: "0.75rem", margin: "0 0 16px", fontWeight: 500 }}>
              CAPE TOWN — {restaurants.length} HALAAL SPOTS
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {areas.map((area) => {
                const count = byArea[area]?.length ?? 0;
                const coords = AREA_COORDS[area];
                return (
                  <div key={area} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(253,246,238,0.1)", border: "1px solid rgba(232,66,10,0.3)", borderRadius: 10, padding: "6px 10px" }}>
                    <MapPin size={12} color={coords?.color ?? "#E8420A"} />
                    <span style={{ color: "white", fontSize: "0.78rem", fontWeight: 500 }}>{area}</span>
                    <span style={{ background: "#E8420A", color: "white", fontSize: "0.65rem", fontWeight: 700, borderRadius: 99, padding: "1px 6px", fontFamily: "var(--app-font-display)" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", margin: "0 0 14px", letterSpacing: "0.04em" }}>BY AREA</h2>

        {areas.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#7A6A58", fontSize: "0.9rem" }}>No spots on the map yet. Add the first one!</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {areas.map((area) => {
            const spots = byArea[area] ?? [];
            const coords = AREA_COORDS[area];
            return (
              <div key={area} style={{ background: "#FFF9F2", borderRadius: 14, border: "1px solid #E8DDD0", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0E8DC", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={14} color={coords?.color ?? "#E8420A"} />
                  <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.1rem", margin: 0, letterSpacing: "0.04em", flex: 1 }}>{area}</h3>
                  <span style={{ color: "#7A6A58", fontSize: "0.8rem" }}>{spots.length} spot{spots.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {spots.map((spot) => (
                    <Link key={spot.id} href={`/restaurant/${spot.id}`}>
                      <div
                        style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "background 0.1s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5EEE3")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1208" }}>{spot.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#7A6A58" }}>{spot.address}</div>
                        </div>
                        {spot.community_score != null && (
                          <span style={{ background: "#E8420A", color: "white", fontFamily: "var(--app-font-display)", fontSize: "0.9rem", padding: "2px 8px", borderRadius: 99, letterSpacing: "0.04em" }}>
                            {Number(spot.community_score).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
