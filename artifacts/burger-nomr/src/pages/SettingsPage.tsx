import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { ArrowLeft, LogOut, Bell, Info, Shield, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Nomr";

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ padding: "52px 20px 20px", background: "#1A1208" }}>
        <Link href="/profile">
          <button style={{ background: "none", border: "none", color: "#7A6A58", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", marginBottom: 16 }}>
            <ArrowLeft size={16} /> Back
          </button>
        </Link>
        <h1 style={{ fontFamily: "var(--app-font-display)", fontSize: "2.2rem", color: "white", margin: 0, letterSpacing: "0.04em" }}>
          SETTINGS
        </h1>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Profile Section */}
        <div style={{ background: "#FFF9F2", border: "1px solid #E8DDD0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #F0E8DC" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A58", letterSpacing: "0.08em", marginBottom: 12 }}>
              ACCOUNT
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, background: "#E8420A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--app-font-display)", fontSize: "1.3rem", color: "white" }}>
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#1A1208" }}>{displayName}</div>
                <div style={{ fontSize: "0.8rem", color: "#7A6A58" }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: "#FFF9F2", border: "1px solid #E8DDD0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0E8DC" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A58", letterSpacing: "0.08em" }}>
              PREFERENCES
            </div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Bell size={16} color="#7A6A58" />
              <span style={{ fontSize: "0.9rem", color: "#1A1208" }}>Notifications</span>
            </div>
            <button
              onClick={() => setNotifications((n) => !n)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                background: notifications ? "#E8420A" : "#E8DDD0",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: notifications ? 25 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>

        {/* About */}
        <div style={{ background: "#FFF9F2", border: "1px solid #E8DDD0", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0E8DC" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7A6A58", letterSpacing: "0.08em" }}>
              ABOUT
            </div>
          </div>
          {[
            { icon: Info, label: "About Burger Nomr" },
            { icon: Shield, label: "Privacy Policy" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #F0E8DC",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={16} color="#7A6A58" />
                <span style={{ fontSize: "0.9rem", color: "#1A1208" }}>{label}</span>
              </div>
              <ChevronRight size={16} color="#D4C8BC" />
            </div>
          ))}
          <div style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--app-font-display)", fontSize: "1rem", color: "#E8420A", letterSpacing: "0.05em" }}>
              BURGER NOMR
            </div>
            <div style={{ fontSize: "0.75rem", color: "#7A6A58", marginTop: 4 }}>
              Cape Town's halaal burger guide • v1.0
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          style={{
            width: "100%",
            padding: "14px",
            background: loggingOut ? "#F0E8DC" : "#FFF9F2",
            color: loggingOut ? "#D4C8BC" : "#DC2626",
            border: "1.5px solid",
            borderColor: loggingOut ? "#E8DDD0" : "#FCA5A5",
            borderRadius: 12,
            fontFamily: "var(--app-font-display)",
            fontSize: "1rem",
            letterSpacing: "0.05em",
            cursor: loggingOut ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.15s",
          }}
        >
          <LogOut size={16} />
          {loggingOut ? "SIGNING OUT..." : "SIGN OUT"}
        </button>
      </div>
    </div>
  );
}
