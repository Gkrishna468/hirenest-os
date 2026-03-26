import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Requirement } from "@/lib/db";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  requirement: Requirement | null;
  open: boolean;
  onClose: () => void;
  onSubmitCandidate: (req: Requirement) => void;
}

const STAGES = ["submitted", "shortlisted", "interview", "offer", "joined"];

const STAGE_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  interview: "bg-purple-100 text-purple-700 border-purple-200",
  offer: "bg-orange-100 text-orange-700 border-orange-200",
  joined: "bg-green-100 text-green-700 border-green-200",
};

const INITIAL_PIPELINE = [
  {
    id: "pc1",
    name: "Arjun Sharma",
    stage: "submitted",
    vendor: "TechVault Solutions",
  },
  {
    id: "pc2",
    name: "Priya Nair",
    stage: "shortlisted",
    vendor: "CloudForce India",
  },
  {
    id: "pc3",
    name: "Rahul Verma",
    stage: "interview",
    vendor: "DataMinds Pvt",
  },
];

export function RequirementDetailModal({
  requirement,
  open,
  onClose,
  onSubmitCandidate,
}: Props) {
  const [pipeline, setPipeline] = useState(INITIAL_PIPELINE);

  if (!requirement) return null;

  const advanceStage = (id: string) => {
    setPipeline((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = STAGES.indexOf(c.stage);
        const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : c.stage;
        toast.success(`${c.name} advanced to ${next}`);
        return { ...c, stage: next };
      }),
    );
  };

  const rejectCandidate = (id: string) => {
    const name = pipeline.find((c) => c.id === id)?.name;
    setPipeline((prev) => prev.filter((c) => c.id !== id));
    toast.error(`${name} removed from pipeline`);
  };

  const fmtBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Negotiable";
    if (min && max)
      return `₹${min.toLocaleString("en-IN")}/mo – ₹${max.toLocaleString("en-IN")}/mo`;
    if (min) return `₹${min.toLocaleString("en-IN")}/mo+`;
    return `Up to ₹${max?.toLocaleString("en-IN")}/mo`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto"
        data-ocid="requirements.dialog"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-foreground mb-1">
                {requirement.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {requirement.company}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                className={`text-xs border ${
                  requirement.status === "active"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {requirement.status}
              </Badge>
              <Button
                size="sm"
                className="bg-teal text-white hover:opacity-90 h-8 text-xs"
                onClick={() => onSubmitCandidate(requirement)}
                data-ocid="requirements.submit_button"
              >
                Submit Candidate
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Details row */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {requirement.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {requirement.location}
              </span>
            )}
            {(requirement.experience_min !== undefined ||
              requirement.experience_max !== undefined) && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {requirement.experience_min ?? 0}–
                {requirement.experience_max ?? "10"}+ yrs
              </span>
            )}
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {fmtBudget(requirement.budget_min, requirement.budget_max)}
            </span>
          </div>

          {/* Skills */}
          {requirement.skills && requirement.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {requirement.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accent text-accent-foreground border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Full description */}
          {requirement.description && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Job Description
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {requirement.description}
              </p>
            </div>
          )}

          {/* Candidate Pipeline */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Candidate Pipeline
            </h3>
            {pipeline.length === 0 ? (
              <div
                className="text-center py-6 text-muted-foreground text-sm"
                data-ocid="requirements.empty_state"
              >
                No candidates in pipeline yet.
              </div>
            ) : (
              <div className="space-y-2" data-ocid="requirements.list">
                {pipeline.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    data-ocid={`requirements.item.${i + 1}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.vendor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STAGE_COLORS[c.stage] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {c.stage}
                      </span>
                      {c.stage !== "joined" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs border-teal/40 text-teal hover:bg-teal/10"
                          onClick={() => advanceStage(c.id)}
                          data-ocid={`requirements.secondary_button.${i + 1}`}
                        >
                          Advance
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => rejectCandidate(c.id)}
                        data-ocid={`requirements.delete_button.${i + 1}`}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
