import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      if (!name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, name);
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account, then log in.");
    }
    setLoading(false);
  };

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
    transition: "border-color 0.15s",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FDF6EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      {/* Logo / Brand */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            width: 72,
            height: 72,
            background: "#E8420A",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="18" width="28" height="14" rx="3" fill="white" opacity="0.9"/>
            <rect x="4" y="14" width="32" height="5" rx="2.5" fill="white" opacity="0.7"/>
            <ellipse cx="20" cy="14" rx="12" ry="6" fill="white" opacity="0.85"/>
            <rect x="12" y="30" width="16" height="3" rx="1.5" fill="white" opacity="0.7"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.5rem", letterSpacing: "0.05em", color: "#1A1208", margin: 0 }}>
          BURGER NOMR
        </h1>
        <p style={{ color: "#7A6A58", fontSize: "0.9rem", marginTop: 6 }}>
          Cape Town's halaal burger guide
        </p>
      </div>

      {/* Form Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          background: "#FFF9F2",
          borderRadius: 20,
          border: "1px solid #E8DDD0",
          padding: "28px 24px",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "#F0E8DC",
            borderRadius: 10,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setSuccess(null); }}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
                fontFamily: "var(--app-font-sans)",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.15s",
                background: mode === m ? "#E8420A" : "transparent",
                color: mode === m ? "white" : "#7A6A58",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7A6A58", display: "block", marginBottom: 6 }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7A6A58", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#7A6A58", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#DC2626", fontSize: "0.85rem", padding: "10px 14px", borderRadius: 8 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#D1FAE5", color: "#065F46", fontSize: "0.85rem", padding: "10px 14px", borderRadius: 8 }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#D4C8BC" : "#E8420A",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "var(--app-font-display)",
              fontSize: "1.2rem",
              letterSpacing: "0.06em",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4,
              transition: "background 0.15s",
            }}
          >
            {loading ? "..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}
