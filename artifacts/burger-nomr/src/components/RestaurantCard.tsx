import { Link } from "wouter";
import { MapPin } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  area: string;
  image_url?: string | null;
  avg_score?: number | null;
  total_noms: number;
  tags: string[];
  price_range?: string | null;
}

export function RestaurantCard({ id, name, area, image_url, avg_score, total_noms, tags, price_range }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`}>
      <div
        style={{
          background: "#FFF9F2",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #E8DDD0",
          cursor: "pointer",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(26,18,8,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div
          style={{
            height: 160,
            background: image_url ? "none" : "linear-gradient(135deg, #F0E8DC 0%, #E8DDD0 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {image_url ? (
            <img
              src={image_url}
              alt={name}
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
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="20" width="32" height="20" rx="4" fill="#E8DDD0"/>
                <rect x="4" y="16" width="40" height="6" rx="3" fill="#D4C8BC"/>
                <ellipse cx="24" cy="16" rx="14" ry="8" fill="#E8DDD0"/>
                <rect x="16" y="36" width="16" height="4" rx="2" fill="#D4C8BC"/>
              </svg>
            </div>
          )}

          {avg_score != null && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#E8420A",
                color: "white",
                fontFamily: "var(--app-font-display)",
                fontSize: "1.05rem",
                letterSpacing: "0.05em",
                padding: "3px 10px",
                borderRadius: 99,
              }}
            >
              {avg_score.toFixed(1)}
            </div>
          )}

          {price_range && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(26,18,8,0.7)",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              {price_range}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "12px 14px" }}>
          <h3
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "1.3rem",
              letterSpacing: "0.04em",
              margin: 0,
              color: "#1A1208",
              lineHeight: 1.1,
            }}
          >
            {name}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
              color: "#7A6A58",
              fontSize: "0.8rem",
            }}
          >
            <MapPin size={11} />
            <span>{area}</span>
            <span style={{ margin: "0 4px", opacity: 0.4 }}>•</span>
            <span>{total_noms} nom{total_noms !== 1 ? "s" : ""}</span>
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
