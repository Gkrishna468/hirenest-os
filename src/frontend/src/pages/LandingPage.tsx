import { CircularScoreBadge } from "@/components/CircularScoreBadge";
import { SkillChip } from "@/components/SkillChip";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  Code2,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 2,
      teal: Math.random() > 0.6,
    }));
    let animId: number;
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(46, 196, 182, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.teal
          ? "rgba(46,196,182,0.8)"
          : "rgba(242,153,74,0.6)";
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
    />
  );
}

const HERO_CARDS = [
  {
    name: "Arjun Sharma",
    role: "Senior React Dev",
    score: 92,
    skills: ["React", "TypeScript", "AWS"],
  },
  {
    name: "Priya Nair",
    role: "DevOps Engineer",
    score: 78,
    skills: ["Kubernetes", "Docker", "CI/CD"],
  },
  {
    name: "Rahul Verma",
    role: "ML Engineer",
    score: 85,
    skills: ["Python", "TensorFlow"],
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "Requirements Marketplace",
    desc: "Public job board with smart filters. Vendors browse open IT requirements and submit candidates directly.",
    color: "text-teal",
  },
  {
    icon: Users,
    title: "Talent Bench",
    desc: "Searchable bench of verified IT professionals ready to deploy. Filtered by skills, experience & availability.",
    color: "text-orange",
  },
  {
    icon: Bot,
    title: "AI Matching Engine",
    desc: "JD vs. resume scoring with match %, skill gap analysis, and Strong/Moderate/Weak recommendation tags.",
    color: "text-teal",
  },
  {
    icon: UserCheck,
    title: "Recruiter Layer",
    desc: "Dedicated human recruiters assist each requirement — our hybrid advantage over pure-marketplace competitors.",
    color: "text-orange",
  },
];

const RECRUITER_FEATURES = [
  {
    icon: Shield,
    text: "Verified vendor & candidate badges for trust signals",
  },
  { icon: TrendingUp, text: "Selection rate tracking & performance analytics" },
  { icon: Code2, text: "Automated skill tagging from resume parsing" },
  { icon: Building2, text: "Dedicated recruiter assigned per requirement" },
];

const TRUST_COMPANIES = [
  "Infosys",
  "TCS",
  "Wipro",
  "HCL Tech",
  "Razorpay",
  "PhonePe",
  "Flipkart",
  "Zomato",
];

const DEMO_REQS = [
  {
    title: "Senior React Developer",
    company: "Infosys Digital",
    skills: ["React", "TypeScript"],
    budget: "₹80K–120K",
    score: 92,
    avgDays: 4.2,
  },
  {
    title: "DevOps Engineer",
    company: "TCS Cloud",
    skills: ["Kubernetes", "AWS"],
    budget: "₹90K–130K",
    score: 78,
    avgDays: 6.1,
  },
  {
    title: "Python ML Engineer",
    company: "Wipro AI Labs",
    skills: ["Python", "TensorFlow"],
    budget: "₹100K–150K",
    score: 85,
    avgDays: 3.8,
  },
];

const FEATURED_TALENT = [
  {
    name: "Arjun Sharma",
    role: "Senior React Dev",
    score: 92,
    skills: ["React", "TypeScript", "AWS"],
    avail: "available",
    verified: true,
  },
  {
    name: "Priya Nair",
    role: "DevOps Engineer",
    score: 78,
    skills: ["Kubernetes", "Docker"],
    avail: "available",
    verified: true,
  },
  {
    name: "Rahul Verma",
    role: "ML Engineer",
    score: 85,
    skills: ["Python", "TensorFlow"],
    avail: "open",
    verified: true,
  },
];

const SCORE_TIERS = [
  { label: "Strong Match", score: 92, color: "text-teal" },
  { label: "Moderate Match", score: 65, color: "text-orange" },
  { label: "Weak Match", score: 32, color: "text-destructive" },
];

const INTEGRATIONS = [
  { name: "SAP SuccessFactors", abbr: "SAP", icon: Building2 },
  { name: "Workday", abbr: "WD", icon: Globe },
  { name: "Greenhouse", abbr: "GH", icon: Target },
  { name: "Lever", abbr: "LV", icon: TrendingUp },
  { name: "BambooHR", abbr: "BHR", icon: Users },
  { name: "Slack", abbr: "Slack", icon: MessageSquare },
  { name: "Jira", abbr: "Jira", icon: Code2 },
  { name: "LinkedIn", abbr: "LI", icon: Briefcase },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "Free",
    priceNote: "No credit card required",
    features: [
      "Browse all requirements",
      "Submit up to 5 candidates/month",
      "Basic AI match scores",
      "Vendor profile page",
    ],
    cta: "Get Started Free",
    popular: false,
    accent: "border-border",
    ctaStyle: "border border-border text-foreground hover:bg-muted",
  },
  {
    name: "Growth",
    price: "Commission",
    priceNote: "% per successful placement",
    features: [
      "Unlimited submissions",
      "Full AI match scores & gaps",
      "Dedicated recruiter support",
      "Priority listing placement",
      "Advanced analytics dashboard",
    ],
    cta: "Start Growing",
    popular: true,
    accent: "border-teal/40 glow-teal",
    ctaStyle: "bg-teal text-background hover:bg-teal/90",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "Tailored to your scale",
    features: [
      "Everything in Growth",
      "White-label option",
      "API & webhook access",
      "ATS / HRIS integration",
      "SLA & compliance support",
    ],
    cta: "Contact Sales",
    popular: false,
    accent: "border-orange/30",
    ctaStyle: "bg-orange text-background hover:bg-orange/90",
  },
];

const COMPLIANCE_BADGES = [
  { icon: Lock, label: "SOC 2 Type II" },
  { icon: ShieldCheck, label: "GDPR Compliant" },
  { icon: Shield, label: "ISO 27001" },
  { icon: Lock, label: "Data Encrypted" },
];

// Animated match bar component
function AnimatedMatchBar() {
  const controls = useAnimation();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
          controls.start({
            width: "92%",
            transition: { duration: 1.2, ease: "easeOut" },
          });
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [controls, inView]);

  return (
    <div ref={ref} className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-teal rounded-full"
        initial={{ width: "0%" }}
        animate={controls}
      />
    </div>
  );
}

// unused import suppression
const _Briefcase = Briefcase;

export function LandingPage() {
  const [activeCard, setActiveCard] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(
      () => setActiveCard((p) => (p + 1) % HERO_CARDS.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="gradient-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0">
          <NetworkGraph />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-sm font-medium">
                <Zap className="h-4 w-4" /> India&apos;s #1 IT Talent Deployment
                Platform
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight">
                Deploy IT Talent <span className="text-teal">10x Faster</span>{" "}
                with AI Matching
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                HireNest OS connects India&apos;s top IT vendors and enterprise
                companies through an AI-powered two-sided marketplace with
                dedicated recruiter support.
              </p>

              {/* Dual CTA path selectors */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/requirements" className="flex-1">
                  <button
                    type="button"
                    className="w-full group flex items-center gap-3 h-auto py-4 px-5 rounded-xl bg-teal/10 border border-teal/30 hover:bg-teal/20 hover:border-teal/50 transition-all"
                    data-ocid="hero.primary_button"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-teal" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        I&apos;m Hiring
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Find Verified IT Talent
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-teal group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/onboarding" className="flex-1">
                  <button
                    type="button"
                    className="w-full group flex items-center gap-3 h-auto py-4 px-5 rounded-xl bg-orange/10 border border-orange/30 hover:bg-orange/20 hover:border-orange/50 transition-all"
                    data-ocid="hero.secondary_button"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange/20 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-orange" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        I&apos;m a Vendor
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submit Your Bench
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    2,400+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Verified Candidates
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">380+</div>
                  <div className="text-xs text-muted-foreground">
                    Active Vendors
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">94%</div>
                  <div className="text-xs text-muted-foreground">
                    Placement Rate
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative flex flex-col gap-4"
            >
              {HERO_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  animate={{
                    opacity: activeCard === i ? 1 : 0.5,
                    scale: activeCard === i ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.4 }}
                  className="card-surface rounded-xl p-4 flex items-center gap-4 relative"
                  style={{
                    boxShadow:
                      activeCard === i
                        ? "0 0 20px oklch(0.74 0.12 186 / 0.15)"
                        : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="w-10 h-10 rounded-full bg-icon flex items-center justify-center text-teal font-bold text-sm">
                    {card.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {card.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.role}</p>
                    <div className="flex gap-1 mt-1">
                      {card.skills.map((s) => (
                        <SkillChip key={s} skill={s} />
                      ))}
                    </div>
                  </div>
                  <CircularScoreBadge score={card.score} size={56} />
                  <AnimatePresence>
                    {hoveredCard === i && activeCard === i && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-4 bottom-2 text-xs bg-teal text-background px-3 py-1 rounded-full font-semibold hover:bg-teal/80"
                        onClick={() =>
                          toast.success(
                            `Demo: Hiring request sent to ${card.name}'s vendor!`,
                          )
                        }
                        data-ocid="hero.primary_button"
                      >
                        Hire →
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <div className="card-surface rounded-xl p-4 border-teal/20 glow-teal">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-5 w-5 text-teal" />
                  <span className="text-sm font-semibold text-foreground">
                    AI Match Analysis
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Senior React Dev requirement → Arjun Sharma
                </p>
                <div className="mt-2 flex gap-2">
                  {["React", "TypeScript", "AWS"].map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-teal/10 text-teal border border-teal/20 px-2 py-1 rounded"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
                <AnimatedMatchBar />
                <motion.p
                  animate={{
                    textShadow: [
                      "0 0 0px oklch(0.74 0.12 186 / 0)",
                      "0 0 8px oklch(0.74 0.12 186 / 0.6)",
                      "0 0 0px oklch(0.74 0.12 186 / 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="text-right text-xs text-teal mt-1 font-semibold"
                >
                  92% Match — Strong
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Key Platform Features
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Everything you need to source, match, and deploy IT talent at
              scale
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="card-surface rounded-xl p-5 space-y-3 hover:border-teal/30 transition-colors"
              >
                <div className="w-10 h-10 bg-icon rounded-lg flex items-center justify-center">
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Layer */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm font-medium mb-4">
                <Star className="h-4 w-4" /> Our USP
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                The Recruiter Layer:
                <br />
                <span className="text-orange">Enhanced Hiring</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Unlike pure marketplaces, HireNest OS adds a dedicated human
                recruiter to every requirement. AI handles matching — humans
                handle nuance.
              </p>
              {/* 2-col grid on mobile, list on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RECRUITER_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-icon rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="h-4 w-4 text-teal" />
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {DEMO_REQS.map((req) => (
                <div
                  key={req.title}
                  className="card-surface rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {req.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.company}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                      {req.skills.map((s) => (
                        <SkillChip key={s} skill={s} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {req.budget}
                      </span>
                      <span className="text-xs text-teal font-medium ml-1">
                        ⚡ Avg {req.avgDays} days
                      </span>
                    </div>
                  </div>
                  <CircularScoreBadge score={req.score} size={52} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium uppercase tracking-widest">
            Trusted By India&apos;s Top Firms
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {TRUST_COMPANIES.map((name) => (
              <div
                key={name}
                className="px-4 py-2 card-surface rounded-lg text-sm text-muted-foreground font-medium opacity-60 hover:opacity-100 transition-opacity"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-1">
              Works with your existing stack
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((intg, i) => (
              <motion.div
                key={intg.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 card-surface rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-teal/30 transition-all cursor-default"
              >
                <intg.icon className="h-3.5 w-3.5 text-teal" />
                {intg.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured talent + requirements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Featured Talent
                </h2>
                <Link
                  to="/talent"
                  className="text-sm text-teal hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {FEATURED_TALENT.map((c, idx) => (
                  <div
                    key={c.name}
                    className="card-surface rounded-xl p-4 flex items-center gap-4"
                    data-ocid={`talent.item.${idx + 1}`}
                  >
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
                        {c.verified && (
                          <span className="text-xs text-teal">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                      <div className="flex gap-1 mt-1">
                        {c.skills.map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <CircularScoreBadge score={c.score} size={48} />
                      <StatusBadge status={c.avail} />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs border-teal/30 text-teal hover:bg-teal/10"
                        onClick={() =>
                          toast.success(
                            `Demo: Shortlisting ${c.name} for interview`,
                          )
                        }
                        data-ocid={`talent.edit_button.${idx + 1}`}
                      >
                        Hire
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Recent Requirements
                </h2>
                <Link
                  to="/requirements"
                  className="text-sm text-teal hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {DEMO_REQS.map((req, idx) => (
                  <div
                    key={req.title}
                    className="card-surface rounded-xl p-4"
                    data-ocid={`requirements.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {req.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.company}
                        </p>
                        <div className="flex gap-1 mt-1.5">
                          {req.skills.map((s) => (
                            <SkillChip key={s} skill={s} />
                          ))}
                        </div>
                      </div>
                      <CircularScoreBadge score={req.score} size={48} />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-orange font-medium">
                        {req.budget}/mo
                      </p>
                      <span className="text-xs text-teal font-medium">
                        ⚡ Avg {req.avgDays} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Match banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-surface rounded-2xl p-10 glow-teal text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-teal/5" />
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-icon rounded-2xl flex items-center justify-center">
                  <Bot className="h-8 w-8 text-teal" />
                </div>
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
                AI Match Scoring{" "}
                <span className="text-teal">— Your Secret Weapon</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Our engine compares JD requirements against candidate profiles
                to produce a match score, skill gap breakdown, and actionable
                recommendation tag.
              </p>
              <div className="flex justify-center gap-6 mb-8">
                {SCORE_TIERS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <CircularScoreBadge score={s.score} size={80} />
                    <span className={`text-xs font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Link to="/requirements">
                <Button
                  className="bg-teal text-background hover:bg-teal-600 font-semibold h-11 px-8"
                  data-ocid="aibanner.primary_button"
                >
                  Try AI Matching <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mt-3">
              Start free, scale as you grow
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`card-surface rounded-2xl p-6 border relative flex flex-col ${
                  plan.popular ? "border-teal/40 glow-teal" : "border-border"
                }`}
                data-ocid={`pricing.card.${i + 1}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal text-background text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-lg text-foreground">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.priceNote}
                  </p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-teal mt-0.5 flex-shrink-0">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/onboarding">
                  <Button
                    className={`w-full ${plan.ctaStyle}`}
                    variant={plan.popular ? "default" : "outline"}
                    data-ocid={`pricing.primary_button.${i + 1}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Compliance badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {COMPLIANCE_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground"
              >
                <badge.icon className="h-3.5 w-3.5" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
