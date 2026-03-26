import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { Check, Loader2, Minus, Sparkles, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    priceNote: "Forever free",
    description:
      "Perfect for vendors exploring the platform and getting started.",
    cta: "Get Started Free",
    featured: false,
    features: [
      "Browse open requirements",
      "Submit up to 3 candidates/month",
      "Basic AI match scoring",
      "Standard support",
      "Access to talent bench",
    ],
  },
  {
    name: "Vendor Pro",
    price: "₹2,999",
    priceNote: "per month",
    description:
      "For active vendors who want to grow faster with premium tools.",
    cta: "Upgrade to Pro",
    featured: true,
    features: [
      "Unlimited candidate submissions",
      "Priority AI matching algorithm",
      "Verified Vendor badge",
      "Featured listings (top of search)",
      "Dedicated account manager",
      "Advanced analytics dashboard",
      "GST invoicing support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "contact us",
    description:
      "Full-scale deployment for large staffing firms and enterprise clients.",
    cta: "Contact Sales",
    featured: false,
    features: [
      "Everything in Vendor Pro",
      "White-label platform option",
      "Custom SLAs",
      "API access & webhooks",
      "Dedicated recruiter team",
      "Custom AI model training",
      "Priority dispute resolution",
    ],
  },
];

const COMPARISON_FEATURES = [
  {
    label: "Candidate submissions",
    starter: "3/month",
    pro: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    label: "AI match scoring",
    starter: "Basic",
    pro: "Priority",
    enterprise: "Custom model",
  },
  { label: "Verified badge", starter: false, pro: true, enterprise: true },
  { label: "Featured listings", starter: false, pro: true, enterprise: true },
  { label: "Account manager", starter: false, pro: true, enterprise: true },
  { label: "Analytics dashboard", starter: false, pro: true, enterprise: true },
  { label: "API access", starter: false, pro: false, enterprise: true },
  { label: "White-label option", starter: false, pro: false, enterprise: true },
  { label: "Custom SLAs", starter: false, pro: false, enterprise: true },
  { label: "GST invoicing", starter: false, pro: true, enterprise: true },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>;
  }
  return value ? (
    <Check className="h-4 w-4 text-teal mx-auto" />
  ) : (
    <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );
}

export function PricingPage() {
  const { actor, isFetching } = useActor();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleProUpgrade = async () => {
    if (!actor || isFetching) {
      toast.error("Stripe not configured. Contact admin to enable payments.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const successUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;
      const result = await (actor as any).createCheckoutSession(
        [{ name: "Vendor Pro", quantity: 1, price: 299900 }],
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result as string);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch {
      toast.error("Stripe not configured. Contact admin to enable payments.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleContactSales = () => {
    toast("Our team will reach out to discuss enterprise options.", {
      description: "Email us at sales@hirenestworkforce.com",
    });
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      data-ocid="pricing.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-3 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Transparent Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-display mb-4">
          Plans that grow with you
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Start free, scale when you're ready. No hidden fees — pay only when
          you place talent.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            data-ocid={`pricing.card.${i + 1}`}
          >
            <Card
              className={`relative h-full flex flex-col ${
                tier.featured
                  ? "border-teal ring-2 ring-teal/20 shadow-lg"
                  : "border-border"
              } bg-card`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-teal text-white text-xs px-3 py-0.5">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4 pt-7">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-foreground font-display">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-sm text-muted-foreground">
                      {tier.priceNote}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                {tier.name === "Vendor Pro" ? (
                  <Button
                    className="w-full bg-teal text-white hover:opacity-90 font-semibold"
                    onClick={handleProUpgrade}
                    disabled={checkoutLoading}
                    data-ocid="pricing.primary_button"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      tier.cta
                    )}
                  </Button>
                ) : tier.name === "Enterprise" ? (
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    onClick={handleContactSales}
                    data-ocid="pricing.secondary_button"
                  >
                    {tier.cta}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    onClick={() => {
                      window.location.href = "/onboarding";
                    }}
                    data-ocid="pricing.secondary_button"
                  >
                    {tier.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        data-ocid="pricing.table"
      >
        <h2 className="text-2xl font-bold text-foreground font-display text-center mb-8">
          Full Feature Comparison
        </h2>
        <Card className="bg-card border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="w-1/2 font-semibold">Feature</TableHead>
                <TableHead className="text-center font-semibold">
                  Starter
                </TableHead>
                <TableHead className="text-center font-semibold text-teal">
                  Vendor Pro
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Enterprise
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISON_FEATURES.map((row, i) => (
                <TableRow
                  key={row.label}
                  className={`border-border ${
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                  }`}
                  data-ocid={`pricing.row.${i + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {row.label}
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={row.starter} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={row.pro} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureCell value={row.enterprise} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Commission note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-block bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl px-6 py-4 max-w-xl">
          <p className="text-sm text-sky-800 dark:text-sky-300 font-medium">
            💡 All plans include our success-based commission model
          </p>
          <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
            10–20% platform commission on successful placements. Only pay when
            you earn.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
