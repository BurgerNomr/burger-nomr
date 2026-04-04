import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetRestaurant, useCreateReview } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface RatingStep {
  field: "patty_rating" | "bun_rating" | "sauce_rating" | "value_rating";
  label: string;
  emoji: string;
  description: string;
}

const STEPS: RatingStep[] = [
  { field: "patty_rating", label: "The Patty", emoji: "🥩", description: "How was the meat? Quality, cook, seasoning." },
  { field: "bun_rating", label: "The Bun", emoji: "🍞", description: "Soft? Toasted? Held together?" },
  { field: "sauce_rating", label: "The Sauce", emoji: "🧃", description: "Special sauce, flavour, balance." },
  { field: "value_rating", label: "Value", emoji: "💰", description: "Was it worth the money?" },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            transition: "transform 0.1s",
            transform: hover >= star ? "scale(1.2)" : "scale(1)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path
              d="M22 4L27.09 16.26L40 18.18L31 26.96L33.18 40L22 33.77L10.82 40L13 26.96L4 18.18L16.91 16.26L22 4Z"
              fill={(hover || value) >= star ? "#E8420A" : "#F0E8DC"}
              stroke={(hover || value) >= star ? "#E8420A" : "#E8DDD0"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function RatePage() {
  const [, params] = useRoute("/rate/:restaurantId");
  const restaurantId = params?.restaurantId ?? "";
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: restaurant } = useGetRestaurant(restaurantId, {
    query: { enabled: !!restaurantId, queryKey: ["getRestaurant", restaurantId] },
  });

  const { mutate: createReview, isPending } = useCreateReview();

  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState({ patty_rating: 0, bun_rating: 0, sauce_rating: 0, value_rating: 0 });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentStep = step < STEPS.length ? STEPS[step] : null;
  const isCommentStep = step === STEPS.length;

  const handleNext = () => {
    if (currentStep && ratings[currentStep.field] === 0) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    if (!user) return;

    const overall = (ratings.patty_rating + ratings.bun_rating + ratings.sauce_rating + ratings.value_rating) / 4;

    createReview(
      {
        data: {
          restaurant_id: restaurantId,
          user_id: user.id,
          user_name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Anonymous",
          user_avatar: null,
          overall_rating: Math.round(overall * 10) / 10,
          patty_rating: ratings.patty_rating,
          bun_rating: ratings.bun_rating,
          sauce_rating: ratings.sauce_rating,
          value_rating: ratings.value_rating,
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
          Your review is in. Taking you back to the spot...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "52px 20px 20px",
          background: "#1A1208",
        }}
      >
        <button
          onClick={() => (step > 0 ? setStep((s) => s - 1) : navigate(`/restaurant/${restaurantId}`))}
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
          NOM+ REVIEW
        </h1>
        {restaurant && (
          <p style={{ color: "#7A6A58", margin: "4px 0 0", fontSize: "0.85rem" }}>
            {restaurant.name}
          </p>
        )}

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 4, background: "rgba(122,106,88,0.3)", borderRadius: 99 }}>
          <div
            style={{
              height: "100%",
              background: "#E8420A",
              borderRadius: 99,
              width: `${((step) / (STEPS.length + 1)) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {STEPS.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.65rem",
                color: i < step ? "#E8420A" : "#7A6A58",
                fontWeight: i === step ? 700 : 400,
              }}
            >
              {s.label.split(" ")[1] ?? s.label}
            </span>
          ))}
          <span
            style={{
              fontSize: "0.65rem",
              color: isCommentStep ? "#E8420A" : "#7A6A58",
            }}
          >
            Comment
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "32px 20px" }}>
        {currentStep && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 12, lineHeight: 1 }}>
              {currentStep.emoji}
            </div>
            <h2
              style={{
                fontFamily: "var(--app-font-display)",
                fontSize: "2rem",
                color: "#1A1208",
                margin: "0 0 8px",
                letterSpacing: "0.04em",
              }}
            >
              RATE {currentStep.label.toUpperCase()}
            </h2>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem", marginBottom: 32, lineHeight: 1.5 }}>
              {currentStep.description}
            </p>

            <StarPicker
              value={ratings[currentStep.field]}
              onChange={(v) => setRatings((r) => ({ ...r, [currentStep.field]: v }))}
            />

            {ratings[currentStep.field] > 0 && (
              <div
                style={{
                  marginTop: 20,
                  fontFamily: "var(--app-font-display)",
                  fontSize: "1.2rem",
                  color: "#E8420A",
                  letterSpacing: "0.04em",
                }}
              >
                {["", "Nah", "Meh", "Decent", "Solid", "FIRE"][ratings[currentStep.field]]}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={ratings[currentStep.field] === 0}
              style={{
                position: "fixed",
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 40px)",
                maxWidth: 390,
                padding: "14px",
                background: ratings[currentStep.field] === 0 ? "#D4C8BC" : "#E8420A",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--app-font-display)",
                fontSize: "1.2rem",
                letterSpacing: "0.06em",
                cursor: ratings[currentStep.field] === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.15s",
                zIndex: 50,
              }}
            >
              NEXT <ArrowRight size={18} />
            </button>
          </div>
        )}

        {isCommentStep && (
          <div>
            <h2
              style={{
                fontFamily: "var(--app-font-display)",
                fontSize: "2rem",
                color: "#1A1208",
                margin: "0 0 8px",
                letterSpacing: "0.04em",
              }}
            >
              ANY LAST WORDS?
            </h2>
            <p style={{ color: "#7A6A58", fontSize: "0.9rem", marginBottom: 20, lineHeight: 1.5 }}>
              Tell the people what you really think. (Optional)
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="The patty was dripping, the bun held up, the sauce was questionable..."
              rows={5}
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
              }}
            />

            {/* Rating summary */}
            <div
              style={{
                background: "#FFF9F2",
                border: "1px solid #E8DDD0",
                borderRadius: 14,
                padding: "14px 16px",
                marginTop: 16,
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#7A6A58", fontWeight: 600, marginBottom: 10, letterSpacing: "0.05em" }}>
                YOUR NOM+ SCORES
              </div>
              {STEPS.map((s) => (
                <div key={s.field} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.85rem", color: "#7A6A58" }}>{s.label}</span>
                  <span style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", color: "#E8420A", letterSpacing: "0.04em" }}>
                    {ratings[s.field]}/5
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid #E8DDD0",
                  marginTop: 8,
                  paddingTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1A1208" }}>Overall</span>
                <span style={{ fontFamily: "var(--app-font-display)", fontSize: "1.1rem", color: "#E8420A", letterSpacing: "0.04em" }}>
                  {((ratings.patty_rating + ratings.bun_rating + ratings.sauce_rating + ratings.value_rating) / 4).toFixed(1)}/5
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
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
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isPending ? "SUBMITTING..." : "SUBMIT NOM+"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
