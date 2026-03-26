import { GapConnectModal } from "@/components/GapConnectModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  type Candidate,
  type Requirement,
  getCandidates,
  getRequirements,
} from "@/lib/db";
import {
  type MatchResult,
  calculateMatchScore,
  inferSeniority,
  parseJDText,
} from "@/lib/matching";
import { getCurrentRole } from "@/lib/roleStore";
import { getTrainingRecommendation } from "@/lib/training";
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  GitPullRequestArrow,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CandidateResult {
  candidate: Candidate;
  result: MatchResult;
}

type Seniority = "junior" | "mid" | "senior" | "lead" | "principal";

interface ParsedRequirement {
  title: string;
  skills: string[];
  experience: number;
  seniority: Seniority;
}

interface GapConnectState {
  open: boolean;
  candidateName: string;
  missingSkills: string[];
  matchScore: number;
}

function ScoreBar({
  label,
  value,
  weight,
  color,
}: {
  label: string;
  value: number;
  weight: string;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {label} <span className="text-muted-foreground/60">({weight})</span>
        </span>
        <span className="font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function TagBadge({ tag }: { tag: "Strong" | "Moderate" | "Weak" }) {
  const styles = {
    Strong: "bg-green-100 text-green-700 border-green-200",
    Moderate: "bg-orange-100 text-orange-700 border-orange-200",
    Weak: "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[tag]}`}
    >
      {tag} Match
    </span>
  );
}

function CircleScore({ score }: { score: number }) {
  const color =
    score >= 75
      ? "text-green-600"
      : score >= 50
        ? "text-orange-500"
        : "text-red-500";
  const stroke = score >= 75 ? "#16a34a" : score >= 50 ? "#f97316" : "#ef4444";
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 56 56"
        aria-label="Match score"
      >
        <title>Match score</title>
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}
      >
        {score}
      </span>
    </div>
  );
}

export function AIMatchPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [parsed, setParsed] = useState<ParsedRequirement | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [gapConnect, setGapConnect] = useState<GapConnectState>({
    open: false,
    candidateName: "",
    missingSkills: [],
    matchScore: 0,
  });

  const currentRole = getCurrentRole();
  const viewAs = currentRole === "vendor" ? "vendor" : "client";

  useEffect(() => {
    Promise.all([getRequirements(), getCandidates()]).then(([reqs, cands]) => {
      setRequirements(reqs);
      setCandidates(cands);
    });
  }, []);

  const runMatching = (req: ParsedRequirement) => {
    const scored: CandidateResult[] = candidates.map((c) => ({
      candidate: c,
      result: calculateMatchScore(
        req.skills,
        c.skills,
        req.experience,
        c.experience,
        req.seniority,
        c.role,
      ),
    }));
    scored.sort((a, b) => b.result.score - a.result.score);
    setResults(scored);
  };

  const handleSelectRequirement = (reqId: string) => {
    setSelectedReqId(reqId);
    setJdText("");
    const req = requirements.find((r) => r.id === reqId);
    if (!req) return;
    const seniority = inferSeniority(req.title, req.experience_min);
    const p: ParsedRequirement = {
      title: req.title,
      skills: req.skills,
      experience: req.experience_min,
      seniority,
    };
    setParsed(p);
    runMatching(p);
  };

  const handleParseJD = () => {
    if (!jdText.trim()) return;
    setSelectedReqId(null);
    const { skills, experience, seniority } = parseJDText(jdText);
    const p: ParsedRequirement = {
      title: "Parsed from JD",
      skills,
      experience,
      seniority,
    };
    setParsed(p);
    runMatching(p);
  };

  const removeSkill = (skill: string) => {
    if (!parsed) return;
    const updated = {
      ...parsed,
      skills: parsed.skills.filter((s) => s !== skill),
    };
    setParsed(updated);
    runMatching(updated);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-teal" />
            <span className="text-sm font-semibold text-teal">AI-Powered</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            AI Match Analysis
          </h1>
          <p className="text-muted-foreground text-lg">
            Compare candidates against any job requirement with weighted scoring
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-teal" />
              Skills 60%
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Experience 20%
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              Seniority 20%
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="card-surface rounded-xl p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-teal" />
                Define Requirement
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Select from existing
                  </p>
                  <Select
                    value={selectedReqId || ""}
                    onValueChange={handleSelectRequirement}
                  >
                    <SelectTrigger
                      className="bg-muted/30 border-border"
                      data-ocid="ai_match.select"
                    >
                      <SelectValue placeholder="Choose a requirement..." />
                    </SelectTrigger>
                    <SelectContent>
                      {requirements.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.title} — {r.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground font-medium">
                    OR
                  </span>
                  <Separator className="flex-1" />
                </div>

                <div>
                  <label
                    htmlFor="jd-textarea"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block"
                  >
                    Paste Job Description
                  </label>
                  <Textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste full JD text here... e.g. 'Senior React Developer with 5+ years TypeScript, AWS, GraphQL experience'"
                    className="min-h-28 bg-muted/30 border-border text-sm resize-none"
                    id="jd-textarea"
                    data-ocid="ai_match.textarea"
                  />
                  <Button
                    className="w-full mt-2 bg-teal text-white hover:opacity-90 font-semibold"
                    onClick={handleParseJD}
                    disabled={!jdText.trim()}
                    data-ocid="ai_match.primary_button"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Parse JD with AI
                  </Button>
                </div>
              </div>

              {parsed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 pt-5 border-t border-border space-y-3"
                >
                  <h3 className="text-sm font-bold text-foreground">
                    Extracted Requirements
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/40 rounded-lg p-3">
                      <p className="text-muted-foreground mb-0.5">Experience</p>
                      <p className="font-bold text-foreground">
                        {parsed.experience > 0
                          ? `${parsed.experience}+ years`
                          : "Not specified"}
                      </p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3">
                      <p className="text-muted-foreground mb-0.5">Level</p>
                      <p className="font-bold text-foreground capitalize">
                        {parsed.seniority}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Skills ({parsed.skills.length} detected) — click to remove
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsed.skills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        >
                          {s}
                          <XCircle className="h-3 w-3" />
                        </button>
                      ))}
                      {parsed.skills.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">
                          No skills detected
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 space-y-4"
          >
            {results.length === 0 ? (
              <div className="card-surface rounded-xl p-16 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  Match Results Appear Here
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Select a requirement from the dropdown or paste a job
                  description to see ranked candidates.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-foreground">
                    {results.length} Candidates Ranked
                  </h2>
                  <Badge variant="outline" className="text-teal border-teal/30">
                    {parsed?.title}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {results.map(({ candidate: c, result: r }, idx) => {
                    const isExpanded = expandedId === c.id;
                    const isGapCandidate = r.score >= 80 && r.score <= 99;
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="card-surface rounded-xl overflow-hidden"
                        data-ocid={`ai_match.item.${idx + 1}`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <CircleScore score={r.score} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <h3 className="font-semibold text-foreground text-sm">
                                    {c.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">
                                    {c.role} · {c.experience} yrs · {c.location}
                                  </p>
                                </div>
                                <TagBadge tag={r.tag} />
                              </div>

                              {/* Score Bars */}
                              <div className="mt-3 space-y-2">
                                <ScoreBar
                                  label="Skill Match"
                                  value={r.skillScore}
                                  weight="60%"
                                  color="bg-teal"
                                />
                                <ScoreBar
                                  label="Experience"
                                  value={r.experienceScore}
                                  weight="20%"
                                  color="bg-purple-500"
                                />
                                <ScoreBar
                                  label="Seniority"
                                  value={r.seniorityScore}
                                  weight="20%"
                                  color="bg-orange-400"
                                />
                              </div>

                              {/* Skill Gap Chips with training recommendations */}
                              {parsed && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {r.matches.map((s) => (
                                    <span
                                      key={s}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                      {s}
                                    </span>
                                  ))}
                                  {r.missing.map((s) => {
                                    const rec = getTrainingRecommendation(s);
                                    return (
                                      <div
                                        key={s}
                                        className="flex flex-col gap-0.5"
                                      >
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                                          <XCircle className="h-3 w-3" />
                                          {s}
                                        </span>
                                        {rec && (
                                          <span className="text-xs text-muted-foreground ml-1">
                                            → {rec.course}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Gap Connect Button for 80-99% matches */}
                              {isGapCandidate && r.missing.length > 0 && (
                                <button
                                  type="button"
                                  className="mt-3 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                                  onClick={() =>
                                    setGapConnect({
                                      open: true,
                                      candidateName: c.name,
                                      missingSkills: r.missing,
                                      matchScore: r.score,
                                    })
                                  }
                                  data-ocid={`ai_match.secondary_button.${idx + 1}`}
                                >
                                  <GitPullRequestArrow className="h-3.5 w-3.5" />
                                  Gap Connect
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expand Toggle */}
                          <button
                            type="button"
                            className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : c.id)
                            }
                            data-ocid={`ai_match.toggle.${idx + 1}`}
                          >
                            AI Reasoning
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="border-t border-border bg-muted/20 px-4 py-3"
                          >
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              <Brain className="h-3.5 w-3.5 inline mr-1.5 text-teal" />
                              {r.reasoning}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gap Connect Modal */}
      <GapConnectModal
        open={gapConnect.open}
        onClose={() => setGapConnect((prev) => ({ ...prev, open: false }))}
        candidateName={gapConnect.candidateName}
        missingSkills={gapConnect.missingSkills}
        matchScore={gapConnect.matchScore}
        viewAs={viewAs}
      />
    </div>
  );
}
