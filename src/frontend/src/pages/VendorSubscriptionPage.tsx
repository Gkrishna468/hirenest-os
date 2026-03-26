import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "motion/react";

export function VendorSubscriptionSuccess() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      data-ocid="subscription.success_state"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card border-border text-center">
          <CardContent className="p-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-display mb-2">
              Subscription Activated!
            </h1>
            <p className="text-muted-foreground mb-2">
              Welcome to{" "}
              <span className="font-semibold text-teal">Vendor Pro</span>. Your
              account has been upgraded.
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left space-y-1.5 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold text-foreground">
                  Vendor Pro
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-semibold text-foreground">
                  ₹2,999 / month
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
            <div className="space-y-2">
              <Link to="/dashboard/vendor">
                <Button
                  className="w-full bg-teal text-white hover:opacity-90"
                  data-ocid="subscription.primary_button"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Go to Vendor Dashboard
                </Button>
              </Link>
              <Link to="/talent">
                <Button
                  variant="outline"
                  className="w-full border-border"
                  data-ocid="subscription.secondary_button"
                >
                  Browse Talent Bench
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function VendorSubscriptionCancel() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      data-ocid="subscription.panel"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card border-border text-center">
          <CardContent className="p-10">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-display mb-2">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground mb-6">
              No charge was made. You can upgrade to Vendor Pro any time.
            </p>
            <div className="space-y-2">
              <Link to="/pricing">
                <Button
                  className="w-full bg-teal text-white hover:opacity-90"
                  data-ocid="subscription.primary_button"
                >
                  Back to Pricing
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="ghost"
                  className="w-full"
                  data-ocid="subscription.secondary_button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
