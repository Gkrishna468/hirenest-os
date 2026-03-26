import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
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
  type Requirement,
  type Submission,
  createRequirement,
  getRequirements,
  getSubmissions,
} from "@/lib/db";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STATS = [
  {
    label: "Requirements Posted",
    value: "7",
    icon: Briefcase,
    color: "text-teal",
  },
  {
    label: "Candidates Received",
    value: "23",
    icon: Users,
    color: "text-orange",
  },
  { label: "Shortlisted", value: "8", icon: CheckCircle2, color: "text-teal" },
  { label: "Placements", value: "3", icon: TrendingUp, color: "text-orange" },
];

export function CompanyDashboard() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    skills: "",
    budget_min: "",
    budget_max: "",
    location: "",
    experience_min: "",
    experience_max: "",
    description: "",
  });

  useEffect(() => {
    getRequirements().then(setRequirements);
  }, []);

  useEffect(() => {
    if (selectedReq) {
      getSubmissions(selectedReq).then(setSubmissions);
    }
  }, [selectedReq]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequirement({
      title: form.title,
      company: "My Company",
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      budget_min: Number(form.budget_min),
      budget_max: Number(form.budget_max),
      location: form.location,
      experience_min: Number(form.experience_min),
      experience_max: Number(form.experience_max),
      description: form.description,
    });
    setRequirements(await getRequirements());
    setModalOpen(false);
    setForm({
      title: "",
      skills: "",
      budget_min: "",
      budget_max: "",
      location: "",
      experience_min: "",
      experience_max: "",
      description: "",
    });
  };

  const filtered = requirements.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Company Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your IT hiring pipeline
            </p>
          </div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-teal text-background hover:bg-teal-600 font-semibold"
                data-ocid="company.open_modal_button"
              >
                <Plus className="h-4 w-4 mr-2" /> Post Requirement
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-card border-border max-w-xl"
              data-ocid="company.dialog"
            >
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Post New Requirement
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePost} className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Job Title
                  </Label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Senior React Developer"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="company.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Required Skills (comma-separated)
                  </Label>
                  <Input
                    required
                    value={form.skills}
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                    placeholder="React, TypeScript, Node.js"
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="company.input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Budget Min (₹/mo)
                    </Label>
                    <Input
                      type="number"
                      value={form.budget_min}
                      onChange={(e) =>
                        setForm({ ...form, budget_min: e.target.value })
                      }
                      placeholder="80000"
                      className="mt-1 bg-muted/20 border-border text-foreground"
                      data-ocid="company.input"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Budget Max (₹/mo)
                    </Label>
                    <Input
                      type="number"
                      value={form.budget_max}
                      onChange={(e) =>
                        setForm({ ...form, budget_max: e.target.value })
                      }
                      placeholder="120000"
                      className="mt-1 bg-muted/20 border-border text-foreground"
                      data-ocid="company.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Exp Min (yrs)
                    </Label>
                    <Input
                      type="number"
                      value={form.experience_min}
                      onChange={(e) =>
                        setForm({ ...form, experience_min: e.target.value })
                      }
                      placeholder="3"
                      className="mt-1 bg-muted/20 border-border text-foreground"
                      data-ocid="company.input"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      Exp Max (yrs)
                    </Label>
                    <Input
                      type="number"
                      value={form.experience_max}
                      onChange={(e) =>
                        setForm({ ...form, experience_max: e.target.value })
                      }
                      placeholder="8"
                      className="mt-1 bg-muted/20 border-border text-foreground"
                      data-ocid="company.input"
                    />
                  </div>
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
                    data-ocid="company.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Description
                  </Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Job description..."
                    className="mt-1 bg-muted/20 border-border text-foreground"
                    data-ocid="company.textarea"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border"
                    onClick={() => setModalOpen(false)}
                    data-ocid="company.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-teal text-background hover:bg-teal-600 font-semibold"
                    data-ocid="company.submit_button"
                  >
                    Post Requirement
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
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

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-display text-xl font-bold text-foreground">
                Requirements
              </h2>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 h-8 text-xs bg-muted/20 border-border text-foreground"
                  data-ocid="company.search_input"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filtered.map((req, i) => (
                <button
                  type="button"
                  key={req.id}
                  onClick={() =>
                    setSelectedReq(selectedReq === req.id ? null : req.id)
                  }
                  className={`w-full card-surface rounded-xl p-4 text-left transition-colors hover:border-teal/30 ${
                    selectedReq === req.id ? "border-teal/50 bg-teal/5" : ""
                  }`}
                  data-ocid={`company.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {req.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.company}
                      </p>
                      <div className="flex gap-1 mt-1.5">
                        {req.skills.slice(0, 3).map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {selectedReq ? "Candidates Submitted" : "Select a Requirement"}
            </h2>
            {!selectedReq ? (
              <div
                className="card-surface rounded-xl p-8 text-center text-muted-foreground"
                data-ocid="company.empty_state"
              >
                <p className="text-sm">
                  Click a requirement to see submitted candidates
                </p>
              </div>
            ) : submissions.length === 0 ? (
              <div
                className="card-surface rounded-xl p-8 text-center text-muted-foreground"
                data-ocid="company.empty_state"
              >
                <p className="text-sm">No candidates submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions
                  .sort((a, b) => b.match_score - a.match_score)
                  .map((sub, i) => (
                    <div
                      key={sub.id}
                      className="card-surface rounded-xl p-4"
                      data-ocid={`company.row.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-icon flex items-center justify-center text-teal font-bold text-xs">
                          {sub.candidate?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">
                            {sub.candidate?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {sub.candidate?.role}
                          </p>
                        </div>
                        <CircularScoreBadge score={sub.match_score} size={44} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <StatusBadge status={sub.status} />
                        {i === 0 && (
                          <span className="text-xs text-teal font-medium">
                            Top Match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
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
