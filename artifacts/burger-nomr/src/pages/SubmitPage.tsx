import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateRestaurant } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";

const AREAS = [
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
  "Other",
];

const PRICE_RANGES = ["R", "RR", "RRR", "RRRR"];

const POPULAR_TAGS = ["Smash Burger", "Gourmet", "Fast Food", "Takeaway", "Sit-down", "Spicy", "Vegan Options", "Late Night", "Delivery", "Family-friendly"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #E8DDD0",
  borderRadius: 10,
  fontFamily: "var(--app-font-sans)",
  fontSize: "0.95rem",
  background: "#FFF9F2",
  color: "#1A1208",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#7A6A58",
  display: "block",
  marginBottom: 6,
  letterSpacing: "0.03em",
};

export default function SubmitPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { mutate: createRestaurant, isPending } = useCreateRestaurant();

  const [form, setForm] = useState({
    name: "",
    area: "",
    address: "",
    description: "",
    image_url: "",
    price_range: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((t) =>
      t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.area || !form.address) {
      setError("Please fill in the required fields.");
      return;
    }
    setError(null);

    createRestaurant(
      {
        data: {
          name: form.name,
          area: form.area,
          address: form.address,
          description: form.description,
          image_url: form.image_url || null,
          price_range: form.price_range || null,
          tags: selectedTags,
        },
      },
      {
        onSuccess: (data) => {
          setSubmitted(true);
          setTimeout(() => navigate(`/restaurant/${data.id}`), 1500);
        },
        onError: () => {
          setError("Something went wrong. Please try again.");
        },
      }
    );
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#FDF6EE" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", marginBottom: 12 }}>
          SIGN IN FIRST
        </h2>
        <p style={{ color: "#7A6A58", textAlign: "center", marginBottom: 20, fontSize: "0.9rem" }}>
          You need to be signed in to submit a restaurant.
        </p>
        <Link href="/">
          <button style={{ background: "#E8420A", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: "var(--app-font-display)", fontSize: "1rem", cursor: "pointer" }}>
            SIGN IN
          </button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#FDF6EE" }}>
        <div style={{ width: 80, height: 80, background: "#E8420A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Check size={36} color="white" />
        </div>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#1A1208", margin: "0 0 8px", letterSpacing: "0.04em" }}>
          SPOT ADDED!
        </h2>
        <p style={{ color: "#7A6A58", textAlign: "center", fontSize: "0.9rem" }}>
          Taking you to the restaurant page...
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ padding: "52px 20px 20px", background: "#1A1208" }}>
        <Link href="/">
          <button style={{ background: "none", border: "none", color: "#7A6A58", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: 16 }}>
            <ArrowLeft size={16} /> Back
          </button>
        </Link>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", color: "white", margin: 0, letterSpacing: "0.04em" }}>
          ADD A SPOT
        </h1>
        <p style={{ color: "#7A6A58", fontSize: "0.85rem", margin: "4px 0 0" }}>
          Know a halaal burger spot worth nomming?
        </p>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Restaurant Name *</label>
            <input
              type="text"
              placeholder="e.g. The Burger Lab"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              style={inputStyle}
            />
          </div>

          {/* Area */}
          <div>
            <label style={labelStyle}>Area *</label>
            <select
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              required
              style={{ ...inputStyle, appearance: "none" }}
            >
              <option value="">Select area...</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>Street Address *</label>
            <input
              type="text"
              placeholder="e.g. 12 Wale Street, Bo-Kaap"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Tell the Nomrs about this spot..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label style={labelStyle}>Photo URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Price Range */}
          <div>
            <label style={labelStyle}>Price Range</label>
            <div style={{ display: "flex", gap: 8 }}>
              {PRICE_RANGES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, price_range: f.price_range === p ? "" : p }))}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    border: "1.5px solid",
                    borderColor: form.price_range === p ? "#E8420A" : "#E8DDD0",
                    background: form.price_range === p ? "#E8420A" : "transparent",
                    color: form.price_range === p ? "white" : "#7A6A58",
                    borderRadius: 8,
                    fontFamily: "var(--app-font-sans)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    border: "1.5px solid",
                    borderColor: selectedTags.includes(tag) ? "#E8420A" : "#E8DDD0",
                    background: selectedTags.includes(tag) ? "#E8420A" : "transparent",
                    color: selectedTags.includes(tag) ? "white" : "#7A6A58",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#DC2626", fontSize: "0.85rem", padding: "10px 14px", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px",
              background: isPending ? "#D4C8BC" : "#E8420A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--app-font-display)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {isPending ? "SUBMITTING..." : "ADD THIS SPOT"}
          </button>
        </form>
      </div>
    </div>
  );
}
