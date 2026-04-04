import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetRestaurant, useCreateNom } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Check } from "lucide-react";

function ScoreLabel(score: number): string {
  if (score === 0) return "—";
  if (score < 3) return "Nah";
  if (score < 5) return "Meh";
  if (score < 6.5) return "Decent";
  if (score < 8) return "Solid";
  if (score < 9) return "Great";
  if (score < 10) return "Fire";
  return "LEGENDARY";
}

function scoreColor(score: number): string {
  if (score >= 8) return "#E8420A";
  if (score >= 6) return "#F07040";
  if (score >= 4) return "#7A6A58";
  return "#D4C8BC";
}

export default function RatePage() {
  const [, params] = useRoute("/rate/:restaurantId");
  const restaurantId = params?.restaurantId ?? "";
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: restaurant } = useGetRestaurant(restaurantId, {
    query: { enabled: !!restaurantId, queryKey: ["getRestaurant", restaurantId] },
  });

  const { mutate: createNom, isPending } = useCreateNom();

  const [score, setScore] = useState(7.0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!user) return;

    createNom(
      {
        data: {
          restaurant_id: restaurantId,
          user_id: user.id,
          user_name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Anonymous",
          user_avatar: null,
          score,
          comment: comment || null,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => navigate(`/restaurant/${restaurantId}`), 2000);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#FDF6EE",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "#E8420A",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Check size={36} color="white" />
        </div>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#1A1208", margin: "0 0 8px", letterSpacing: "0.04em" }}>
          NOM SUBMITTED!
        </h2>
        <p style={{ color: "#7A6A58", textAlign: "center", fontSize: "0.9rem" }}>
          Your nom is in. Taking you back to the spot...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 20px", background: "#1A1208" }}>
        <button
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          style={{
            background: "none",
            border: "none",
            color: "#7A6A58",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.85rem",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.6rem", color: "white", margin: 0, letterSpacing: "0.04em" }}>
          DROP YOUR NOM
        </h1>
        {restaurant && (
          <p style={{ color: "#7A6A58", margin: "4px 0 0", fontSize: "0.85rem" }}>
            {restaurant.name}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "40px 24px 100px" }}>
        {/* Big score display */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "6rem",
              letterSpacing: "0.04em",
              lineHeight: 1,
              color: scoreColor(score),
              transition: "color 0.2s ease",
            }}
          >
            {score.toFixed(1)}
          </div>
          <div
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "1.5rem",
              letterSpacing: "0.08em",
              color: scoreColor(score),
              marginTop: 4,
              transition: "color 0.2s ease",
            }}
          >
            {ScoreLabel(score)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#7A6A58", marginTop: 6 }}>out of 10.0</div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.75rem", color: "#7A6A58", fontWeight: 500 }}>0</span>
            <span style={{ fontSize: "0.75rem", color: "#7A6A58", fontWeight: 500 }}>10</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={score}
            onChange={(e) => setScore(parseFloat(e.target.value))}
            style={{
              width: "100%",
              appearance: "none",
              height: 6,
              borderRadius: 99,
              background: `linear-gradient(to right, ${scoreColor(score)} ${score * 10}%, #F0E8DC ${score * 10}%)`,
              outline: "none",
              cursor: "pointer",
            }}
          />
          {/* Tick marks */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
              <span
                key={n}
                style={{
                  fontSize: "0.6rem",
                  color: score >= n ? "#E8420A" : "#D4C8BC",
                  fontWeight: score === n ? 700 : 400,
                  width: 16,
                  textAlign: "center",
                  transition: "color 0.15s",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#7A6A58",
              display: "block",
              marginBottom: 8,
              letterSpacing: "0.03em",
            }}
          >
            ANY LAST WORDS? (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="The patty was dripping, the bun held up, the sauce slapped..."
            rows={4}
            style={{
              width: "100%",
              padding: "14px",
              border: "1.5px solid #E8DDD0",
              borderRadius: 12,
              fontFamily: "var(--app-font-sans)",
              fontSize: "0.95rem",
              color: "#1A1208",
              background: "#FFF9F2",
              outline: "none",
              resize: "none",
              lineHeight: 1.5,
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          style={{
            width: "100%",
            padding: "16px",
            background: isPending ? "#D4C8BC" : "#E8420A",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontFamily: "var(--app-font-display)",
            fontSize: "1.3rem",
            letterSpacing: "0.06em",
            cursor: isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
        >
          {isPending ? "SUBMITTING..." : `NOM IT — ${score.toFixed(1)}`}
        </button>
      </div>
    </div>
  );
}
