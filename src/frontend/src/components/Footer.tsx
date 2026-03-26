import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "hirenest";

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                HireNest <span className="text-teal">OS</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              India's #1 two-sided IT talent deployment platform. AI-powered
              matching meets human expertise.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/requirements"
                  className="hover:text-foreground transition-colors"
                >
                  Requirements Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to="/talent"
                  className="hover:text-foreground transition-colors"
                >
                  Talent Bench
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-foreground transition-colors"
                >
                  AI Matching
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Dashboards
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/dashboard/company"
                  className="hover:text-foreground transition-colors"
                >
                  Company Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/vendor"
                  className="hover:text-foreground transition-colors"
                >
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/recruiter"
                  className="hover:text-foreground transition-colors"
                >
                  Recruiter View
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@hirenest.in"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} HireNest Workforce. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-teal hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
