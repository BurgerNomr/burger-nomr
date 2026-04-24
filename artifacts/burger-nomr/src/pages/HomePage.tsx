import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
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
  const [featured, setFeatured] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("restaurants")
        .select("*, areas(name)")
        .eq("is_published", true)
        .not("kashif_score", "is", null)
        .order("kashif_reviewed_at", { ascending: false })
        .limit(1)
        .single();
      setFeatured(data);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) {
    return <div style={{ margin: "0 0 0", height: 220, background: "#1A1208", borderRadius: 0 }} />;
  }

  if (!featured) return null;

  return (
    <div
      style={{ position: "relative", overflow: "hidden", background: "#1A1208", cursor: "pointer" }}
      onClick={() => navigate(`/restaurant/${featured.id}`)}
    >
      {featured.image_url && (
        <img
          src={featured.image_url}
          alt={featured.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(26,18,8,0.95) 40%, rgba(232,66,10,0.2) 100%)" }} />
      <div style={{ position: "relative", zIndex: 1, padding: "52px 20px 28px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#E8420A", color: "white", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 99, marginBottom: 16 }}>
          KASHIF'S TOP PICK
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", color: "white", margin: "0 0 4px", letterSpacing: "0.04em", lineHeight: 1.05 }}>
              {featured.name}
            </h1>
            <p style={{ color: "#7A6A58", fontSize: "0.82rem", margin: "0 0 10px" }}>
              {featured.areas?.name}
            </p>
            {featured.entry_burger && (
              <p style={{ color: "#D4C8BC", fontSize: "0.8rem", margin: "0 0 12px", fontStyle: "italic" }}>
                Kashif ordered: <span style={{ color: "white", fontStyle: "normal" }}>{featured.entry_burger}</span>
              </p>
            )}
            {featured.kashif_verdict && (
              <p style={{ color: "#D4C8BC", fontSize: "0.85rem", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                "{featured.kashif_verdict}"
              </p>
            )}
          </div>
          {featured.kashif_score && (
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--app-font-display)", fontSize: "4rem", color: scoreColor(featured.kashif_score), letterSpacing: "0.02em", lineHeight: 1 }}>
                {Number(featured.kashif_score).toFixed(1)}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#7A6A58", fontWeight: 600, letterSpacing: "0.08em" }}>/10</div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 4, color: "#E8420A", fontSize: "0.82rem", fontWeight: 600 }}>
          See restaurant <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState("All");
  const [recent, setRecent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      let query = supabase
        .from("restaurants")
        .select("*, areas(name)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (selectedArea !== "All") {
        const { data: areaData } = await supabase
          .from("areas")
          .select("id")
          .eq("name", selectedArea)
          .single();
        if (areaData) query = query.eq("area_id", areaData.id);
      }

      const { data } = await query;
      setRecent(data || []);
      setIsLoading(false);
    }
    load();
  }, [selectedArea]);

  return (
    <div className="page-content">
      <KashifHero />
      <div style={{ overflowX: "auto", padding: "16px 20px 12px", background: "#FDF6EE", borderBottom: "1px solid #F0E8DC" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", borderColor: selectedArea === area ? "#E8420A" : "#E8DDD0", background: selectedArea === area ? "#E8420A" : "transparent", color: selectedArea === area ? "white" : "#7A6A58", fontFamily: "var(--app-font-sans)", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", margin: 0, letterSpacing: "0.04em" }}>
            {selectedArea === "All" ? "RECENTLY ADDED" : selectedArea.toUpperCase()}
          </h2>
          <Link href="/submit">
            <button style={{ background: "none", border: "1.5px solid #E8DDD0", borderRadius: 10, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#7A6A58", fontSize: "0.78rem", fontWeight: 600 }}>
