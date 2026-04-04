import { Link, useLocation } from "wouter";
import { Home, Search, Map, Trophy, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/top10", icon: Trophy, label: "Top 10" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "#FFF9F2",
        borderTop: "1px solid #E8DDD0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        height: 72,
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 100,
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Link key={href} href={href}>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 12,
                color: isActive ? "#E8420A" : "#7A6A58",
                transition: "color 0.15s",
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--app-font-sans)",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
