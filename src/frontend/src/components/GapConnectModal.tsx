import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTrainingRecommendation } from "@/lib/training";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface GapConnectModalProps {
  open: boolean;
  onClose: () => void;
  candidateName: string;
  missingSkills: string[];
  matchScore: number;
  viewAs: "client" | "vendor";
}

export function GapConnectModal({
  open,
  onClose,
  candidateName,
  missingSkills,
  matchScore,
  viewAs,
}: GapConnectModalProps) {
  const isClient = viewAs === "client";

  const handleCTA = () => {
    if (isClient) {
      toast.success(
        "Request sent to vendor. They'll update the candidate profile.",
      );
    } else {
      toast.success("Anonymous match request sent. The client will review.");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="gap_connect.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-foreground">
            {isClient
              ? "Candidate Match with Skill Gap"
              : "Your Candidate Partially Matches a Requirement"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Score badge */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-sm flex-shrink-0">
              {matchScore}%
            </div>
            <p className="text-sm text-foreground">
              {isClient
                ? `A vendor has submitted a candidate who matches ${matchScore}% of your requirement. The following skills are missing:`
                : `Your candidate ${candidateName} has been matched at ${matchScore}% with a client requirement. Skills they're missing:`}
            </p>
          </div>

          {/* Missing skills with training */}
          <div className="space-y-2">
            {missingSkills.map((skill) => {
              const rec = getTrainingRecommendation(skill);
              return (
                <div key={skill} className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 w-fit">
                    {skill}
                  </span>
                  {rec && (
                    <div className="flex items-center gap-1.5 ml-1">
                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        → {rec.course}
                        <span className="text-muted-foreground/60 ml-1">
                          ({rec.provider})
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {missingSkills.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No specific skill gaps identified.
              </p>
            )}
          </div>

          {/* CTA */}
          <Button
            className="w-full bg-teal text-white hover:opacity-90 font-semibold"
            onClick={handleCTA}
            data-ocid="gap_connect.primary_button"
          >
            {isClient ? "Request Updated CV" : "Request a Match Introduction"}
          </Button>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg">
            {isClient ? (
              <Eye className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <p className="text-xs text-muted-foreground">
              {isClient
                ? "Vendor details are kept confidential until you proceed to interview."
                : "Client company details will be shared once they accept your request."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
