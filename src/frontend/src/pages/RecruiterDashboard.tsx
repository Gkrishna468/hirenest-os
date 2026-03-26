import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type Requirement,
  type Submission,
  getRequirements,
  getSubmissions,
} from "@/lib/db";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Save,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function RecruiterDashboard() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [submissionsByReq, setSubmissionsByReq] = useState<
    Record<string, Submission[]>
  >({});
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedNotes, setSavedNotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getRequirements().then(async (reqs) => {
      setRequirements(reqs);
      const subs = await Promise.all(reqs.map((r) => getSubmissions(r.id)));
      const map: Record<string, Submission[]> = {};
      for (const [i, r] of reqs.entries()) {
        map[r.id] = subs[i];
      }
      setSubmissionsByReq(map);
    });
  }, []);

  const handleBoost = (subId: string) => {
    console.log("Boosting submission", subId);
  };

  const handleSaveNote = (subId: string) => {
    setSavedNotes((prev) => ({ ...prev, [subId]: true }));
    setTimeout(
      () => setSavedNotes((prev) => ({ ...prev, [subId]: false })),
      2000,
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Recruiter Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage candidate submissions per requirement
          </p>
        </motion.div>

        <div className="space-y-3">
          {requirements.map((req, ri) => {
            const subs = (submissionsByReq[req.id] || []).sort(
              (a, b) => b.match_score - a.match_score,
            );
            const isOpen = expandedReq === req.id;
            return (
              <div
                key={req.id}
                className="card-surface rounded-xl overflow-hidden"
                data-ocid={`recruiter.item.${ri + 1}`}
              >
                <button
                  type="button"
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-teal/5 transition-colors"
                  onClick={() => setExpandedReq(isOpen ? null : req.id)}
                  data-ocid="recruiter.toggle"
                >
                  <div className="flex items-center gap-4">
                    <ClipboardList className="h-5 w-5 text-teal flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {req.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.company} · {req.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {subs.length} submission{subs.length !== 1 ? "s" : ""}
                    </span>
                    <StatusBadge status={req.status} />
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border px-5 pb-5">
                    <div className="flex flex-wrap gap-1.5 py-3">
                      {req.skills.map((s) => (
                        <SkillChip key={s} skill={s} />
                      ))}
                    </div>
                    {subs.length === 0 ? (
                      <p
                        className="text-sm text-muted-foreground py-4 text-center"
                        data-ocid="recruiter.empty_state"
                      >
                        No submissions yet for this requirement
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {subs.map((sub, si) => (
                          <div
                            key={sub.id}
                            className="bg-muted/10 rounded-xl p-4 space-y-3"
                            data-ocid={`recruiter.row.${si + 1}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-icon flex items-center justify-center text-teal font-bold text-xs">
                                {sub.candidate?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-foreground">
                                  {sub.candidate?.name}
                                  {si === 0 && (
                                    <span className="ml-2 text-xs text-teal font-medium">
                                      ★ Top Match
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.candidate?.role}
                                </p>
                              </div>
                              <CircularScoreBadge
                                score={sub.match_score}
                                size={44}
                              />
                              <StatusBadge status={sub.status} />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 border-teal/30 text-teal hover:bg-teal/10 text-xs"
                                onClick={() => handleBoost(sub.id)}
                                data-ocid="recruiter.primary_button"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" /> Boost
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Add recruiter notes..."
                                value={notes[sub.id] || ""}
                                onChange={(e) =>
                                  setNotes((prev) => ({
                                    ...prev,
                                    [sub.id]: e.target.value,
                                  }))
                                }
                                className="flex-1 bg-muted/20 border-border text-foreground text-xs min-h-[60px]"
                                data-ocid="recruiter.textarea"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-auto px-2 border-border self-end ${savedNotes[sub.id] ? "border-teal/50 text-teal" : ""}`}
                                onClick={() => handleSaveNote(sub.id)}
                                data-ocid="recruiter.save_button"
                              >
                                <Save className="h-3.5 w-3.5" />
                                {savedNotes[sub.id] && (
                                  <span className="text-xs ml-1">Saved</span>
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <Link to="/" className="text-teal hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
