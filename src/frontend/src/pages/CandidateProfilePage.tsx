import { SkillChip } from "@/components/SkillChip";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type Candidate, getRequirements } from "@/lib/db";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Building2,
  Download,
  MapPin,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Static candidates data (sync-safe for profile lookup)
const STATIC_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Arjun Sharma",
    role: "Senior React Developer",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Redux"],
    experience: 6,
    rate: 95000,
    availability: "available",
    is_verified: true,
    location: "Bangalore",
    bio: "Ex-Swiggy frontend lead. Built consumer apps serving 20M+ daily users.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-2",
    name: "Priya Nair",
    role: "DevOps / Cloud Engineer",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Python"],
    experience: 5,
    rate: 105000,
    availability: "available",
    is_verified: true,
    location: "Hyderabad",
    bio: "AWS certified solutions architect with strong Kubernetes and GitOps experience.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-3",
    name: "Rahul Verma",
    role: "Python ML Engineer",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL", "Docker"],
    experience: 7,
    rate: 130000,
    availability: "open",
    is_verified: true,
    location: "Pune",
    bio: "ML researcher turned engineer. Deployed models at scale for Flipkart's recommendation system.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-4",
    name: "Sneha Kulkarni",
    role: "Java Microservices Developer",
    skills: [
      "Java",
      "Spring Boot",
      "Kafka",
      "Microservices",
      "PostgreSQL",
      "Redis",
    ],
    experience: 8,
    rate: 140000,
    availability: "available",
    is_verified: false,
    location: "Chennai",
    bio: "10+ years Java experience, specialized in high-throughput fintech systems at HDFC Bank IT.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-5",
    name: "Mohammed Irfan",
    role: "Full Stack Developer",
    skills: ["Node.js", "React", "MongoDB", "Redis", "TypeScript", "GraphQL"],
    experience: 4,
    rate: 88000,
    availability: "available",
    is_verified: true,
    location: "Bangalore",
    bio: "Full-stack developer with strong Node.js backend skills and React frontend experience.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-6",
    name: "Deepika Reddy",
    role: "Android Developer",
    skills: [
      "Android",
      "Kotlin",
      "Jetpack Compose",
      "Firebase",
      "REST APIs",
      "MVVM",
    ],
    experience: 5,
    rate: 95000,
    availability: "busy",
    is_verified: true,
    location: "Bangalore",
    bio: "Built Paytm's core payment flow UI. Jetpack Compose expert with 3M+ DAU app experience.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-7",
    name: "Vikram Anand",
    role: "Data Engineer",
    skills: ["Spark", "Python", "Airflow", "BigQuery", "Kafka", "DBT"],
    experience: 6,
    rate: 115000,
    availability: "open",
    is_verified: false,
    location: "Bangalore",
    bio: "Built Meesho's data platform from scratch. Experienced in streaming and batch data pipelines.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-8",
    name: "Ananya Iyer",
    role: "Frontend Engineer",
    skills: ["React", "Vue.js", "TypeScript", "CSS", "Figma"],
    experience: 3,
    rate: 72000,
    availability: "available",
    is_verified: false,
    location: "Mumbai",
    bio: "Frontend specialist with an eye for pixel-perfect UIs and design system expertise.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-9",
    name: "Rohan Gupta",
    role: "Backend / API Developer",
    skills: ["Go", "gRPC", "PostgreSQL", "Redis", "Docker", "AWS"],
    experience: 5,
    rate: 110000,
    availability: "available",
    is_verified: true,
    location: "Delhi NCR",
    bio: "Go backend engineer from Ola Engineering. Built ride-matching service handling 100K RPS.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function generateAISummary(candidate: {
  name: string;
  role: string;
  skills: string[];
  experience: number;
  bio: string;
}) {
  const { name, role, skills, experience, bio } = candidate;
  const topSkills = skills.slice(0, 3).join(", ");
  const firstName = name.split(" ")[0];
  return `${firstName} is a ${role} with ${experience} years of professional experience specializing in ${topSkills}. ${bio} With a proven track record in enterprise software delivery, ${firstName} brings strong technical depth and collaborative skills that make them an excellent fit for high-performance engineering teams. Their breadth of experience across full-stack and cloud environments positions them well for senior individual contributor or team lead roles.`;
}

const WORK_HISTORY: Record<
  string,
  { role: string; company: string; duration: string; description: string }[]
> = {
  "cand-1": [
    {
      role: "Senior Frontend Lead",
      company: "Swiggy",
      duration: "2021 – Present",
      description:
        "Led frontend engineering for consumer apps serving 20M+ daily active users. Migrated monolith to micro-frontends.",
    },
    {
      role: "React Developer",
      company: "Infosys",
      duration: "2019 – 2021",
      description:
        "Built enterprise banking portals using React and GraphQL. Improved page load time by 40%.",
    },
    {
      role: "Junior Developer",
      company: "Wipro",
      duration: "2018 – 2019",
      description:
        "Developed internal tools with React and Node.js for HR management.",
    },
  ],
  "cand-2": [
    {
      role: "Cloud Infrastructure Lead",
      company: "Amazon Web Services",
      duration: "2022 – Present",
      description:
        "Architected multi-region Kubernetes clusters on EKS serving 99.99% SLA for enterprise clients.",
    },
    {
      role: "DevOps Engineer",
      company: "TCS",
      duration: "2019 – 2022",
      description:
        "Implemented GitOps pipelines with Terraform and ArgoCD for 50+ microservices.",
    },
    {
      role: "Systems Engineer",
      company: "Mphasis",
      duration: "2018 – 2019",
      description:
        "Managed CI/CD pipelines using Jenkins and Docker for banking applications.",
    },
  ],
  "cand-3": [
    {
      role: "Senior ML Engineer",
      company: "Flipkart",
      duration: "2020 – Present",
      description:
        "Deployed recommendation models serving 500M+ product impressions per day.",
    },
    {
      role: "ML Researcher",
      company: "IIT Bombay AI Lab",
      duration: "2018 – 2020",
      description:
        "Published 2 papers on deep learning for NLP. Worked on transformer architectures.",
    },
    {
      role: "Data Scientist",
      company: "Capgemini",
      duration: "2017 – 2018",
      description:
        "Built predictive analytics models for retail clients using Python and SQL.",
    },
  ],
};

const DEFAULT_WORK_HISTORY = (role: string) => [
  {
    role: role,
    company: "TCS Digital",
    duration: "2021 – Present",
    description: `Working as ${role} building enterprise-grade applications for global clients.`,
  },
  {
    role: "Software Engineer",
    company: "Wipro Technologies",
    duration: "2019 – 2021",
    description:
      "Developed full-stack features for e-commerce platforms using modern web technologies.",
  },
  {
    role: "Associate Developer",
    company: "Infosys BPM",
    duration: "2018 – 2019",
    description:
      "Started career building internal tooling and automating business workflows.",
  },
];

export function CandidateProfilePage() {
  const { candidateId } = useParams({ strict: false }) as {
    candidateId: string;
  };
  const navigate = useNavigate();
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState("");
  const [requirements, setRequirements] = useState<
    { id: string; title: string; company: string }[]
  >([]);

  useEffect(() => {
    getRequirements().then((reqs) =>
      setRequirements(
        reqs.map((r) => ({ id: r.id, title: r.title, company: r.company })),
      ),
    );
  }, []);

  const candidate = STATIC_CANDIDATES.find((c) => c.id === candidateId);

  if (!candidate) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        data-ocid="candidate_profile.error_state"
      >
        <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Candidate Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This candidate profile doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => navigate({ to: "/talent" })}
          data-ocid="candidate_profile.secondary_button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Talent Bench
        </Button>
      </div>
    );
  }

  const workHistory =
    WORK_HISTORY[candidate.id] || DEFAULT_WORK_HISTORY(candidate.role);
  const aiSummary = generateAISummary(candidate);

  const availabilityColors: Record<string, string> = {
    available: "bg-green-100 text-green-700 border-green-200",
    open: "bg-blue-100 text-blue-700 border-blue-200",
    busy: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 space-y-6"
      data-ocid="candidate_profile.page"
    >
      <button
        type="button"
        onClick={() => navigate({ to: "/talent" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="candidate_profile.link"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Talent Bench
      </button>

      {/* Hero Section */}
      <div className="card-surface rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-icon flex items-center justify-center text-teal font-bold text-2xl flex-shrink-0">
            {getInitials(candidate.name)}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    {candidate.name}
                  </h1>
                  {candidate.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-lg text-muted-foreground mt-1">
                  {candidate.role}
                </p>
              </div>
              <Badge
                className={`border text-sm px-3 py-1 font-medium capitalize ${availabilityColors[candidate.availability]}`}
              >
                {candidate.availability}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-teal" />
                {candidate.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-teal" />
                {candidate.experience} years experience
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-teal" />
                Remote / Hybrid
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              ₹{(candidate.rate / 1000).toFixed(0)}K / month
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="card-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <SkillChip key={s} skill={s} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal" /> Work History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {workHistory.map((job, idx) => (
                  <div
                    key={job.company + job.role}
                    className="relative flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-teal border-2 border-background mt-1.5 flex-shrink-0" />
                      {idx < workHistory.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-foreground text-sm">
                        {job.role}
                      </p>
                      <p className="text-xs text-teal font-medium">
                        {job.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.duration}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {job.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs text-foreground space-y-2 border border-border">
                <p className="font-bold text-base font-sans">
                  {candidate.name.toUpperCase()}
                </p>
                <p className="text-muted-foreground">
                  {candidate.role} • {candidate.location} •{" "}
                  {candidate.experience} years
                </p>
                <Separator className="my-2" />
                <p className="font-semibold font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  SUMMARY
                </p>
                <p className="leading-relaxed">{candidate.bio}</p>
                <Separator className="my-2" />
                <p className="font-semibold font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  SKILLS
                </p>
                <p>{candidate.skills.join(" • ")}</p>
                <Separator className="my-2" />
                <p className="font-semibold font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  EXPERIENCE
                </p>
                {workHistory.slice(0, 2).map((job) => (
                  <div key={job.company + job.role}>
                    <p className="font-semibold font-sans">
                      {job.role} — {job.company}
                    </p>
                    <p className="text-muted-foreground">{job.duration}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-surface border-teal/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal" /> AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                {aiSummary}
              </p>
            </CardContent>
          </Card>

          <Card className="card-surface border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-teal text-background hover:bg-teal-600 font-semibold"
                onClick={() => setSubmitOpen(true)}
                data-ocid="candidate_profile.primary_button"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Submit to Requirement
              </Button>
              <Button
                variant="outline"
                className="w-full border-border"
                onClick={() =>
                  toast.success(`${candidate.name} added to your bench`)
                }
                data-ocid="candidate_profile.secondary_button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Bench
              </Button>
              <Button
                variant="outline"
                className="w-full border-border"
                onClick={() => toast.info("Resume download started")}
                data-ocid="candidate_profile.secondary_button"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </CardContent>
          </Card>

          <Card className="card-surface border-border">
            <CardContent className="pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-semibold text-foreground">
                  ₹{(candidate.rate / 1000).toFixed(0)}K/mo
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-semibold text-foreground">
                  {candidate.experience} years
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendor ID</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {candidate.vendor_id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Listed</span>
                <span className="text-foreground">
                  {new Date(candidate.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit to Requirement Dialog */}
      <Dialog
        open={submitOpen}
        onOpenChange={(o) => {
          if (!o) setSubmitOpen(false);
        }}
      >
        <DialogContent
          className="max-w-md"
          data-ocid="candidate_profile.dialog"
        >
          <DialogHeader>
            <DialogTitle>Submit {candidate.name} to a Requirement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={selectedReqId} onValueChange={setSelectedReqId}>
              <SelectTrigger
                className="bg-muted/30 border-border"
                data-ocid="candidate_profile.select"
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
            <Button
              className="w-full bg-teal text-background hover:bg-teal-600 font-semibold"
              disabled={!selectedReqId}
              onClick={() => {
                toast.success(
                  `${candidate.name} submitted successfully! Client will be notified.`,
                );
                setSubmitOpen(false);
                setSelectedReqId("");
              }}
              data-ocid="candidate_profile.submit_button"
            >
              Submit Candidate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
