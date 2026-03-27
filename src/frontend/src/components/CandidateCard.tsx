import { Button } from "@/components/ui/button";
import type { Candidate } from "@/lib/db";
import { getTrainingRecommendation } from "@/lib/training";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import { CircularScoreBadge } from "./CircularScoreBadge";
import { SkillChip } from "./SkillChip";
import { StatusBadge } from "./StatusBadge";
import { VerifiedBadge } from "./VerifiedBadge";

interface CandidateCardProps {
  candidate: Candidate;
  matchScore?: number;
  requirementSkills?: string[];
  onContact?: (c: Candidate) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CandidateCard({
  candidate: c,
  matchScore,
  requirementSkills,
  onContact,
}: CandidateCardProps) {
  const candSkillsLower = new Set(c.skills.map((s) => s.toLowerCase()));
  const matchedReqSkills = requirementSkills?.filter((s) =>
    candSkillsLower.has(s.toLowerCase()),
  );
  const missingReqSkills = requirementSkills?.filter(
    (s) => !candSkillsLower.has(s.toLowerCase()),
  );

  return (
    <div className="card-surface rounded-xl p-5 flex flex-col gap-3 hover:border-teal/30 transition-colors shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-icon flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
            {getInitials(c.name)}
          </div>
          <div>
            <Link
              to="/candidates/$candidateId"
              params={{ candidateId: c.id }}
              className="font-semibold text-foreground text-sm hover:text-teal transition-colors"
              data-ocid="candidate.link"
            >
              {c.name}
            </Link>
            <p className="text-xs text-muted-foreground">{c.role}</p>
          </div>
        </div>
        {matchScore !== undefined && (
          <CircularScoreBadge score={matchScore} size={52} />
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={c.availability} />
        {c.is_verified && <VerifiedBadge />}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {c.skills.slice(0, 5).map((s) => (
          <SkillChip key={s} skill={s} />
        ))}
        {c.skills.length > 5 && (
          <span className="text-xs text-muted-foreground self-center">
            +{c.skills.length - 5}
          </span>
        )}
      </div>

      {requirementSkills && requirementSkills.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Match Analysis:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedReqSkills?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"
              >
                <CheckCircle2 className="h-3 w-3" />
                {s}
              </span>
            ))}
            {missingReqSkills?.map((s) => {
              const rec = getTrainingRecommendation(s);
              return (
                <div key={s} className="flex flex-col gap-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                    <XCircle className="h-3 w-3" />
                    {s}
                  </span>
                  {rec && (
                    <span className="text-xs text-muted-foreground mt-0.5 block ml-1">
                      → {rec.course}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {c.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {c.experience} yrs exp
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />₹{(c.rate / 1000).toFixed(0)}K/mo
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{c.bio}</p>

      {onContact && (
        <Button
          size="sm"
          className="w-full bg-teal text-background hover:bg-teal-600 font-semibold mt-1"
          onClick={() => onContact(c)}
          data-ocid="candidate.primary_button"
        >
          Contact Vendor
        </Button>
      )}
    </div>
  );
}
