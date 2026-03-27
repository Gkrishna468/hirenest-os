import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type Candidate,
  type PlacementTransaction,
  type VendorInquiry,
  createCandidate,
  getCandidates,
  getPlacementsByVendor,
  getVendorInquiries,
  markInquiryRead,
} from "@/lib/db";
import { parseJDText } from "@/lib/matching";
import {
  type PlanStatus,
  getPlanStatus,
  recordSubmission,
} from "@/lib/planEnforcement";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  GitBranch,
  Lock,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const VENDOR_ID = "vendor-1";

const PIPELINE_STAGES = [
  "submitted",
  "shortlisted",
  "interview",
  "offer_extended",
  "joined",
];

function PipelineTracker({ status }: { status: string }) {
  const current = PIPELINE_STAGES.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {PIPELINE_STAGES.map((stage, idx) => {
        const active = idx <= current;
        const isCurrent = idx === current;
        return (
          <div key={stage} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                active
                  ? isCurrent
                    ? "bg-teal text-white ring-2 ring-teal/30"
                    : "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {active && !isCurrent ? "\u2713" : idx + 1}
            </div>
            {idx < PIPELINE_STAGES.length - 1 && (
              <div
                className={`w-5 h-0.5 ${idx < current ? "bg-green-500" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground capitalize">
        {status.replace("_", " ")}
      </span>
    </div>
  );
}

function PlanUsageBanner({ planStatus }: { planStatus: PlanStatus }) {
  if (planStatus.tier !== "starter") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
          \u2713 Unlimited submissions (Vendor Pro)
        </span>
      </div>
    );
  }
  const used = planStatus.submissionsUsed;
  const limit = planStatus.submissionsLimit as number;
  const isNearLimit = used >= limit - 1;
  const isAtLimit = !planStatus.canSubmit;
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg border mb-4 ${
        isAtLimit
          ? "bg-red-500/10 border-red-400/30"
          : isNearLimit
            ? "bg-amber-500/10 border-amber-400/30"
            : "bg-green-500/10 border-green-400/20"
      }`}
      data-ocid="vendor.panel"
    >
      <div className="flex items-center gap-2">
        {isAtLimit ? (
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        ) : (
          <TrendingUp
            className={`h-4 w-4 flex-shrink-0 ${
              isNearLimit ? "text-amber-500" : "text-green-500"
            }`}
          />
        )}
        <span
          className={`text-sm font-medium ${
            isAtLimit
              ? "text-red-700 dark:text-red-400"
              : isNearLimit
                ? "text-amber-700 dark:text-amber-400"
                : "text-green-700 dark:text-green-400"
          }`}
        >
          \ud83d\udcca {used}/{limit} submissions used this month \u00b7 Resets{" "}
          {planStatus.resetDate}
        </span>
      </div>
      <Link
        to="/pricing"
        className="text-xs font-semibold text-teal hover:underline whitespace-nowrap"
        data-ocid="vendor.link"
      >
        Upgrade to Pro \u2192
      </Link>
    </div>
  );
}

// ── Analytics Tab Content ─────────────────────────────────────────────────────────────

const FUNNEL_STAGES = [
  { key: "submitted", label: "Submitted", color: "bg-gray-400" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-blue-500" },
  { key: "interview", label: "Interview", color: "bg-purple-500" },
  { key: "offer_extended", label: "Offer Extended", color: "bg-orange-500" },
  { key: "joined", label: "Joined", color: "bg-green-500" },
];

function AnalyticsTab({
  planStatus,
  submissions,
  candidates,
}: {
  planStatus: PlanStatus;
  submissions: PlacementTransaction[];
  candidates: Candidate[];
}) {
  const navigate = useNavigate();

  if (planStatus.tier === "starter") {
    return (
      <div
        className="card-surface rounded-xl p-12 text-center"
        data-ocid="vendor.panel"
      >
        <div className="w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          Analytics Dashboard
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          Available on Vendor Pro
        </p>
        <p className="text-xs text-muted-foreground/70 mb-6 max-w-xs mx-auto">
          See submission rates, match score trends, and placement funnel
        </p>
        <Button
          className="bg-teal text-white hover:opacity-90 font-semibold"
          onClick={() => navigate({ to: "/pricing" })}
          data-ocid="vendor.primary_button"
        >
          <Zap className="h-4 w-4 mr-2" />
          Upgrade to Pro \u2192
        </Button>
      </div>
    );
  }

  // Calculate metrics
  const subCount = submissions.length;
  const candCount = candidates.length;
  const interviewCount = submissions.filter((s) =>
    ["interview", "offer_extended", "joined"].includes(s.status),
  ).length;
  const joinedCount = submissions.filter((s) => s.status === "joined").length;
  const interviewRate =
    subCount > 0 ? Math.round((interviewCount / subCount) * 100) : 0;
  const placementRate =
    subCount > 0 ? Math.round((joinedCount / subCount) * 100) : 0;

  const funnelCounts: Record<string, number> = {};
  for (const stage of FUNNEL_STAGES) {
    funnelCounts[stage.key] = submissions.filter(
      (s) => s.status === stage.key,
    ).length;
  }
  const maxFunnel = Math.max(...Object.values(funnelCounts), 1);

  const metrics = [
    {
      label: "Submission Rate",
      value: `${subCount} / ${candCount}`,
      sub: "submissions per candidate on bench",
      icon: Send,
      color: "text-teal",
      bg: "bg-teal/10",
    },
    {
      label: "Avg Match Score",
      value: "72%",
      sub: "across all submissions",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Interview Rate",
      value: `${interviewRate}%`,
      sub: "submissions reaching interview",
      icon: GitBranch,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Placement Rate",
      value: `${placementRate}%`,
      sub: "submissions resulting in placement",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-surface rounded-xl p-5">
            <div className={`p-2.5 rounded-lg w-fit mb-3 ${m.bg}`}>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <p className={`text-2xl font-bold font-display ${m.color}`}>
              {m.value}
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {m.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Submission Funnel */}
      <div className="card-surface rounded-xl p-6">
        <h3 className="font-display font-bold text-base text-foreground mb-5 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-teal" />
          Submission Funnel
        </h3>
        <div className="space-y-3">
          {FUNNEL_STAGES.map((stage) => {
            const count = funnelCounts[stage.key] || 0;
            const pct = maxFunnel > 0 ? (count / maxFunnel) * 100 : 0;
            return (
              <div key={stage.key} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-28 flex-shrink-0">
                  {stage.label}
                </span>
                <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`h-full rounded-full ${stage.color}`}
                  />
                </div>
                <span className="text-sm font-bold text-foreground w-6 text-right flex-shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────────

export function NewVendorDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [submissions, setSubmissions] = useState<PlacementTransaction[]>([]);
  const [inquiries, setInquiries] = useState<VendorInquiry[]>([]);
  const [planStatus, setPlanStatus] = useState<PlanStatus>(
    getPlanStatus(VENDOR_ID),
  );
  const [addOpen, setAddOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [parsedBadge, setParsedBadge] = useState<{ count: number } | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    rate: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    getCandidates().then((all) =>
      setCandidates(
        all.filter(
          (c) => c.vendor_id === "vendor-1" || c.vendor_id === "vendor-2",
        ),
      ),
    );
    getPlacementsByVendor(VENDOR_ID).then(setSubmissions);
    getVendorInquiries(VENDOR_ID).then(setInquiries);
  }, []);

  const refreshPlan = () => setPlanStatus(getPlanStatus(VENDOR_ID));

  const unreadCount = inquiries.filter((i) => !i.read).length;
  const totalEarned = submissions
    .filter((s) => s.status === "joined")
    .reduce((acc, s) => acc + (s.vendor_payout || 0), 0);
  const pendingPayout = submissions
    .filter(
      (s) => s.status === "joined" && s.vendor_payout_status === "pending",
    )
    .reduce((acc, s) => acc + (s.vendor_payout || 0), 0);
  const activePlacements = submissions.filter(
    (s) => s.status === "joined",
  ).length;

  const handleParseResume = () => {
    if (!resumeText.trim()) {
      toast.error("Please paste resume text first");
      return;
    }
    const parsed = parseJDText(resumeText);
    setForm((prev) => ({
      ...prev,
      skills: parsed.skills.join(", "),
      experience:
        parsed.experience > 0 ? String(parsed.experience) : prev.experience,
    }));
    setParsedBadge({ count: parsed.skills.length });
    toast.success(`Parsed ${parsed.skills.length} skills from resume`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      toast.info("PDF text extraction: paste text directly for best results");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setResumeText(ev.target?.result as string);
      toast.success(
        'File loaded \u2014 click "Parse Resume with AI" to extract skills',
      );
    };
    reader.readAsText(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCandidate({
      name: form.name,
      role: form.role,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experience: Number(form.experience),
      rate: Number(form.rate),
      location: form.location,
      bio: form.bio,
      vendor_id: VENDOR_ID,
    });
    getCandidates().then((all) =>
      setCandidates(
        all.filter(
          (c) => c.vendor_id === "vendor-1" || c.vendor_id === "vendor-2",
        ),
      ),
    );
    setAddOpen(false);
    setParsedBadge(null);
    setResumeText("");
    setForm({
      name: "",
      role: "",
      skills: "",
      experience: "",
      rate: "",
      location: "",
      bio: "",
    });
  };

  const handleInquiryClick = async (id: string) => {
    await markInquiryRead(id);
    getVendorInquiries(VENDOR_ID).then(setInquiries);
  };

  const handleSubmitAttempt = () => {
    if (!planStatus.canSubmit) {
      setUpgradeModalOpen(true);
      return;
    }
    recordSubmission(VENDOR_ID);
    refreshPlan();
    toast.success("Candidate submitted successfully");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">TechBridge Staffing</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => navigate({ to: "/deal-room" })}
            >
              <MessageSquare className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <Button
              className="bg-teal text-white hover:opacity-90 font-semibold"
              onClick={() => setAddOpen(true)}
              data-ocid="vendor.primary_button"
            >
              <Plus className="h-4 w-4 mr-2" /> Upload Candidate
            </Button>
          </div>
        </div>

        {/* Earnings Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 mb-8 text-white"
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 opacity-80" />
            <h2 className="font-semibold text-lg">My Earnings</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-white/70 text-sm">Total Earned</p>
              <p className="text-3xl font-bold font-display">
                \u20b9{totalEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Pending Payout</p>
              <p className="text-3xl font-bold font-display text-yellow-200">
                \u20b9{pendingPayout.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Active Placements</p>
              <p className="text-3xl font-bold font-display text-green-200">
                {activePlacements}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="card-surface rounded-xl p-5">
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    label: "My Candidates",
                    value: candidates.length,
                    color: "text-teal",
                    bg: "bg-teal/10",
                  },
                  {
                    icon: Send,
                    label: "Submissions",
                    value: submissions.length,
                    color: "text-orange",
                    bg: "bg-orange/10",
                  },
                  {
                    icon: CheckCircle,
                    label: "Placements",
                    value: submissions.filter((s) => s.status === "joined")
                      .length,
                    color: "text-green-600",
                    bg: "bg-green-100",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bg}`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-xl font-bold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />{" "}
                Recent Inquiries
              </h3>
              <div className="space-y-2">
                {inquiries.slice(0, 4).map((inq, i) => (
                  <button
                    key={inq.id}
                    type="button"
                    className={`w-full text-left p-3 rounded-lg transition-colors ${!inq.read ? "bg-teal/10 border border-teal/20" : "bg-muted/30"}`}
                    onClick={() => handleInquiryClick(inq.id)}
                    data-ocid={`vendor.row.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium text-foreground truncate">
                        {inq.sender_company}
                      </p>
                      {!inq.read && (
                        <span className="w-2 h-2 bg-teal rounded-full flex-shrink-0" />
                      )}
                    </div>
                    {inq.candidate_name && (
                      <p className="text-xs text-muted-foreground">
                        About: {inq.candidate_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {new Date(inq.sent_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
                {inquiries.length === 0 && (
                  <p
                    className="text-sm text-muted-foreground text-center py-4"
                    data-ocid="vendor.empty_state"
                  >
                    No inquiries yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content with Tabs */}
          <div className="col-span-12 lg:col-span-9">
            <Tabs defaultValue="submissions" className="w-full">
              <TabsList
                className="mb-5 bg-muted/40 border border-border w-full"
                data-ocid="vendor.tab"
              >
                <TabsTrigger
                  value="submissions"
                  className="flex-1 data-[state=active]:bg-teal data-[state=active]:text-white"
                  data-ocid="vendor.tab"
                >
                  <Send className="h-4 w-4 mr-2" />
                  My Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="bench"
                  className="flex-1 data-[state=active]:bg-teal data-[state=active]:text-white"
                  data-ocid="vendor.tab"
                >
                  <Users className="h-4 w-4 mr-2" />
                  My Bench
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex-1 data-[state=active]:bg-teal data-[state=active]:text-white"
                  data-ocid="vendor.tab"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Submissions Tab */}
              <TabsContent value="submissions">
                <div className="card-surface rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      My Submissions Pipeline
                    </h2>
                    <Link
                      to="/requirements"
                      className="text-sm text-teal hover:underline"
                    >
                      Browse requirements \u2192
                    </Link>
                  </div>

                  <div className="px-5 pt-4">
                    <PlanUsageBanner planStatus={planStatus} />
                  </div>

                  <div className="divide-y divide-border">
                    {submissions.length === 0 && (
                      <div
                        className="p-10 text-center text-muted-foreground"
                        data-ocid="vendor.empty_state"
                      >
                        <p className="text-sm mb-2">No submissions yet.</p>
                        <Link
                          to="/requirements"
                          className="text-teal text-sm hover:underline"
                        >
                          Browse requirements to submit candidates
                        </Link>
                      </div>
                    )}
                    {submissions.map((sub, i) => (
                      <div
                        key={sub.id}
                        className="p-5 hover:bg-muted/20 transition-colors"
                        data-ocid={`vendor.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">
                                {sub.candidate?.name}
                              </p>
                              <StatusBadge status={sub.status} />
                              {sub.status === "joined" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                                  \u20b9
                                  {sub.vendor_payout?.toLocaleString("en-IN")}{" "}
                                  earned
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {sub.candidate?.role} \u00b7{" "}
                              {sub.candidate?.skills?.slice(0, 3).join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              For:{" "}
                              <span className="font-medium text-foreground">
                                {sub.requirement?.title}
                              </span>{" "}
                              \u2014 {sub.requirement?.company}
                            </p>
                            <PipelineTracker status={sub.status} />
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-foreground">
                              \u20b9
                              {sub.requirement?.budget_max?.toLocaleString(
                                "en-IN",
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              max budget
                            </p>
                            {sub.status === "joined" &&
                              sub.vendor_payout_status === "pending" && (
                                <div className="flex items-center gap-1 text-orange text-xs mt-1 justify-end">
                                  <Clock className="h-3 w-3" /> Payout pending
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 border-t border-border">
                    <Button
                      className={`w-full font-semibold ${
                        planStatus.canSubmit
                          ? "bg-teal text-white hover:opacity-90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      onClick={handleSubmitAttempt}
                      data-ocid="vendor.submit_button"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {planStatus.canSubmit
                        ? "Submit a Candidate to Requirements"
                        : "Submission Limit Reached \u2014 Upgrade to Continue"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Bench Tab */}
              <TabsContent value="bench">
                <div className="card-surface rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      My Bench
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {candidates.length} candidates
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {candidates.map((cand, i) => (
                      <div
                        key={cand.id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                        data-ocid={`vendor.card.${i + 1}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold">
                            {cand.name.charAt(0)}
                          </div>
                          <StatusBadge status={cand.availability} />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {cand.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {cand.role}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cand.skills.slice(0, 3).map((s) => (
                            <SkillChip key={s} skill={s} />
                          ))}
                        </div>
                        <div className="flex justify-between text-sm border-t border-border pt-2">
                          <span className="text-muted-foreground">
                            {cand.experience} yrs
                          </span>
                          <span className="font-medium text-foreground">
                            \u20b9{(cand.rate / 1000).toFixed(0)}K/mo
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAddOpen(true)}
                      className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-teal hover:text-teal transition-colors min-h-[160px]"
                      data-ocid="vendor.add_button"
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Add Candidate</span>
                    </button>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <AnalyticsTab
                  planStatus={planStatus}
                  submissions={submissions}
                  candidates={candidates}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <Link to="/" className="text-teal hover:underline">
            \u2190 Back to Home
          </Link>
        </div>
      </div>

      {/* Add Candidate Modal */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) {
            setParsedBadge(null);
            setResumeText("");
          }
        }}
      >
        <DialogContent
          className="bg-card border-border max-w-2xl"
          data-ocid="vendor.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add Bench Candidate
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Resume Parsing Section */}
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-teal" />
                <span className="text-sm font-semibold text-foreground">
                  Resume Parser (AI)
                </span>
                {parsedBadge && (
                  <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle className="h-3 w-3" /> Parsed{" "}
                    {parsedBadge.count} skills
                  </span>
                )}
              </div>
              <Textarea
                placeholder="Paste candidate's resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="bg-background border-border text-foreground text-sm min-h-[80px] resize-none"
                data-ocid="vendor.textarea"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-teal/40 text-teal hover:bg-teal/5"
                  onClick={handleParseResume}
                  data-ocid="vendor.primary_button"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Parse Resume with AI
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border text-muted-foreground hover:bg-muted/30"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="vendor.upload_button"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Resume (PDF/DOC)
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            {/* Candidate Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-sm">
                  Full Name
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Arjun Sharma"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="vendor.input"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Role</Label>
                <Input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Senior React Developer"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="vendor.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">
                Skills (comma-separated)
              </Label>
              <Input
                required
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js"
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="vendor.input"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-muted-foreground text-sm">
                  Exp (yrs)
                </Label>
                <Input
                  type="number"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  placeholder="5"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="vendor.input"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Rate (\u20b9/mo)
                </Label>
                <Input
                  type="number"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  placeholder="90000"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="vendor.input"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">
                  Location
                </Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Bangalore"
                  className="mt-1 bg-muted/20 border-border text-foreground"
                  data-ocid="vendor.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Brief professional summary..."
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="vendor.textarea"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setAddOpen(false)}
                data-ocid="vendor.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal text-white hover:opacity-90 font-semibold"
                data-ocid="vendor.submit_button"
              >
                Add to Bench
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upgrade Required Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="vendor.modal"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Submission Limit Reached
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              You&apos;ve used all{" "}
              <span className="font-semibold text-foreground">
                3 free submissions
              </span>{" "}
              this month. Upgrade to Vendor Pro for unlimited submissions and
              access to priority matching.
            </p>
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Free tier resets on{" "}
                <span className="font-medium text-foreground">
                  {planStatus.resetDate}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border"
              onClick={() => setUpgradeModalOpen(false)}
              data-ocid="vendor.cancel_button"
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-teal text-white hover:opacity-90 font-semibold"
              onClick={() => {
                setUpgradeModalOpen(false);
                navigate({ to: "/pricing" });
              }}
              data-ocid="vendor.primary_button"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade to Pro \u2192
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
