import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Building2, ChevronRight, Users, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Role = "company" | "vendor";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("company");
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
  });
  const [vendorData, setVendorData] = useState({
    name: "",
    specializations: "",
    benchCount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    navigate({
      to: role === "company" ? "/dashboard/company" : "/dashboard/vendor",
    });
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-background" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome to HireNest <span className="text-teal">OS</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Let&apos;s set up your account — Step {step} of 3
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-teal" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="card-surface rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold text-foreground">
                  I am joining as a...
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("company")}
                    className={`p-5 rounded-xl border-2 text-left transition-colors ${
                      role === "company"
                        ? "border-teal bg-teal/10"
                        : "border-border bg-muted/10"
                    }`}
                    data-ocid="onboarding.radio"
                  >
                    <Building2
                      className={`h-8 w-8 mb-2 ${role === "company" ? "text-teal" : "text-muted-foreground"}`}
                    />
                    <p className="font-semibold text-foreground">Company</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Post requirements, hire IT talent
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    className={`p-5 rounded-xl border-2 text-left transition-colors ${
                      role === "vendor"
                        ? "border-teal bg-teal/10"
                        : "border-border bg-muted/10"
                    }`}
                    data-ocid="onboarding.radio"
                  >
                    <Users
                      className={`h-8 w-8 mb-2 ${role === "vendor" ? "text-teal" : "text-muted-foreground"}`}
                    />
                    <p className="font-semibold text-foreground">Vendor</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submit bench candidates, earn placements
                    </p>
                  </button>
                </div>
                <Button
                  className="w-full bg-teal text-background hover:bg-teal-600 font-semibold h-11"
                  onClick={() => setStep(2)}
                  data-ocid="onboarding.primary_button"
                >
                  Continue <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && role === "company" && (
              <motion.div
                key="step2c"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold text-foreground">
                  Company Details
                </h2>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Company Name
                  </Label>
                  <Input
                    value={companyData.name}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, name: e.target.value })
                    }
                    placeholder="Infosys Digital"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Industry
                  </Label>
                  <Input
                    value={companyData.industry}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        industry: e.target.value,
                      })
                    }
                    placeholder="IT Services / Fintech / E-commerce"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Location
                  </Label>
                  <Input
                    value={companyData.location}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Bangalore, India"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Team Size
                  </Label>
                  <Input
                    value={companyData.size}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, size: e.target.value })
                    }
                    placeholder="100–500"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border"
                    onClick={() => setStep(1)}
                    data-ocid="onboarding.secondary_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-teal text-background hover:bg-teal-600 font-semibold"
                    onClick={() => setStep(3)}
                    data-ocid="onboarding.primary_button"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && role === "vendor" && (
              <motion.div
                key="step2v"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold text-foreground">
                  Vendor Details
                </h2>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Vendor / Firm Name
                  </Label>
                  <Input
                    value={vendorData.name}
                    onChange={(e) =>
                      setVendorData({ ...vendorData, name: e.target.value })
                    }
                    placeholder="TechBridge Staffing"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Specializations
                  </Label>
                  <Input
                    value={vendorData.specializations}
                    onChange={(e) =>
                      setVendorData({
                        ...vendorData,
                        specializations: e.target.value,
                      })
                    }
                    placeholder="React, Node.js, DevOps, Java"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Number of Bench Candidates
                  </Label>
                  <Input
                    value={vendorData.benchCount}
                    onChange={(e) =>
                      setVendorData({
                        ...vendorData,
                        benchCount: e.target.value,
                      })
                    }
                    placeholder="25"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="onboarding.input"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border"
                    onClick={() => setStep(1)}
                    data-ocid="onboarding.secondary_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-teal text-background hover:bg-teal-600 font-semibold"
                    onClick={() => setStep(3)}
                    data-ocid="onboarding.primary_button"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-5"
              >
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-teal" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  You&apos;re all set!
                </h2>
                <p className="text-muted-foreground text-sm">
                  Your {role} account has been configured. Head to your
                  dashboard to get started.
                </p>
                <Button
                  className="w-full bg-teal text-background hover:bg-teal-600 font-semibold h-11"
                  onClick={handleComplete}
                  disabled={loading}
                  data-ocid="onboarding.submit_button"
                >
                  {loading ? "Setting up..." : "Go to Dashboard"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
