import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type Requirement,
  type Submission,
  getRequirements,
  getSubmissions,
} from "@/lib/db";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  GitBranch,
  Lock,
  PlusCircle,
  Save,
  ThumbsUp,
  UserCheck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ASSIGNMENTS_KEY = "recruiter_assignments";
const getNoteKey = (candidateId: string) => `recruiter_notes_${candidateId}`;

function getAssignments(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAssignments(ids: string[]) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(ids));
}

type StageAction = {
  label: string;
  newStatus: string;
  variant?: "default" | "destructive" | "outline";
};

const STAGE_ACTIONS: Record<string, StageAction[]> = {
  submitted: [
    { label: "Shortlist", newStatus: "shortlisted" },
    { label: "Reject", newStatus: "rejected", variant: "outline" },
  ],
  shortlisted: [
    { label: "Schedule Interview", newStatus: "interview" },
    { label: "Reject", newStatus: "rejected", variant: "outline" },
  ],
  interview: [
    { label: "Extend Offer", newStatus: "offer_extended" },
    { label: "Reject", newStatus: "rejected", variant: "outline" },
  ],
  offer_extended: [],
  joined: [],
  rejected: [],
  closed: [],
};

function StagePill({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        count > 0 ? color : "text-muted-foreground border-border bg-muted/20"
      }`}
    >
      {label}({count})
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface rounded-xl p-5"
    >
      <div className={`p-2.5 rounded-lg w-fit mb-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold font-display text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

export function RecruiterWorkflowPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [submissionsByReq, setSubmissionsByReq] = useState<
    Record<string, Submission[]>
  >({});
  const [assignments, setAssignments] = useState<string[]>(getAssignments());
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedNotes, setSavedNotes] = useState<Record<string, boolean>>({});
  const [subStatuses, setSubStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    getRequirements().then(async (reqs) => {
      setRequirements(reqs);
      const subs = await Promise.all(reqs.map((r) => getSubmissions(r.id)));
      const map: Record<string, Submission[]> = {};
      for (const [i, r] of reqs.entries()) {
        map[r.id] = subs[i];
      }
      setSubmissionsByReq(map);

      // Load saved notes from localStorage
      const loadedNotes: Record<string, string> = {};
      for (const subsArr of subs) {
        for (const sub of subsArr) {
          if (!sub.candidate?.id) continue;
          const saved = localStorage.getItem(getNoteKey(sub.candidate.id));
          if (saved) loadedNotes[sub.id] = saved;
        }
      }
      setNotes(loadedNotes);
    });
  }, []);

  const assignedReqs = requirements.filter((r) => assignments.includes(r.id));
  const availableReqs = requirements.filter((r) => !assignments.includes(r.id));

  const allSubs = Object.values(submissionsByReq).flat();
  const mySubCount = assignedReqs.reduce(
    (acc, r) => acc + (submissionsByReq[r.id]?.length || 0),
    0,
  );
  const placements = allSubs.filter(
    (s) =>
      assignments.includes(s.requirement_id) &&
      (s.status as string) === "joined",
  ).length;
  const pendingActions = assignedReqs.reduce((acc, r) => {
    const subs = submissionsByReq[r.id] || [];
    return (
      acc +
      subs.filter((s) =>
        ["submitted", "shortlisted", "interview"].includes(
          subStatuses[s.id] || s.status,
        ),
      ).length
    );
  }, 0);

  const handleAssign = (reqId: string) => {
    const updated = [...assignments, reqId];
    setAssignments(updated);
    saveAssignments(updated);
    toast.success("Requirement assigned to your pipeline");
  };

  const handleSaveNote = (sub: Submission) => {
    if (sub.candidate?.id) {
      localStorage.setItem(getNoteKey(sub.candidate.id), notes[sub.id] || "");
    }
    setSavedNotes((prev) => ({ ...prev, [sub.id]: true }));
    setTimeout(
      () => setSavedNotes((prev) => ({ ...prev, [sub.id]: false })),
      2000,
    );
  };

  const handleStageAction = (subId: string, newStatus: string) => {
    setSubStatuses((prev) => ({ ...prev, [subId]: newStatus }));
    toast.success(`Candidate moved to ${newStatus.replace("_", " ")}`);
  };

  const handleRecommend = (candidateName: string) => {
    toast.success(`Recommendation for ${candidateName} sent to client`);
  };

  const getStatus = (sub: Submission) => subStatuses[sub.id] || sub.status;

  return (
    <TooltipProvider>
      <div className="min-h-screen gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Recruiter Dashboard
                </h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20 uppercase tracking-wide">
                  Recruiter
                </span>
              </div>
              <p className="text-muted-foreground">
                Manage your assigned requirements and advance candidate stages
              </p>
            </div>
            <Button
              className="bg-teal text-white hover:opacity-90 font-semibold"
              onClick={() =>
                toast.info(
                  'Browse "Available Requirements" below to take on new assignments',
                )
              }
              data-ocid="recruiter.primary_button"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Assign Requirement
            </Button>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KpiCard
              icon={Briefcase}
              label="Active Assignments"
              value={assignedReqs.length}
              color="bg-teal/10 text-teal"
            />
            <KpiCard
              icon={GitBranch}
              label="Candidates in Pipeline"
              value={mySubCount}
              color="bg-blue-500/10 text-blue-500"
            />
            <KpiCard
              icon={UserCheck}
              label="Placements This Month"
              value={placements}
              color="bg-green-500/10 text-green-600"
            />
            <KpiCard
              icon={ClipboardList}
              label="Pending Actions"
              value={pendingActions}
              color="bg-amber-500/10 text-amber-600"
            />
          </div>

          {/* My Assignments */}
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal" />
              My Assignments
              <span className="text-sm font-normal text-muted-foreground">
                ({assignedReqs.length})
              </span>
            </h2>

            {assignedReqs.length === 0 && (
              <div
                className="card-surface rounded-xl p-10 text-center text-muted-foreground"
                data-ocid="recruiter.empty_state"
              >
                <GitBranch className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No assignments yet. Take requirements from the list below.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {assignedReqs.map((req, ri) => {
                const subs = (submissionsByReq[req.id] || []).sort(
                  (a, b) => b.match_score - a.match_score,
                );
                const isOpen = expandedReq === req.id;

                const stageCounts = {
                  submitted: subs.filter((s) => getStatus(s) === "submitted")
                    .length,
                  shortlisted: subs.filter(
                    (s) => getStatus(s) === "shortlisted",
                  ).length,
                  interview: subs.filter((s) => getStatus(s) === "interview")
                    .length,
                  offer: subs.filter((s) => getStatus(s) === "offer_extended")
                    .length,
                  joined: subs.filter((s) => getStatus(s) === "joined").length,
                };

                return (
                  <div
                    key={req.id}
                    className="card-surface rounded-xl overflow-hidden"
                    data-ocid={`recruiter.item.${ri + 1}`}
                  >
                    <button
                      type="button"
                      className="w-full p-5 flex items-start justify-between text-left hover:bg-teal/5 transition-colors"
                      onClick={() => setExpandedReq(isOpen ? null : req.id)}
                      data-ocid="recruiter.toggle"
                    >
                      <div className="flex items-start gap-4">
                        <ClipboardList className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {req.title}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {req.company} · {req.location}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <StagePill
                              label="Submitted"
                              count={stageCounts.submitted}
                              color="text-gray-600 border-gray-300 bg-gray-50"
                            />
                            <StagePill
                              label="Shortlisted"
                              count={stageCounts.shortlisted}
                              color="text-blue-600 border-blue-200 bg-blue-50"
                            />
                            <StagePill
                              label="Interview"
                              count={stageCounts.interview}
                              color="text-purple-600 border-purple-200 bg-purple-50"
                            />
                            <StagePill
                              label="Offer"
                              count={stageCounts.offer}
                              color="text-orange-600 border-orange-200 bg-orange-50"
                            />
                            <StagePill
                              label="Joined"
                              count={stageCounts.joined}
                              color="text-green-600 border-green-200 bg-green-50"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
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
                            No submissions for this requirement yet
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {subs.map((sub, si) => {
                              const currentStatus = getStatus(sub);
                              const actions =
                                STAGE_ACTIONS[currentStatus] || [];
                              return (
                                <div
                                  key={sub.id}
                                  className="bg-muted/10 rounded-xl p-4 space-y-3"
                                  data-ocid={`recruiter.row.${si + 1}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs flex-shrink-0">
                                      {sub.candidate?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <div className="flex-1 min-w-0">
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
                                    <StatusBadge status={currentStatus} />
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-2">
                                    {actions.map((action) => (
                                      <Button
                                        key={action.label}
                                        size="sm"
                                        variant={
                                          action.variant === "outline"
                                            ? "outline"
                                            : "default"
                                        }
                                        className={
                                          action.variant === "outline"
                                            ? "h-7 px-3 border-red-300 text-red-600 hover:bg-red-50 text-xs"
                                            : "h-7 px-3 bg-teal text-white hover:opacity-90 text-xs"
                                        }
                                        onClick={() =>
                                          handleStageAction(
                                            sub.id,
                                            action.newStatus,
                                          )
                                        }
                                        data-ocid="recruiter.secondary_button"
                                      >
                                        {action.variant === "outline" ? (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {action.label}
                                      </Button>
                                    ))}

                                    {currentStatus === "offer_extended" && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span>
                                            <Button
                                              size="sm"
                                              disabled
                                              className="h-7 px-3 text-xs cursor-not-allowed opacity-50"
                                            >
                                              <Lock className="h-3 w-3 mr-1" />
                                              Mark Joined (Admin)
                                            </Button>
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Only admin can mark joined
                                        </TooltipContent>
                                      </Tooltip>
                                    )}

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-3 border-teal/30 text-teal hover:bg-teal/10 text-xs ml-auto"
                                      onClick={() =>
                                        handleRecommend(
                                          sub.candidate?.name || "Candidate",
                                        )
                                      }
                                      data-ocid="recruiter.primary_button"
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      Recommend to Client
                                    </Button>
                                  </div>

                                  {/* Notes */}
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
                                      className="flex-1 bg-muted/20 border-border text-foreground text-xs min-h-[56px] resize-none"
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
                                      onClick={() => handleSaveNote(sub)}
                                      data-ocid="recruiter.save_button"
                                    >
                                      <Save className="h-3.5 w-3.5" />
                                      {savedNotes[sub.id] && (
                                        <span className="text-xs ml-1">
                                          Saved
                                        </span>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Available Requirements */}
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              Available Requirements
              <span className="text-sm font-normal text-muted-foreground">
                ({availableReqs.length} unassigned)
              </span>
            </h2>

            {availableReqs.length === 0 ? (
              <div
                className="card-surface rounded-xl p-8 text-center text-muted-foreground"
                data-ocid="recruiter.empty_state"
              >
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-60" />
                <p className="text-sm">All requirements are assigned.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableReqs.map((req, ri) => {
                  const subsCount = submissionsByReq[req.id]?.length || 0;
                  return (
                    <div
                      key={req.id}
                      className="card-surface rounded-xl p-5 flex flex-col gap-3"
                      data-ocid={`recruiter.card.${ri + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {req.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {req.company} · {req.location}
                          </p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {req.skills.slice(0, 4).map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {subsCount} submission
                          {subsCount !== 1 ? "s" : ""}
                        </span>
                        <Button
                          size="sm"
                          className="h-7 px-3 bg-teal text-white hover:opacity-90 text-xs font-semibold"
                          onClick={() => handleAssign(req.id)}
                          data-ocid="recruiter.secondary_button"
                        >
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Take Assignment
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="mt-10 text-sm text-muted-foreground">
            <Link to="/" className="text-teal hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
