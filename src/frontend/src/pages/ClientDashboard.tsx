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
  type PlacementTransaction,
  type Requirement,
  createRequirement,
  getAllPlacements,
  getRequirements,
  updatePlacementStatus,
} from "@/lib/db";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

export function ClientDashboard() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [placements, setPlacements] = useState<PlacementTransaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
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
    getAllPlacements().then(setPlacements);
  }, []);

  const pendingReviews = placements.filter((p) => p.status === "submitted");
  const stats = [
    {
      label: "Active Requirements",
      value: requirements.filter((r) => r.status === "active").length,
      icon: Briefcase,
      color: "text-teal",
    },
    {
      label: "Total Submissions",
      value: placements.length,
      icon: Users,
      color: "text-orange",
    },
    {
      label: "In Pipeline",
      value: placements.filter((p) =>
        ["shortlisted", "interview", "offer_extended"].includes(p.status),
      ).length,
      icon: Clock,
      color: "text-teal",
    },
    {
      label: "Successfully Hired",
      value: placements.filter((p) => p.status === "joined").length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  const handleAction = async (
    id: string,
    status: "shortlisted" | "rejected",
  ) => {
    await updatePlacementStatus(id, status);
    getAllPlacements().then(setPlacements);
  };

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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Client Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your IT hiring pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/requirements">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground"
                data-ocid="client.secondary_button"
              >
                <Eye className="h-4 w-4 mr-1" /> Browse Talent
              </Button>
            </Link>
            <Button
              className="bg-teal text-white hover:opacity-90 font-semibold"
              onClick={() => setModalOpen(true)}
              data-ocid="client.primary_button"
            >
              <Plus className="h-4 w-4 mr-2" /> Post Requirement
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-surface rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-3xl font-bold font-display ${s.color}`}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Requirements list */}
          <div className="lg:col-span-2">
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-foreground">
                  My Requirements
                </h2>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Filter className="h-3.5 w-3.5" /> Filter
                </button>
              </div>
              <div className="divide-y divide-border">
                {requirements.map((req, i) => (
                  <button
                    type="button"
                    key={req.id}
                    className="w-full text-left p-5 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate({
                        to: "/requirements/$id",
                        params: { id: req.id },
                      })
                    }
                    data-ocid={`client.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {req.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {req.location} · {req.experience_min}–
                          {req.experience_max} yrs exp
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {req.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        ₹{(req.budget_min / 1000).toFixed(0)}K – ₹
                        {(req.budget_max / 1000).toFixed(0)}K/mo
                      </span>
                      <span className="text-teal font-medium text-xs">
                        {
                          placements.filter((p) => p.requirement_id === req.id)
                            .length
                        }{" "}
                        submissions →
                      </span>
                    </div>
                  </button>
                ))}
                {requirements.length === 0 && (
                  <div
                    className="p-12 text-center text-muted-foreground"
                    data-ocid="client.empty_state"
                  >
                    <p className="text-sm mb-2">No requirements posted yet.</p>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="text-teal text-sm hover:underline"
                    >
                      Post your first requirement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Pending Review
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pendingReviews.length} candidates awaiting review
                </p>
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {pendingReviews.slice(0, 6).map((sub, i) => (
                  <div
                    key={sub.id}
                    className="p-4"
                    data-ocid={`client.row.${i + 1}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-sm flex-shrink-0">
                        {sub.candidate?.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {sub.candidate?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {sub.candidate?.role}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          For: {sub.requirement?.title}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          From: {sub.vendor?.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs bg-teal text-white hover:opacity-90"
                        onClick={() => handleAction(sub.id, "shortlisted")}
                        data-ocid={`client.primary_button.${i + 1}`}
                      >
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs border-border"
                        onClick={() => handleAction(sub.id, "rejected")}
                        data-ocid={`client.secondary_button.${i + 1}`}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingReviews.length === 0 && (
                  <div
                    className="p-8 text-center text-muted-foreground text-sm"
                    data-ocid="client.empty_state"
                  >
                    No pending reviews
                  </div>
                )}
              </div>
            </div>

            <div className="card-surface rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/requirements">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 text-left transition-colors"
                  >
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Browse Requirements
                    </span>
                  </button>
                </Link>
                <Link to="/talent">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 text-left transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Browse Talent Bench
                    </span>
                  </button>
                </Link>
                <Link to="/deal-room">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 text-left transition-colors"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Open Deal Room
                    </span>
                  </button>
                </Link>
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

      {/* Post Requirement Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="bg-card border-border max-w-xl"
          data-ocid="client.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Post New Requirement
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePost} className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-sm">Job Title</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Senior React Developer"
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="client.input"
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">
                Required Skills (comma-separated)
              </Label>
              <Input
                required
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js"
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="client.input"
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
                  data-ocid="client.input"
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
                  data-ocid="client.input"
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
                  data-ocid="client.input"
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
                  data-ocid="client.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Bangalore"
                className="mt-1 bg-muted/20 border-border text-foreground"
                data-ocid="client.input"
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
                data-ocid="client.textarea"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setModalOpen(false)}
                data-ocid="client.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal text-white hover:opacity-90 font-semibold"
                data-ocid="client.submit_button"
              >
                Post Requirement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
