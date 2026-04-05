import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
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

const ROUTES_WITHOUT_NAV = ["/rate", "/auth"];

function AppContent() {
  const [location] = useLocation();
  const hideNav = ROUTES_WITHOUT_NAV.some((r) => location.startsWith(r));

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
        <Route path="/auth" component={AuthPage} />
        <Route>
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--app-font-display)", fontSize: "2rem", color: "#1A1208" }}>PAGE NOT FOUND</h2>
          </div>
        </Route>
      </Switch>
      {!hideNav && <BottomNav />}
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
