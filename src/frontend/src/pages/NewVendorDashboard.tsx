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
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const PIPELINE_STAGES = [
  "submitted",
  "shortlisted",
  "interview",
  "offer_extended",
  "joined",
];
const _STAGE_LABELS = [
  "Submitted",
  "Shortlisted",
  "Interview",
  "Offer",
  "Joined",
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
              {active && !isCurrent ? "✓" : idx + 1}
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

export function NewVendorDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [submissions, setSubmissions] = useState<PlacementTransaction[]>([]);
  const [inquiries, setInquiries] = useState<VendorInquiry[]>([]);
  const [addOpen, setAddOpen] = useState(false);
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
    getPlacementsByVendor("vendor-1").then(setSubmissions);
    getVendorInquiries("vendor-1").then(setInquiries);
  }, []);

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
      vendor_id: "vendor-1",
    });
    getCandidates().then((all) =>
      setCandidates(
        all.filter(
          (c) => c.vendor_id === "vendor-1" || c.vendor_id === "vendor-2",
        ),
      ),
    );
    setAddOpen(false);
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
    getVendorInquiries("vendor-1").then(setInquiries);
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
                ₹{totalEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Pending Payout</p>
              <p className="text-3xl font-bold font-display text-yellow-200">
                ₹{pendingPayout.toLocaleString("en-IN")}
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

          {/* Main content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Submissions Pipeline */}
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-foreground">
                  My Submissions Pipeline
                </h2>
                <Link
                  to="/requirements"
                  className="text-sm text-teal hover:underline"
                >
                  Browse requirements →
                </Link>
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
                              ₹{sub.vendor_payout?.toLocaleString("en-IN")}{" "}
                              earned
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sub.candidate?.role} ·{" "}
                          {sub.candidate?.skills?.slice(0, 3).join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          For:{" "}
                          <span className="font-medium text-foreground">
                            {sub.requirement?.title}
                          </span>{" "}
                          — {sub.requirement?.company}
                        </p>
                        <PipelineTracker status={sub.status} />
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-foreground">
                          ₹
                          {sub.requirement?.budget_max?.toLocaleString("en-IN")}
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
            </div>

            {/* My Bench */}
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
                        ₹{(cand.rate / 1000).toFixed(0)}K/mo
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
          </div>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <Link to="/" className="text-teal hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Add Candidate Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="bg-card border-border max-w-xl"
          data-ocid="vendor.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Add Bench Candidate
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-3">
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
                  Rate (₹/mo)
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
    </div>
  );
}
