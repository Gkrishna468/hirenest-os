import { Button } from "@/components/ui/button";
import type { Requirement } from "@/lib/db";
import { Clock, DollarSign, MapPin, Star } from "lucide-react";
import { CircularScoreBadge } from "./CircularScoreBadge";
import { SkillChip } from "./SkillChip";
import { StatusBadge } from "./StatusBadge";

interface RequirementCardProps {
  requirement: Requirement;
  matchScore?: number;
  onSubmitCandidate?: (req: Requirement) => void;
  onView?: (req: Requirement) => void;
}

export function RequirementCard({
  requirement: req,
  matchScore,
  onSubmitCandidate,
  onView,
}: RequirementCardProps) {
  return (
    <div className="card-surface rounded-xl p-5 flex flex-col gap-3 hover:border-teal/30 transition-colors shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {req.is_featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange/10 text-orange border border-orange/30">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            <StatusBadge status={req.status} />
          </div>
          <h3 className="font-semibold text-foreground mt-1 text-base">
            {req.title}
          </h3>
          <p className="text-sm text-muted-foreground">{req.company}</p>
        </div>
        {matchScore !== undefined && (
          <CircularScoreBadge score={matchScore} size={52} />
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {req.skills.slice(0, 5).map((s) => (
          <SkillChip key={s} skill={s} />
        ))}
        {req.skills.length > 5 && (
          <span className="text-xs text-muted-foreground self-center">
            +{req.skills.length - 5}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {req.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {req.experience_min}–{req.experience_max} yrs
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />₹
          {(req.budget_min / 1000).toFixed(0)}K–
          {(req.budget_max / 1000).toFixed(0)}K/mo
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">
        {req.description}
      </p>

      <div className="flex gap-2 mt-1">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border text-muted-foreground hover:text-foreground"
            onClick={() => onView(req)}
            data-ocid="requirement.secondary_button"
          >
            View Details
          </Button>
        )}
        {onSubmitCandidate && (
          <Button
            size="sm"
            className="flex-1 bg-teal text-background hover:bg-teal-600 font-semibold"
            onClick={() => onSubmitCandidate(req)}
            data-ocid="requirement.submit_button"
          >
            Submit Candidate
          </Button>
        )}
      </div>
    </div>
  );
}
