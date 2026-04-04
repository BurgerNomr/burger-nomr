import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useListRestaurants } from "@workspace/api-client-react";
import { RestaurantCard } from "@/components/RestaurantCard";

const CAPE_TOWN_AREAS = [
  "All Areas",
  "Bo-Kaap",
  "Sea Point",
  "CBD",
  "Claremont",
  "Wynberg",
  "Athlone",
  "Mitchells Plain",
  "Bellville",
  "Woodstock",
  "Observatory",
  "Salt River",
  "Green Point",
  "De Waterkant",
  "Rondebosch",
];

function EmptyExplore({ search, area }: { search: string; area: string }) {
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
        <Search size={32} color="#D4C8BC" />
      </div>
      <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", color: "#1A1208", marginBottom: 8 }}>
        NO RESULTS FOUND
      </h3>
      <p style={{ color: "#7A6A58", fontSize: "0.9rem", lineHeight: 1.5 }}>
        No burger spots match{search ? ` "${search}"` : ""}{area !== "All Areas" ? ` in ${area}` : ""}.
        <br />Try a different search or area.
      </p>
    </div>
  );
}

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    search: search || undefined,
    area: selectedArea !== "All Areas" ? selectedArea : undefined,
    limit: 50,
  };

  const { data: restaurants, isLoading } = useListRestaurants(params);

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ padding: "52px 20px 16px", background: "#FDF6EE" }}>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", margin: "0 0 16px", letterSpacing: "0.04em" }}>
          EXPLORE
        </h1>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#FFF9F2",
            border: "1.5px solid #E8DDD0",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 12,
          }}
        >
          <Search size={18} color="#7A6A58" />
          <input
            type="search"
            placeholder="Search burger spots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontFamily: "var(--app-font-sans)",
              fontSize: "0.95rem",
              color: "#1A1208",
              outline: "none",
            }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: showFilters ? "#E8420A" : "#F0E8DC",
              border: "none",
              borderRadius: 8,
              padding: "6px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: showFilters ? "white" : "#7A6A58",
              transition: "all 0.15s",
            }}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Area Filter */}
        {showFilters && (
          <div style={{ overflowX: "auto", paddingBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, width: "max-content" }}>
              {CAPE_TOWN_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 99,
                    border: "1.5px solid",
                    borderColor: selectedArea === area ? "#E8420A" : "#E8DDD0",
                    background: selectedArea === area ? "#E8420A" : "transparent",
                    color: selectedArea === area ? "white" : "#7A6A58",
                    fontFamily: "var(--app-font-sans)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "0 20px" }}>
        {selectedArea !== "All Areas" && (
          <p style={{ color: "#7A6A58", fontSize: "0.8rem", marginBottom: 12 }}>
            Showing results in <strong style={{ color: "#1A1208" }}>{selectedArea}</strong>
          </p>
        )}

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ height: 220, background: "#F0E8DC", borderRadius: 16 }}
              />
            ))}
          </div>
        )}

        {!isLoading && (!restaurants || restaurants.length === 0) && (
          <EmptyExplore search={search} area={selectedArea} />
        )}

        {!isLoading && restaurants && restaurants.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {restaurants.map((r) => (
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
