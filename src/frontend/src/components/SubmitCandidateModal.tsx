import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { type Candidate, type Requirement, getCandidates } from "@/lib/db";
import {
  type PlanStatus,
  getPlanStatusAsync,
  recordSubmission,
} from "@/lib/planEnforcement";
import { createSubmissionDB } from "@/lib/submissionsDb";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  requirement: Requirement | null;
  open: boolean;
  onClose: () => void;
}

export function SubmitCandidateModal({ requirement, open, onClose }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([getCandidates(), getPlanStatusAsync("vendor-1")]).then(
      ([cands, plan]) => {
        setCandidates(cands.filter((c) => c.vendor_id === "vendor-1"));
        setPlanStatus(plan);
      },
    );
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedId) {
      toast.error("Please select a candidate");
      return;
    }
    if (!requirement) return;
    if (planStatus && !planStatus.canSubmit) {
      toast.error(
        "Monthly submission limit reached. Please upgrade your plan.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await createSubmissionDB({
        requirement_id: requirement.id,
        candidate_id: selectedId,
        vendor_id: "vendor-1",
        notes: note,
      });
      recordSubmission("vendor-1");
      toast.success(
        "Candidate submitted to pipeline! Client will be notified.",
      );
      setSelectedId(null);
      setNote("");
      onClose();
    } catch {
      toast.error("Failed to submit candidate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!requirement) return null;

  const limitReached = planStatus ? !planStatus.canSubmit : false;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-border"
        data-ocid="requirements.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Submit Candidate
          </DialogTitle>
          <div className="mt-1">
            <p className="text-sm font-medium text-foreground">
              {requirement.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {requirement.company}
            </p>
          </div>
        </DialogHeader>

        {limitReached && (
          <div
            className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
            data-ocid="requirements.error_state"
          >
            Monthly limit reached ({planStatus?.submissionsUsed}/
            {planStatus?.submissionsLimit}). Upgrade to Pro for unlimited
            submissions.
          </div>
        )}

        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Select Candidate
            </p>
            <div className="space-y-2" data-ocid="requirements.list">
              {candidates.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground py-4 text-center"
                  data-ocid="requirements.empty_state"
                >
                  No bench candidates found. Add candidates to your bench first.
                </p>
              ) : (
                candidates.map((c, i) => (
                  <label
                    key={c.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedId === c.id
                        ? "border-teal bg-teal/5"
                        : "border-border hover:border-teal/40"
                    }`}
                    data-ocid={`requirements.item.${i + 1}`}
                  >
                    <input
                      type="radio"
                      name="candidate"
                      value={c.id}
                      checked={selectedId === c.id}
                      onChange={() => setSelectedId(c.id)}
                      className="accent-teal"
                      data-ocid={`requirements.radio.${i + 1}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.role} &middot; {c.experience} yrs exp
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">
              Note to client (optional)
            </p>
            <Textarea
              placeholder="Add a message to the client..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="bg-background border-input resize-none"
              data-ocid="requirements.textarea"
            />
          </div>

          {planStatus && (
            <p className="text-xs text-muted-foreground">
              {planStatus.submissionsUsed}/
              {planStatus.submissionsLimit ?? "\u221e"} submissions used this
              month
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-teal text-white hover:opacity-90"
              onClick={handleSubmit}
              disabled={limitReached || submitting}
              data-ocid="requirements.submit_button"
            >
              {submitting ? "Submitting..." : "Submit Candidate"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
              data-ocid="requirements.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
