import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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

interface SalesFormData {
  name: string;
  company: string;
  email: string;
  teamSize: string;
  message: string;
}

function ContactSalesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SalesFormData>({
    name: "",
    company: "",
    email: "",
    teamSize: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate request
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: "", company: "", email: "", teamSize: "", message: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="pricing.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Talk to Enterprise Sales
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center" data-ocid="pricing.success_state">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              Request Sent!
            </h3>
            <p className="text-muted-foreground text-sm">
              Thanks! We&apos;ll reach out within 24 hours.
            </p>
            <Button
              className="mt-6 bg-teal text-white hover:opacity-90 font-semibold w-full"
              onClick={handleClose}
              data-ocid="pricing.close_button"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tell us about your needs and we&apos;ll get back to you within 24
              hours.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Sharma"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="pricing.input"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Company</Label>
                <Input
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="Infosys"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="pricing.input"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Work Email
              </Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="priya@company.com"
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="pricing.input"
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Team Size</Label>
              <Select
                value={form.teamSize}
                onValueChange={(v) => setForm({ ...form, teamSize: v })}
              >
                <SelectTrigger
                  className="mt-1 bg-muted/20 border-border"
                  data-ocid="pricing.select"
                >
                  <SelectValue placeholder="Select team size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1–10 people</SelectItem>
                  <SelectItem value="11-50">11–50 people</SelectItem>
                  <SelectItem value="51-200">51–200 people</SelectItem>
                  <SelectItem value="200+">200+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What's your current hiring challenge?"
                className="mt-1 bg-muted/20 border-border text-foreground min-h-[80px] resize-none"
                data-ocid="pricing.textarea"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                data-ocid="pricing.cancel_button"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="flex-1 bg-teal text-white hover:opacity-90 font-semibold"
                disabled={loading}
                data-ocid="pricing.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Request Demo"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function PricingPage() {
  const { actor, isFetching } = useActor();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [salesModalOpen, setSalesModalOpen] = useState(false);

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
          Start free, scale when you&apos;re ready. No hidden fees — pay only
          when you place talent.
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
                    onClick={() => setSalesModalOpen(true)}
                    data-ocid="pricing.open_modal_button"
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
                  className={`border-border ${i % 2 === 0 ? "bg-transparent" : "bg-muted/20"}`}
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

      {/* Contact Sales Modal */}
      <ContactSalesModal
        open={salesModalOpen}
        onClose={() => setSalesModalOpen(false)}
      />
    </div>
  );
}
