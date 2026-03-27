import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { navigationByRole } from "@/lib/navigation";
import { clearRole, getCurrentRole } from "@/lib/roleStore";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  Menu,
  MessageSquare,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ✅ MODIFIED: Added "AI Match" to public navigation
const PUBLIC_NAV_LINKS = [
  { label: "AI Match", to: "/ai-match" },        // ← ADDED THIS LINE
  { label: "Talent Bench", to: "/talent" },
  { label: "Requirements", to: "/requirements" },
  { label: "Deal Room", to: "/deal-room" },
  { label: "Pricing", to: "/pricing" },
];

const ICON_MAP: Record<string, React.ElementType> = {
  "/deal-room": MessageSquare,
  "/ai-match": Sparkles,                          // ← ADDED THIS LINE (icon for AI Match)
  "/admin/verification": ShieldCheck,
  "/admin/revenue": TrendingUp,
  "/requirements": Briefcase,
};

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [role, setRole] = useState(() => getCurrentRole());

  // Sync role on location change and storage events
  useEffect(() => {
    setRole(getCurrentRole());
  }); // eslint-disable-line

  useEffect(() => {
    const handleStorage = () => setRole(getCurrentRole());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearRole();
    setRole(null);
    navigate({ to: "/login" });
  };

  type NavLink = { label: string; to: string; icon?: React.ElementType };
  const navLinks: NavLink[] = role
    ? (navigationByRole[role] ?? [])
    : PUBLIC_NAV_LINKS;

  const ROLE_BADGE_LABELS: Record<string, string> = {
    admin: "Admin",
    client: "Client",
    vendor: "Vendor",
    recruiter: "Recruiter",
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm"
      data-ocid="nav.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              HireNest <span className="text-teal">OS</span>
            </span>
            {role && (
              <span className="text-xs uppercase bg-teal/10 text-teal border border-teal/20 px-2 py-0.5 rounded-full font-semibold">
                {ROLE_BADGE_LABELS[role] ?? role}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const IconComp =
                "icon" in link && link.icon ? link.icon : ICON_MAP[link.to];
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-colors flex items-center gap-1 ${
                    currentPath === link.to
                      ? "text-teal font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid="nav.link"
                >
                  {IconComp && <IconComp className="h-3.5 w-3.5" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
              data-ocid="nav.toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            {role ? (
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:text-red-500 hover:border-red-300 bg-card"
                onClick={handleLogout}
                data-ocid="nav.secondary_button"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:text-foreground bg-card"
                    data-ocid="nav.secondary_button"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-teal text-white hover:opacity-90 font-semibold"
                    data-ocid="nav.primary_button"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          {navLinks.map((link) => {
            const IconComp =
              "icon" in link && link.icon ? link.icon : ICON_MAP[link.to];
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {IconComp && <IconComp className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
              data-ocid="nav.toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            {role ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border text-red-500 hover:bg-red-50"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                data-ocid="nav.secondary_button"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border"
                    data-ocid="nav.secondary_button"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-teal text-white"
                    data-ocid="nav.primary_button"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
