import { CheckCircle2, ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  type?: "candidate" | "vendor";
}

export function VerifiedBadge({ type = "candidate" }: VerifiedBadgeProps) {
  if (type === "vendor") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange/10 text-orange border border-orange/30">
        <ShieldCheck className="h-3 w-3" />
        Verified Vendor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/30">
      <CheckCircle2 className="h-3 w-3" />
      Verified
    </span>
  );
}
