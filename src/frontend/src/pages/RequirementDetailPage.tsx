import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  type PlacementTransaction,
  type Requirement,
  getPlacementsByRequirement,
  getRequirements,
  updatePlacementStatus,
} from "@/lib/db";
import { calculateMatchScore, inferSeniority } from "@/lib/matching";
import { getTrainingRecommendation } from "@/lib/training";
import { Link, useParams } from "@tanstack/react-router";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CircularScoreBadge } from "../components/CircularScoreBadge";

type PipelineStage =
  | "submitted"
  | "shortlisted"
  | "interview"
  | "offer_extended"
  | "joined";

const COLUMNS: {
  key: PipelineStage;
  label: string;
  action?: string;
  nextStage?: PipelineStage;
  variant?: "primary" | "green";
}[] = [
  {
    key: "submitted",
    label: "Submitted",
    action: "Shortlist",
    nextStage: "shortlisted",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    action: "Schedule Interview",
    nextStage: "interview",
  },
  {
    key: "interview",
    label: "Interview",
    action: "Extend Offer",
    nextStage: "offer_extended",
  },
  {
    key: "offer_extended",
    label: "Offer Extended",
    action: "Mark Joined",
    nextStage: "joined",
    variant: "green",
  },
  { key: "joined", label: "Joined ✓" },
];

interface JoinModalState {
  open: boolean;
  placementId: string | null;
}

export function RequirementDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const reqId = params.id || "";

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [placements, setPlacements] = useState<PlacementTransaction[]>([]);
  const [joinModal, setJoinModal] = useState<JoinModalState>({
    open: false,
    placementId: null,
  });
  const [budget, setBudget] = useState("200000");
  const [commission, setCommission] = useState<{
    yours: number;
    vendor: number;
  } | null>(null);

  useEffect(() => {
    getRequirements().then((reqs) =>
      setRequirement(reqs.find((r) => r.id === reqId) || null),
    );
    loadPlacements();
  }, [reqId]);

  const loadPlacements = () =>
    getPlacementsByRequirement(reqId).then(setPlacements);

  const handleAction = async (
    placement: PlacementTransaction,
    nextStage: PipelineStage,
  ) => {
    if (nextStage === "joined") {
      setJoinModal({ open: true, placementId: placement.id });
      return;
    }
    await updatePlacementStatus(placement.id, nextStage);
    toast.success(`Candidate moved to ${nextStage.replace("_", " ")}`);
    loadPlacements();
  };

  const handleMarkJoined = async () => {
    if (!joinModal.placementId) return;
    const total = Number(budget);
    const yourCommission = Math.round(total * 0.15);
    const vendorPayout = total - yourCommission;
    setCommission({ yours: yourCommission, vendor: vendorPayout });
  };

  const handleConfirmJoined = async () => {
    if (!joinModal.placementId) return;
    const total = Number(budget);
    const yourCommission = Math.round(total * 0.15);
    const vendorPayout = total - yourCommission;
    await updatePlacementStatus(joinModal.placementId, "joined", {
      total_budget: total,
      your_commission: yourCommission,
      vendor_payout: vendorPayout,
      client_payment_status: "pending",
      vendor_payout_status: "pending",
      joined_date: new Date().toISOString(),
    });
    toast.success("Candidate marked as Joined! Commission calculated.");
    setJoinModal({ open: false, placementId: null });
    setCommission(null);
    loadPlacements();
  };

  const getColumn = (stage: PipelineStage) =>
    placements.filter((p) => p.status === stage);

  const getMatchScore = (p: PlacementTransaction) => {
    if (!requirement || !p.candidate) return undefined;
    const seniority = inferSeniority(
      requirement.title,
      requirement.experience_min,
    );
    return calculateMatchScore(
      requirement.skills,
      p.candidate.skills || [],
      requirement.experience_min,
      p.candidate.experience || 0,
      seniority,
      p.candidate.role || "",
    ).score;
  };

  const getMissingSkills = (p: PlacementTransaction): string[] => {
    if (!requirement || !p.candidate) return [];
    const candSkills = new Set(
      (p.candidate.skills || []).map((s: string) => s.toLowerCase()),
    );
    return requirement.skills.filter((s) => !candSkills.has(s.toLowerCase()));
  };

  if (!requirement) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-muted-foreground">Loading requirement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link
            to="/requirements"
            className="text-sm text-teal hover:underline"
          >
            ← Back to Requirements
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {requirement.title}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    requirement.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {requirement.status}
                </span>
              </div>
              <p className="text-muted-foreground font-medium">
                {requirement.company}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {requirement.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {requirement.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {requirement.experience_min}–{requirement.experience_max}+ yrs
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />₹
                  {(requirement.budget_min / 1000).toFixed(0)}K – ₹
                  {(requirement.budget_max / 1000).toFixed(0)}K/mo
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-medium text-foreground">
                {new Date(requirement.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {requirement.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20"
              >
                {s}
              </span>
            ))}
          </div>

          {requirement.description && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Description
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {requirement.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Kanban Pipeline */}
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Candidate Pipeline
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {COLUMNS.map((col) => {
            const cards = getColumn(col.key);
            return (
              <div
                key={col.key}
                className="card-surface rounded-xl p-3 min-h-64"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-foreground">
                    {col.label}
                  </h3>
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                    {cards.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {cards.map((p, i) => {
                    const ms = getMatchScore(p);
                    return (
                      <div
                        key={p.id}
                        className="bg-background rounded-lg p-3 shadow-sm border border-border"
                        data-ocid={`requirements.item.${i + 1}`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs flex-shrink-0">
                            {p.candidate?.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {p.candidate?.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {p.candidate?.role}
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                              From: {p.vendor?.company}
                            </p>
                          </div>
                          {ms !== undefined && (
                            <CircularScoreBadge score={ms} size={36} />
                          )}
                        </div>
                        {col.key === "submitted" &&
                          (() => {
                            const ms2 = getMatchScore(p);
                            const missing = getMissingSkills(p);
                            if (
                              ms2 !== undefined &&
                              ms2 >= 80 &&
                              ms2 <= 99 &&
                              missing.length > 0
                            ) {
                              return (
                                <div className="mt-2 flex flex-col gap-1.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 w-fit">
                                    ⚠ Skill Gap
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {missing.slice(0, 2).map((skill) => {
                                      const rec =
                                        getTrainingRecommendation(skill);
                                      return (
                                        <div
                                          key={skill}
                                          className="flex flex-col gap-0.5"
                                        >
                                          <span className="text-xs text-orange-600 font-medium">
                                            {skill}
                                          </span>
                                          {rec && (
                                            <span className="text-xs text-muted-foreground">
                                              → {rec.course.slice(0, 30)}...
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-1 h-6 text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
                                    onClick={() =>
                                      toast.success(
                                        "CV update requested. Vendor will be notified of missing skills.",
                                      )
                                    }
                                    data-ocid={`requirements.secondary_button.${i + 1}`}
                                  >
                                    Request CV Update
                                  </Button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        {col.key === "joined" && p.your_commission && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Budget: ₹{p.total_budget?.toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs font-semibold text-green-600">
                              Commission: ₹
                              {p.your_commission?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                        {col.action && col.nextStage && (
                          <Button
                            size="sm"
                            className={`w-full mt-2 h-7 text-xs ${
                              col.variant === "green"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-teal text-white hover:opacity-90"
                            }`}
                            onClick={() => handleAction(p, col.nextStage!)}
                            data-ocid={`requirements.action_button.${i + 1}`}
                          >
                            {col.action}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {cards.length === 0 && (
                    <div
                      className="text-center py-8 text-muted-foreground text-xs"
                      data-ocid="requirements.empty_state"
                    >
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mark Joined Modal */}
      <Dialog
        open={joinModal.open}
        onOpenChange={(o) => {
          if (!o) {
            setJoinModal({ open: false, placementId: null });
            setCommission(null);
          }
        }}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Mark as Joined
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="budget-input"
                className="text-sm text-muted-foreground"
              >
                Final Budget (₹)
              </label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setCommission(null);
                }}
                className="mt-1 bg-muted/20 border-border text-foreground"
                id="budget-input"
                data-ocid="requirements.budget_input"
              />
            </div>
            <Button
              className="w-full bg-teal text-white"
              onClick={handleMarkJoined}
              data-ocid="requirements.calculate_button"
            >
              Calculate Commission
            </Button>
            {commission && (
              <div className="rounded-lg bg-muted/40 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client Pays</span>
                  <span className="font-bold text-foreground">
                    ₹{Number(budget).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Your Commission (15%)</span>
                  <span className="font-bold text-green-700">
                    ₹{commission.yours.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendor Gets</span>
                  <span className="font-bold text-foreground">
                    ₹{commission.vendor.toLocaleString("en-IN")}
                  </span>
                </div>
                <Button
                  className="w-full mt-2 bg-green-600 text-white hover:bg-green-700"
                  onClick={handleConfirmJoined}
                  data-ocid="requirements.confirm_button"
                >
                  Confirm — Mark Joined
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
