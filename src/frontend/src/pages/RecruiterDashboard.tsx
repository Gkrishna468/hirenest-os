import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Requirement, type Submission, getRequirements } from "@/lib/db";
import {
  getSubmissionsForRequirement,
  subscribeToRequirementSubmissions,
  updateSubmissionStatusDB,
} from "@/lib/submissionsDb";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, ClipboardList, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: Submission["status"][] = [
  "submitted",
  "shortlisted",
  "interview",
  "offer_extended",
  "joined",
  "rejected",
];

const STATUS_COLORS: Record<Submission["status"], string> = {
  submitted: "text-slate-600 bg-slate-100 border-slate-200",
  shortlisted: "text-blue-700 bg-blue-100 border-blue-200",
  interview: "text-amber-700 bg-amber-100 border-amber-200",
  offer_extended: "text-purple-700 bg-purple-100 border-purple-200",
  joined: "text-green-700 bg-green-100 border-green-200",
  rejected: "text-red-700 bg-red-100 border-red-200",
  closed: "text-gray-600 bg-gray-100 border-gray-200",
};

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
      const subs = await Promise.all(
        reqs.map((r) => getSubmissionsForRequirement(r.id)),
      );
      const map: Record<string, Submission[]> = {};
      for (const [i, r] of reqs.entries()) {
        map[r.id] = subs[i];
      }
      setSubmissionsByReq(map);
    });
  }, []);

  // Subscribe to real-time updates when a requirement is expanded
  useEffect(() => {
    if (!expandedReq) return;
    const unsubscribe = subscribeToRequirementSubmissions(
      expandedReq,
      (updated) => {
        setSubmissionsByReq((prev) => ({ ...prev, [expandedReq]: updated }));
      },
    );
    return unsubscribe;
  }, [expandedReq]);

  const handleStatusChange = async (
    sub: Submission,
    newStatus: Submission["status"],
  ) => {
    await updateSubmissionStatusDB(sub.id, newStatus);
    setSubmissionsByReq((prev) => ({
      ...prev,
      [sub.requirement_id]: (prev[sub.requirement_id] || []).map((s) =>
        s.id === sub.id ? { ...s, status: newStatus } : s,
      ),
    }));
    toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
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
                              {/* Status dropdown */}
                              <select
                                value={sub.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    sub,
                                    e.target.value as Submission["status"],
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded-lg border font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal/40 ${
                                  STATUS_COLORS[sub.status] ||
                                  "text-slate-600 bg-slate-100 border-slate-200"
                                }`}
                                data-ocid="recruiter.select"
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt.replace("_", " ")}
                                  </option>
                                ))}
                              </select>
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
                                className={`h-auto px-2 border-border self-end ${
                                  savedNotes[sub.id]
                                    ? "border-teal/50 text-teal"
                                    : ""
                                }`}
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
