import {
  Briefcase,
  Building2,
  CreditCard,
  GitBranch,
  History,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const navigationByRole = {
  admin: [
    { label: "Talent Bench", to: "/talent", icon: Users },
    { label: "Requirements", to: "/requirements", icon: Briefcase },
    { label: "AI Match", to: "/ai-match", icon: Sparkles },
    { label: "Deal Room", to: "/deal-room", icon: MessageSquare },
    { label: "Vendors", to: "/vendors", icon: Building2 },
    { label: "Match History", to: "/match-history", icon: History },
    { label: "Verify", to: "/admin/verification", icon: ShieldCheck },
    { label: "Revenue", to: "/admin/revenue", icon: TrendingUp },
  ],
  client: [
    { label: "My Dashboard", to: "/client/dashboard", icon: LayoutDashboard },
    { label: "Requirements", to: "/requirements", icon: Briefcase },
    { label: "Talent Bench", to: "/talent", icon: Users },
    { label: "Deal Room", to: "/deal-room", icon: MessageSquare },
    { label: "Spending", to: "/client/spending", icon: CreditCard },
  ],
  vendor: [
    { label: "My Bench", to: "/vendor/dashboard", icon: Users },
    { label: "Requirements", to: "/requirements", icon: Briefcase },
    { label: "Deal Room", to: "/deal-room", icon: MessageSquare },
    { label: "My Earnings", to: "/vendor/earnings", icon: TrendingUp },
  ],
  recruiter: [
    { label: "Requirements", to: "/requirements", icon: Briefcase },
    { label: "Deal Room", to: "/deal-room", icon: MessageSquare },
    { label: "Pipeline", to: "/dashboard/recruiter", icon: GitBranch },
    { label: "Match History", to: "/match-history", icon: History },
  ],
};
