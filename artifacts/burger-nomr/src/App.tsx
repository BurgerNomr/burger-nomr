import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import MapPage from "@/pages/MapPage";
import Top10Page from "@/pages/Top10Page";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import RatePage from "@/pages/RatePage";
import SubmitPage from "@/pages/SubmitPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const ROUTES_WITHOUT_NAV = ["/rate", "/settings"];

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF6EE",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#E8420A",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="14" width="22" height="11" rx="3" fill="white" opacity="0.9"/>
              <rect x="3" y="11" width="26" height="4" rx="2" fill="white" opacity="0.7"/>
              <ellipse cx="16" cy="11" rx="10" ry="5" fill="white" opacity="0.85"/>
            </svg>
          </div>
          <p style={{ fontFamily: "var(--app-font-display)", fontSize: "1.2rem", color: "#E8420A", letterSpacing: "0.06em" }}>
            BURGER NOMR
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="app-container">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/explore" component={ExplorePage} />
        <Route path="/map" component={MapPage} />
        <Route path="/top10" component={Top10Page} />
        <Route path="/restaurant/:id" component={RestaurantDetailPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/rate/:restaurantId" component={RatePage} />
        <Route path="/submit" component={SubmitPage} />
        <Route>
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#1A1208" }}>PAGE NOT FOUND</h2>
          </div>
        </Route>
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
