import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type Candidate,
  type Submission,
  createCandidate,
  getCandidates,
  getSubmissions,
} from "@/lib/db";
import { Link } from "@tanstack/react-router";
import { Award, Plus, Target, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STATS = [
  { label: "Bench Strength", value: "9", icon: Users, color: "text-teal" },
  {
    label: "Requirements Matched",
    value: "7",
    icon: Target,
    color: "text-orange",
  },
  {
    label: "Submissions Made",
    value: "5",
    icon: TrendingUp,
    color: "text-teal",
  },
  { label: "Selection Rate", value: "40%", icon: Award, color: "text-orange" },
];

export function VendorDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
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
    Promise.all([getCandidates(), getSubmissions()]).then(([c, s]) => {
      setCandidates(
        c.filter(
          (cand) =>
            cand.vendor_id === "vendor-1" || cand.vendor_id === "vendor-2",
        ),
      );
      setSubmissions(s);
    });
  }, []);

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
    const updated = await getCandidates();
    setCandidates(
      updated.filter(
        (c) => c.vendor_id === "vendor-1" || c.vendor_id === "vendor-2",
      ),
    );
    setModalOpen(false);
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your bench and track submissions
            </p>
          </div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-teal text-background hover:bg-teal-600 font-semibold"
                data-ocid="vendor.open_modal_button"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Candidate
              </Button>
            </DialogTrigger>
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
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Arjun Sharma"
                      className="mt-1 bg-muted/20 border-border text-foreground"
                      data-ocid="vendor.input"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Role
                    </Label>
                    <Input
                      required
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
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
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
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
                      onChange={(e) =>
                        setForm({ ...form, rate: e.target.value })
                      }
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
                    onClick={() => setModalOpen(false)}
                    data-ocid="vendor.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-teal text-background hover:bg-teal-600 font-semibold"
                    data-ocid="vendor.submit_button"
                  >
                    Add to Bench
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-surface rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold font-display ${s.color}`}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              My Bench
            </h2>
            <div className="space-y-2">
              {candidates.map((c, i) => (
                <div
                  key={c.id}
                  className="card-surface rounded-xl p-4"
                  data-ocid={`vendor.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-icon flex items-center justify-center text-teal font-bold text-sm">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">
                          {c.name}
                        </p>
                        {c.is_verified && <VerifiedBadge />}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                      <div className="flex gap-1 mt-1">
                        {c.skills.slice(0, 3).map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                    <StatusBadge status={c.availability} />
                  </div>
                </div>
              ))}
              {candidates.length === 0 && (
                <div
                  className="card-surface rounded-xl p-8 text-center text-muted-foreground"
                  data-ocid="vendor.empty_state"
                >
                  <p className="text-sm">
                    No candidates yet. Add your first bench candidate.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Active Submissions
            </h2>
            <div className="space-y-2">
              {submissions.map((sub, i) => (
                <div
                  key={sub.id}
                  className="card-surface rounded-xl p-4"
                  data-ocid={`vendor.row.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        {sub.candidate?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sub.requirement?.title} — {sub.requirement?.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircularScoreBadge score={sub.match_score} size={40} />
                      <StatusBadge status={sub.status} />
                    </div>
                  </div>
                </div>
              ))}
              {submissions.length === 0 && (
                <div
                  className="card-surface rounded-xl p-8 text-center text-muted-foreground"
                  data-ocid="vendor.empty_state"
                >
                  <p className="text-sm">No active submissions yet.</p>
                </div>
              )}
            </div>
          </div>
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
