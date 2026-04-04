import { useRoute, Link } from "wouter";
import { useGetRestaurant, useGetRestaurantReviews } from "@workspace/api-client-react";
import { ArrowLeft, MapPin, Star, PenSquare } from "lucide-react";
import { NomScore, NomBadge } from "@/components/NomScore";
import { useAuth } from "@/lib/auth";

function ReviewItem({ review }: { review: {
  id: string;
  user_name: string;
  overall_rating: number;
  patty_rating: number;
  bun_rating: number;
  sauce_rating: number;
  value_rating: number;
  comment?: string | null;
  created_at: string;
}}) {
  const date = new Date(review.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        background: "#FFF9F2",
        borderRadius: 14,
        border: "1px solid #E8DDD0",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1A1208" }}>{review.user_name}</div>
          <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 2 }}>{date}</div>
        </div>
        <NomBadge rating={review.overall_rating} size="sm" />
      </div>
      <NomScore
        patty_rating={review.patty_rating}
        bun_rating={review.bun_rating}
        sauce_rating={review.sauce_rating}
        value_rating={review.value_rating}
      />
      {review.comment && (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: "0.88rem",
            color: "#1A1208",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          "{review.comment}"
        </p>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  const [, params] = useRoute("/restaurant/:id");
  const id = params?.id ?? "";
  const { user } = useAuth();

  const { data: restaurant, isLoading } = useGetRestaurant(id, {
    query: { enabled: !!id, queryKey: ["getRestaurant", id] },
  });
  const { data: reviews } = useGetRestaurantReviews(id, {
    query: { enabled: !!id, queryKey: ["getRestaurantReviews", id] },
  });

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
        <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.5rem", color: "#1A1208" }}>
          SPOT NOT FOUND
        </h2>
        <Link href="/explore">
          <button style={{ marginTop: 16, background: "#E8420A", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}>
            Back to Explore
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Back button */}
      <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 50, padding: "0 20px" }}>
        <Link href="/explore">
          <button
            style={{
              background: "rgba(26,18,8,0.7)",
              backdropFilter: "blur(8px)",
              border: "none",
              borderRadius: 10,
              padding: "8px 12px",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </Link>
      </div>

      {/* Hero Image */}
      <div
        style={{
          height: 260,
          background: restaurant.image_url
            ? "none"
            : "linear-gradient(135deg, #1A1208 0%, #2C1E0C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
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
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="12" y="36" width="56" height="28" rx="6" fill="rgba(232,66,10,0.2)"/>
              <rect x="8" y="28" width="64" height="10" rx="5" fill="rgba(232,66,10,0.3)"/>
              <ellipse cx="40" cy="28" rx="24" ry="12" fill="rgba(232,66,10,0.2)"/>
              <rect x="24" y="60" width="32" height="6" rx="3" fill="rgba(232,66,10,0.2)"/>
            </svg>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: "linear-gradient(transparent, #FDF6EE)",
          }}
        />
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Name & Area */}
        <h1
          style={{
            fontFamily: "var(--app-font-display)",
            fontSize: "2.5rem",
            margin: "-20px 0 4px",
            letterSpacing: "0.04em",
            lineHeight: 1,
            color: "#1A1208",
          }}
        >
          {restaurant.name}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#7A6A58",
            fontSize: "0.85rem",
            marginBottom: 12,
          }}
        >
          <MapPin size={13} />
          <span>{restaurant.area}</span>
          {restaurant.address && (
            <>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{restaurant.address}</span>
            </>
          )}
        </div>

        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {restaurant.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
            {restaurant.price_range && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#1A1208",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 99,
                }}
              >
                {restaurant.price_range}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <p style={{ fontSize: "0.9rem", color: "#1A1208", lineHeight: 1.6, marginBottom: 20 }}>
            {restaurant.description}
          </p>
        )}

        {/* NOM+ Score */}
        <div
          style={{
            background: "#FFF9F2",
            border: "1px solid #E8DDD0",
            borderRadius: 16,
            padding: "16px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h3 style={{ fontFamily: "var(--app-font-display)", fontSize: "1.2rem", margin: 0, letterSpacing: "0.04em" }}>
                NOM+ SCORE
              </h3>
              <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 2 }}>
                Based on {restaurant.total_reviews} review{restaurant.total_reviews !== 1 ? "s" : ""}
              </div>
            </div>
            <NomBadge rating={restaurant.avg_rating} size="lg" />
          </div>

          {reviews && reviews.length > 0 ? (() => {
            const avg = (field: keyof typeof reviews[0]) =>
              reviews.reduce((sum, r) => sum + (r[field] as number), 0) / reviews.length;
            return (
              <NomScore
                patty_rating={avg("patty_rating")}
                bun_rating={avg("bun_rating")}
                sauce_rating={avg("sauce_rating")}
                value_rating={avg("value_rating")}
                size="lg"
              />
            );
          })() : (
            <p style={{ color: "#7A6A58", fontSize: "0.85rem", textAlign: "center", margin: "8px 0" }}>
              No ratings yet. Be the first to Nom this spot!
            </p>
          )}
        </div>

        {/* CTA */}
        {user ? (
          <Link href={`/rate/${restaurant.id}`}>
            <button
              style={{
                width: "100%",
                padding: "14px",
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
                marginBottom: 24,
              }}
            >
              <PenSquare size={18} />
              WRITE A NOM+ REVIEW
            </button>
          </Link>
        ) : (
          <div
            style={{
              background: "#F0E8DC",
              borderRadius: 12,
              padding: "14px",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <p style={{ margin: "0 0 10px", color: "#7A6A58", fontSize: "0.85rem" }}>
              Sign in to leave a Nom+ review
            </p>
            <Link href="/">
              <button
                style={{
                  background: "#E8420A",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontFamily: "var(--app-font-display)",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                SIGN IN
              </button>
            </Link>
          </div>
        )}

        {/* Reviews */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--app-font-display)",
              fontSize: "1.4rem",
              margin: "0 0 14px",
              letterSpacing: "0.04em",
            }}
          >
            REVIEWS ({reviews?.length ?? 0})
          </h2>
          {reviews && reviews.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "#FFF9F2",
                borderRadius: 14,
                border: "1px solid #E8DDD0",
              }}
            >
              <Star size={32} color="#D4C8BC" style={{ marginBottom: 12 }} />
              <p style={{ color: "#7A6A58", fontSize: "0.9rem", margin: 0 }}>
                No reviews yet. Be the first Nomr!
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews?.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
