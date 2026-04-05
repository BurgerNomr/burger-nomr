import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useGetRestaurant, useCreateNom } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Check, Share2, ChevronRight } from "lucide-react";

function scoreColor(score: number): string {
  if (score >= 8.5) return "#E8420A";
  if (score >= 7) return "#F07040";
  if (score >= 5) return "#7A6A58";
  return "#D4C8BC";
}

function scoreLabel(score: number): string {
  if (score === 0) return "—";
  if (score < 3) return "Nah";
  if (score < 5) return "Meh";
  if (score < 6.5) return "Decent";
  if (score < 8) return "Solid";
  if (score < 9) return "Great";
  if (score < 10) return "Fire";
  return "LEGENDARY";
}

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function AuthPrompt({ returnPath }: { returnPath: string }) {
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
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          background: "#F0E8DC",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="5" y="16" width="26" height="12" rx="3" fill="#D4C8BC"/>
          <rect x="3" y="12" width="30" height="5" rx="2.5" fill="#C4B8AC"/>
          <ellipse cx="18" cy="12" rx="11" ry="6" fill="#D4C8BC"/>
        </svg>
      </div>
      <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", margin: "0 0 10px", letterSpacing: "0.04em" }}>
        SIGN IN TO NOM
      </h2>
      <p style={{ color: "#7A6A58", marginBottom: 28, fontSize: "0.9rem", lineHeight: 1.5 }}>
        Create a free account to drop your nom and join Cape Town's halaal burger community.
      </p>
      <Link href={`/auth?return=${encodeURIComponent(returnPath)}`}>
        <button
          style={{
            width: 280,
            padding: "14px",
            background: "#E8420A",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontFamily: "var(--app-font-display)",
            fontSize: "1.2rem",
            letterSpacing: "0.06em",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          SIGN IN / REGISTER
        </button>
      </Link>
      <Link href="/">
        <button style={{ background: "none", border: "none", color: "#7A6A58", fontSize: "0.85rem", cursor: "pointer" }}>
          Maybe later
        </button>
      </Link>
    </div>
  );
}

function SuccessScreen({ score, restaurantName, restaurantId, burgerName }: {
  score: number;
  restaurantName: string;
  restaurantId: string;
  burgerName: string;
}) {
  const [, navigate] = useLocation();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const text = `I gave ${restaurantName} a ${score.toFixed(1)}/10 on Burger Nomr${burgerName ? ` for their ${burgerName}` : ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Burger Nomr", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#1A1208",
      }}
    >
      {/* Glow */}
      <div
        style={{
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(232,66,10,0.4) 0%, transparent 70%)",
          position: "absolute",
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Check */}
        <div
          style={{
            width: 64,
            height: 64,
            background: "#E8420A",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Check size={32} color="white" />
        </div>

        <div
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "0.8rem",
            color: "#7A6A58",
            letterSpacing: "0.12em",
            marginBottom: 8,
          }}
        >
          NOM SUBMITTED
        </div>

        {/* Big score */}
        <div
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "7rem",
            color: scoreColor(score),
            letterSpacing: "0.02em",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {score.toFixed(1)}
        </div>
        <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.2rem", color: scoreColor(score), letterSpacing: "0.08em", marginBottom: 4 }}>
          {scoreLabel(score)}
        </div>
        <div style={{ fontSize: "0.85rem", color: "#7A6A58", marginBottom: 6 }}>for {restaurantName}</div>
        {burgerName && (
          <div style={{ fontSize: "0.82rem", color: "#D4C8BC", fontStyle: "italic", marginBottom: 28 }}>
            {burgerName}
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={handleShare}
          style={{
            width: 280,
            padding: "14px",
            background: shared ? "#7A6A58" : "#E8420A",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontFamily: "var(--app-font-display)",
            fontSize: "1.1rem",
            letterSpacing: "0.06em",
            cursor: "pointer",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.2s",
          }}
        >
          <Share2 size={18} />
          {shared ? "COPIED!" : "SHARE YOUR NOM"}
        </button>

        <button
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          style={{
            width: 280,
            padding: "14px",
            background: "rgba(122,106,88,0.2)",
            color: "#D4C8BC",
            border: "1px solid rgba(122,106,88,0.3)",
            borderRadius: 12,
            fontFamily: "var(--app-font-display)",
            fontSize: "1.1rem",
            letterSpacing: "0.06em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          SEE RESTAURANT
        </button>
      </div>
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

  const { mutate: createNom, isPending } = useCreateNom();

  // Step state
  const [step, setStep] = useState(1);
  const [burgerName, setBurgerName] = useState("");
  const [score, setScore] = useState(7.0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const wordCount = countWords(comment);
  const commentValid = wordCount <= 10;

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
          burger_ordered: burgerName || null,
          comment: comment || null,
        },
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  if (!user) {
    return <AuthPrompt returnPath={`/rate/${restaurantId}`} />;
  }

  if (submitted) {
    return (
      <SuccessScreen
        score={score}
        restaurantName={restaurant?.name ?? "this spot"}
        restaurantId={restaurantId}
        burgerName={burgerName}
      />
    );
  }

  // Header
  const header = (
    <div style={{ padding: "52px 20px 20px", background: "#1A1208" }}>
      <button
        onClick={() => step > 1 ? setStep(s => s - 1) : navigate(`/restaurant/${restaurantId}`)}
        style={{ background: "none", border: "none", color: "#7A6A58", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: 16 }}
      >
        <ArrowLeft size={16} />
        {step > 1 ? "Back" : "Cancel"}
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "white", margin: 0, letterSpacing: "0.04em" }}>
          DROP YOUR NOM
        </h1>
        <span style={{ color: "#7A6A58", fontSize: "0.8rem" }}>{step}/4</span>
      </div>

      {restaurant && (
        <p style={{ color: "#7A6A58", margin: "0 0 12px", fontSize: "0.85rem" }}>{restaurant.name}</p>
      )}

      {/* Progress */}
      <div style={{ height: 3, background: "rgba(122,106,88,0.3)", borderRadius: 99 }}>
        <div
          style={{
            height: "100%",
            background: "#E8420A",
            borderRadius: 99,
            width: `${(step / 4) * 100}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );

  // Step 1: Confirm restaurant + burger name
  if (step === 1) {
    return (
      <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
        {header}
        <div style={{ flex: 1, padding: "32px 20px" }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", margin: "0 0 6px", letterSpacing: "0.04em" }}>
            WHAT DID YOU ORDER?
          </h2>
          <p style={{ color: "#7A6A58", fontSize: "0.88rem", marginBottom: 28, lineHeight: 1.5 }}>
            Tell us which burger you had at {restaurant?.name ?? "this spot"}.
          </p>

          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#7A6A58", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
            BURGER NAME (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Double Smash Special, Classic Cheeseburger..."
            value={burgerName}
            onChange={(e) => setBurgerName(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              border: "1.5px solid #E8DDD0",
              borderRadius: 12,
              fontFamily: "var(--app-font-sans)",
              fontSize: "1rem",
              color: "#1A1208",
              background: "#FFF9F2",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 28,
            }}
          />

          {/* Restaurant confirm */}
          {restaurant && (
            <div
              style={{
                background: "#FFF9F2",
                border: "1px solid #E8DDD0",
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {restaurant.image_url && (
                <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <img src={restaurant.image_url} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.1rem", color: "#1A1208", letterSpacing: "0.04em" }}>
                  {restaurant.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#7A6A58" }}>{restaurant.area}</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(2)}
            style={{
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 40px)",
              maxWidth: 390,
              padding: "15px",
              background: "#E8420A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--app-font-display)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 50,
            }}
          >
            NEXT — SCORE IT <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Score slider
  if (step === 2) {
    return (
      <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
        {header}
        <div style={{ flex: 1, padding: "32px 20px 100px" }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", margin: "0 0 6px", letterSpacing: "0.04em" }}>
            WHAT'S YOUR NOM?
          </h2>
          <p style={{ color: "#7A6A58", fontSize: "0.88rem", marginBottom: 40, lineHeight: 1.5 }}>
            Drag the slider to score this burger from 0 to 10.
          </p>

          {/* Big score */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontFamily: "var(--app-font-display)",
                fontSize: "8rem",
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: scoreColor(score),
                transition: "color 0.2s ease",
              }}
            >
              {score.toFixed(1)}
            </div>
            <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1.4rem", letterSpacing: "0.08em", color: scoreColor(score), marginTop: 4, transition: "color 0.2s ease" }}>
              {scoreLabel(score)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#D4C8BC", marginTop: 4 }}>out of 10.0</div>
          </div>

          {/* Slider */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.72rem", color: "#7A6A58" }}>0</span>
              <span style={{ fontSize: "0.72rem", color: "#7A6A58" }}>10</span>
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
                height: 8,
                borderRadius: 99,
                background: `linear-gradient(to right, ${scoreColor(score)} ${score * 10}%, #F0E8DC ${score * 10}%)`,
                outline: "none",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                <span
                  key={n}
                  style={{
                    fontSize: "0.6rem",
                    color: score >= n ? "#E8420A" : "#D4C8BC",
                    width: 16,
                    textAlign: "center",
                    transition: "color 0.1s",
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            style={{
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 40px)",
              maxWidth: 390,
              padding: "15px",
              background: "#E8420A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--app-font-display)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 50,
            }}
          >
            NOM IT — {score.toFixed(1)} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Comment (max 10 words)
  if (step === 3) {
    return (
      <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
        {header}
        <div style={{ flex: 1, padding: "32px 20px 100px" }}>
          <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", margin: "0 0 6px", letterSpacing: "0.04em" }}>
            ANY LAST WORDS?
          </h2>
          <p style={{ color: "#7A6A58", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.5 }}>
            Optional. Maximum 10 words — make them count.
          </p>

          <div style={{ position: "relative" }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="The sauce was unreal..."
              rows={3}
              style={{
                width: "100%",
                padding: "14px",
                border: `1.5px solid ${!commentValid ? "#DC2626" : "#E8DDD0"}`,
                borderRadius: 12,
                fontFamily: "var(--app-font-sans)",
                fontSize: "1rem",
                color: "#1A1208",
                background: "#FFF9F2",
                outline: "none",
                resize: "none",
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 14,
                fontSize: "0.75rem",
                color: !commentValid ? "#DC2626" : wordCount >= 8 ? "#F07040" : "#D4C8BC",
                fontWeight: 600,
              }}
            >
              {wordCount}/10
            </div>
          </div>
          {!commentValid && (
            <p style={{ color: "#DC2626", fontSize: "0.82rem", marginTop: 6 }}>
              Maximum 10 words — trim it down.
            </p>
          )}

          <button
            onClick={() => commentValid && setStep(4)}
            disabled={!commentValid}
            style={{
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 40px)",
              maxWidth: 390,
              padding: "15px",
              background: !commentValid ? "#D4C8BC" : "#E8420A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--app-font-display)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
              cursor: !commentValid ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 50,
            }}
          >
            NEXT — CONFIRM <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Confirm
  return (
    <div style={{ minHeight: "100dvh", background: "#FDF6EE", display: "flex", flexDirection: "column" }}>
      {header}
      <div style={{ flex: 1, padding: "32px 20px 100px" }}>
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.8rem", color: "#1A1208", margin: "0 0 6px", letterSpacing: "0.04em" }}>
          CONFIRM YOUR NOM
        </h2>
        <p style={{ color: "#7A6A58", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.5 }}>
          Look good? Tap submit to lock in your score.
        </p>

        {/* Summary card */}
        <div
          style={{
            background: "#1A1208",
            borderRadius: 18,
            padding: "20px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${scoreColor(score)}50 0%, transparent 70%)`,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", color: "white", letterSpacing: "0.04em", marginBottom: 4 }}>
              {restaurant?.name}
            </div>
            {burgerName && (
              <div style={{ fontSize: "0.82rem", color: "#7A6A58", marginBottom: 16, fontStyle: "italic" }}>
                {burgerName}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#7A6A58", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 2 }}>
                  YOUR NOM
                </div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "5rem", color: scoreColor(score), letterSpacing: "0.02em", lineHeight: 1 }}>
                  {score.toFixed(1)}
                </div>
                <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", color: scoreColor(score), letterSpacing: "0.06em" }}>
                  {scoreLabel(score)}
                </div>
              </div>
              <div style={{ fontSize: "1rem", color: "#7A6A58", textAlign: "right" }}>
                /10
              </div>
            </div>
            {comment && (
              <div style={{ marginTop: 16, padding: "12px", background: "rgba(122,106,88,0.15)", borderRadius: 10 }}>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#D4C8BC", fontStyle: "italic", lineHeight: 1.5 }}>
                  "{comment}"
                </p>
              </div>
            )}
          </div>
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
            transition: "background 0.15s",
          }}
        >
          {isPending ? "SUBMITTING..." : "SUBMIT NOM"}
        </button>
      </div>
    </div>
  );
}
