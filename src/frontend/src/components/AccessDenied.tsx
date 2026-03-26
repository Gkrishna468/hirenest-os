import { Button } from "@/components/ui/button";
import { getCurrentRole } from "@/lib/roleStore";
import { useNavigate } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { motion } from "motion/react";

function getDashboardRoute(role: string | null): string {
  switch (role) {
    case "client":
      return "/client/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "recruiter":
      return "/dashboard/recruiter";
    default:
      return "/";
  }
}

export function AccessDenied() {
  const navigate = useNavigate();
  const role = getCurrentRole();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm px-6"
      >
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldOff className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Access Denied
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          You don't have permission to view this page.
        </p>
        <Button
          className="bg-teal text-white hover:opacity-90 font-semibold"
          onClick={() => navigate({ to: getDashboardRoute(role) })}
          data-ocid="access_denied.primary_button"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
