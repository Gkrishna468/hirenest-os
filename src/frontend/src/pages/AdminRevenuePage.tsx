import { AdminLockScreen } from "@/components/AdminLockScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  approveMatch,
  getDisputes,
  getInvoices,
  getMatchQueue,
  getPayouts,
  resolveDispute,
} from "@/lib/adminDb";
import type {
  CommissionRow,
  DisputeRow,
  MatchQueueItem,
  PayoutRow,
} from "@/lib/adminDb";
import { isSupabaseConnected } from "@/lib/supabase";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeIndianRupee,
  Briefcase,
  Calculator,
  FileText,
  GitBranch,
  Layers,
  Lock,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MONTHLY_TREND = [
  { month: "Oct 2025", revenue: "₹8.2L", placements: 24, growth: "+12%" },
  { month: "Nov 2025", revenue: "₹9.1L", placements: 27, growth: "+11%" },
  { month: "Dec 2025", revenue: "₹8.7L", placements: 25, growth: "-4%" },
  { month: "Jan 2026", revenue: "₹10.4L", placements: 30, growth: "+20%" },
  { month: "Feb 2026", revenue: "₹11.8L", placements: 33, growth: "+13%" },
  { month: "Mar 2026", revenue: "₹12.4L", placements: 34, growth: "+5%" },
];

const REVENUE_STREAMS = [
  {
    stream: "Placement Commission",
    pct: 60,
    amount: "₹7.44L",
    color: "bg-sky-500",
  },
  {
    stream: "Subscription Fees",
    pct: 20,
    amount: "₹2.48L",
    color: "bg-cyan-500",
  },
  {
    stream: "Featured Listings",
    pct: 10,
    amount: "₹1.24L",
    color: "bg-blue-400",
  },
  {
    stream: "Priority Matching",
    pct: 5,
    amount: "₹0.62L",
    color: "bg-indigo-400",
  },
  {
    stream: "Recruiter Services",
    pct: 5,
    amount: "₹0.62L",
    color: "bg-violet-400",
  },
];

const STAGES = ["submitted", "shortlisted", "interview", "offer", "joined"];

const STAGE_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  interview: "bg-purple-100 text-purple-700 border-purple-200",
  offer: "bg-orange-100 text-orange-700 border-orange-200",
  joined: "bg-green-100 text-green-700 border-green-200",
};

const INITIAL_PIPELINE = [
  {
    id: "p1",
    candidate: "Arjun Sharma",
    requirement: "Senior React Dev — Infosys",
    vendor: "TechVault Solutions",
    stage: "submitted",
    budget: 200000,
  },
  {
    id: "p2",
    candidate: "Priya Nair",
    requirement: "DevOps Engineer — TCS",
    vendor: "CloudForce India",
    stage: "shortlisted",
    budget: 180000,
  },
  {
    id: "p3",
    candidate: "Rahul Verma",
    requirement: "Python ML Engineer — Wipro",
    vendor: "DataMinds Pvt",
    stage: "interview",
    budget: 220000,
  },
  {
    id: "p4",
    candidate: "Sneha Patel",
    requirement: "Node.js Backend Dev — HCL",
    vendor: "TechVault Solutions",
    stage: "offer",
    budget: 160000,
  },
  {
    id: "p5",
    candidate: "Vikram Singh",
    requirement: "Java Architect — Accenture",
    vendor: "SoftBridge Corp",
    stage: "joined",
    budget: 300000,
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: "tx1",
    candidate: "Vikram Singh",
    vendor: "SoftBridge Corp",
    client: "Accenture",
    status: "joined",
    budget: 300000,
    commission: 45000,
    clientPayment: "received",
    vendorPayout: "pending",
  },
  {
    id: "tx2",
    candidate: "Deepa Krishnan",
    vendor: "DataMinds Pvt",
    client: "Wipro AI",
    status: "offer_extended",
    budget: 220000,
    commission: 33000,
    clientPayment: "pending",
    vendorPayout: "pending",
  },
  {
    id: "tx3",
    candidate: "Ankit Mehta",
    vendor: "CloudForce India",
    client: "TCS Cloud",
    status: "joined",
    budget: 180000,
    commission: 27000,
    clientPayment: "invoiced",
    vendorPayout: "processed",
  },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Invoiced: "bg-sky-100 text-sky-700 border-sky-200",
    invoiced: "bg-sky-100 text-sky-700 border-sky-200",
    Paid: "bg-green-100 text-green-700 border-green-200",
    received: "bg-green-100 text-green-700 border-green-200",
    processed: "bg-green-100 text-green-700 border-green-200",
    joined: "bg-green-100 text-green-700 border-green-200",
    offer_extended: "bg-orange-100 text-orange-700 border-orange-200",
    Processing: "bg-orange-100 text-orange-700 border-orange-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    Open: "bg-red-100 text-red-700 border-red-200",
    "Pending AI Review": "bg-purple-100 text-purple-700 border-purple-200",
    Approved: "bg-green-100 text-green-700 border-green-200",
    Resolved: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        map[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-100 text-green-700 border-green-200"
      : score >= 80
        ? "bg-sky-100 text-sky-700 border-sky-200"
        : "bg-yellow-100 text-yellow-700 border-yellow-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}
    >
      {score}% match
    </span>
  );
}

function KpiCard({
  icon,
  label,
  value,
  trend,
  trendColor,
  action,
  onAction,
  ocid,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
  action?: string;
  onAction?: () => void;
  ocid: string;
  loading?: boolean;
}) {
  return (
    <Card className="bg-card border-border" data-ocid={ocid}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-icon flex items-center justify-center text-teal">
            {icon}
          </div>
          {trend && (
            <span
              className={`text-xs font-semibold flex items-center gap-0.5 ${trendColor}`}
            >
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground font-display">
            {value}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {action && (
          <Button
            size="sm"
            variant="outline"
            className="mt-3 text-xs h-7 border-border"
            onClick={onAction}
            data-ocid={`${ocid}.button`}
          >
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function CommissionCalculator() {
  const [budget, setBudget] = useState("");
  const budgetNum = Number.parseFloat(budget.replace(/[^0-9.]/g, "")) || 0;
  const commission = budgetNum * 0.15;
  const vendorPayout = budgetNum * 0.85;
  const fmt = (n: number) =>
    n > 0 ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—";

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calculator className="h-4 w-4 text-teal" />
          Commission Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="budget" className="text-xs text-muted-foreground">
            Client Budget (₹)
          </Label>
          <Input
            id="budget"
            type="number"
            placeholder="e.g. 200000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-background border-input"
            data-ocid="revenue.calculator.input"
          />
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Client Pays</span>
            <span className="font-semibold text-foreground">
              {fmt(budgetNum)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Commission (15%)</span>
            <span className="font-semibold text-green-600">
              {fmt(commission)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-2">
            <span className="text-muted-foreground">Vendor Gets</span>
            <span className="font-semibold text-blue-600">
              {fmt(vendorPayout)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminRevenuePage() {
  const {
    isAuthenticated,
    input,
    setInput,
    error,
    setError,
    inputRef,
    handleUnlock,
    handleLock,
  } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <AdminLockScreen
        input={input}
        setInput={setInput}
        error={error}
        setError={setError}
        inputRef={inputRef}
        onUnlock={handleUnlock}
      />
    );
  }

  return <AdminRevenueContent onLock={handleLock} />;
}

function AdminRevenueContent({ onLock }: { onLock: () => void }) {
  const handleLock = onLock;
  const [matchQueue, setMatchQueue] = useState<MatchQueueItem[]>([]);
  const [invoices, setInvoices] = useState<CommissionRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [disputes, setDisputes] = useState<DisputeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState(INITIAL_PIPELINE);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [mq, inv, pay, disp] = await Promise.all([
        getMatchQueue(),
        getInvoices(),
        getPayouts(),
        getDisputes(),
      ]);
      setMatchQueue(mq);
      setInvoices(inv);
      setPayouts(pay);
      setDisputes(disp);
      setLoading(false);
    };
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await approveMatch(id);
    setMatchQueue((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Approved" } : m)),
    );
    toast.success(`Match ${id} approved and sent to client.`);
  };

  const handleOverride = (id: string) => {
    toast(`Match ${id} flagged for manual review.`, { icon: "🔍" });
  };

  const handleResolveDispute = async (id: string) => {
    await resolveDispute(id);
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Resolved" } : d)),
    );
    toast.success(`Dispute ${id} marked as resolved.`);
  };

  const advancePipelineStage = (id: string) => {
    setPipeline((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = STAGES.indexOf(p.stage);
        const next = idx < STAGES.length - 1 ? STAGES[idx + 1] : p.stage;
        if (next === "joined") {
          toast.success(
            `Marked as Joined! Commission: ₹${(p.budget * 0.15).toLocaleString("en-IN")}`,
          );
        } else {
          toast.success(`${p.candidate} advanced to ${next}`);
        }
        return { ...p, stage: next };
      }),
    );
  };

  const rejectPipelineItem = (id: string) => {
    const name = pipeline.find((p) => p.id === id)?.candidate;
    setPipeline((prev) => prev.filter((p) => p.id !== id));
    toast.error(`${name} removed from pipeline`);
  };

  const markTxJoined = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        toast.success(
          `Marked as Joined! Commission: ₹${t.commission.toLocaleString("en-IN")}`,
        );
        return { ...t, status: "joined" };
      }),
    );
  };

  const markClientPaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, clientPayment: "received" } : t)),
    );
    toast.success("Client payment recorded.");
  };

  const markVendorPaid = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, vendorPayout: "processed" } : t)),
    );
    toast.success("Vendor payout processed.");
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="revenue.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2 justify-between">
          <div className="w-10 h-10 rounded-xl bg-icon flex items-center justify-center text-teal">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground font-display">
                Admin Revenue Center
              </h1>
              {isSupabaseConnected ? (
                <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">
                  Live Supabase
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs">
                  Demo Data
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time monetization &amp; coordination overview
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLock}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="revenue.secondary_button"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        data-ocid="revenue.panel"
      >
        <KpiCard
          icon={<BadgeIndianRupee className="h-5 w-5" />}
          label="Month-to-date revenue"
          value="₹12.4L"
          trend="+23% vs last month"
          trendColor="text-green-600"
          ocid="revenue.kpi.1"
          loading={loading}
        />
        <KpiCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Active placements"
          value="34"
          trend="+5 this week"
          trendColor="text-green-600"
          ocid="revenue.kpi.2"
          loading={loading}
        />
        <KpiCard
          icon={<FileText className="h-5 w-5" />}
          label="Pending invoices"
          value="₹3.2L"
          action="Send Reminders"
          onAction={() =>
            toast.success("Reminder emails sent to all pending clients.")
          }
          ocid="revenue.kpi.3"
          loading={loading}
        />
        <KpiCard
          icon={<Wallet className="h-5 w-5" />}
          label="Vendor payouts due"
          value="₹8.1L"
          action="Process Payouts"
          onAction={() => toast.success("Payout batch queued for processing.")}
          ocid="revenue.kpi.4"
          loading={loading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="revenue" data-ocid="revenue.tab">
          <TabsList className="mb-6 bg-card border border-border flex-wrap h-auto gap-1">
            <TabsTrigger
              value="revenue"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="revenue.tab"
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Revenue
            </TabsTrigger>
            <TabsTrigger
              value="matchmaking"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="revenue.tab"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Matchmaking
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="revenue.tab"
            >
              <GitBranch className="h-3.5 w-3.5 mr-1.5" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="revenue.tab"
            >
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="financials"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="revenue.tab"
            >
              <BadgeIndianRupee className="h-3.5 w-3.5 mr-1.5" />
              Financials
            </TabsTrigger>
            <TabsTrigger
              value="escalation"
              className="data-[state=active]:bg-red-100 data-[state=active]:text-red-600"
              data-ocid="revenue.tab"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              Escalation
            </TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {REVENUE_STREAMS.map((s, i) => (
                    <div key={s.stream} data-ocid={`revenue.item.${i + 1}`}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{s.stream}</span>
                        <span className="text-muted-foreground font-medium">
                          {s.amount} ({s.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <CommissionCalculator />
            </div>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Placements</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MONTHLY_TREND.map((row, i) => (
                      <TableRow
                        key={row.month}
                        className="border-border"
                        data-ocid={`revenue.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          {row.month}
                        </TableCell>
                        <TableCell className="text-teal font-semibold">
                          {row.revenue}
                        </TableCell>
                        <TableCell>{row.placements}</TableCell>
                        <TableCell>
                          <span
                            className={
                              row.growth.startsWith("+")
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {row.growth}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matchmaking Tab */}
          <TabsContent value="matchmaking" className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground">
              <Layers className="h-4 w-4 flex-shrink-0 text-teal" />
              AI suggests matches with ~80% accuracy. Manual review improves
              quality and client satisfaction.
            </div>
            {loading ? (
              <div className="space-y-3" data-ocid="revenue.loading_state">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-3 w-32 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {matchQueue.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card
                      className="bg-card border-border hover:border-teal/30 transition-colors"
                      data-ocid={`revenue.item.${i + 1}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-semibold text-sm text-foreground">
                                {m.requirement}
                              </span>
                              <ScoreBadge score={m.score} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <Users className="inline h-3 w-3 mr-1" />
                              {m.candidate} &middot;{" "}
                              <span className="font-medium">{m.vendor}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusPill status={m.status} />
                            {m.status === "Approved" ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Approved
                              </Badge>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-teal text-white hover:opacity-90"
                                  onClick={() => handleApprove(m.id)}
                                  data-ocid={`revenue.confirm_button.${i + 1}`}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs border-border"
                                  onClick={() => handleOverride(m.id)}
                                  data-ocid={`revenue.edit_button.${i + 1}`}
                                >
                                  Override
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-teal" />
                  Placement Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Candidate</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pipeline.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="revenue.empty_state"
                          >
                            No active placements in pipeline
                          </TableCell>
                        </TableRow>
                      ) : (
                        pipeline.map((p, i) => (
                          <TableRow
                            key={p.id}
                            className="border-border"
                            data-ocid={`revenue.row.${i + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {p.candidate}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                              {p.requirement}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {p.vendor}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STAGE_COLORS[p.stage] ?? "bg-muted text-muted-foreground"}`}
                              >
                                {p.stage}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium">
                              ₹{p.budget.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1.5">
                                {p.stage !== "joined" && (
                                  <Button
                                    size="sm"
                                    className={`h-6 text-xs ${
                                      p.stage === "offer"
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-teal text-white hover:opacity-90"
                                    }`}
                                    onClick={() => advancePipelineStage(p.id)}
                                    data-ocid={`revenue.primary_button.${i + 1}`}
                                  >
                                    {p.stage === "offer"
                                      ? "Mark Joined"
                                      : "Advance"}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => rejectPipelineItem(p.id)}
                                  data-ocid={`revenue.delete_button.${i + 1}`}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-teal" />
                  Placement Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Candidate</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Your Cut</TableHead>
                        <TableHead>Client Payment</TableHead>
                        <TableHead>Vendor Payout</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((t, i) => (
                        <TableRow
                          key={t.id}
                          className="border-border"
                          data-ocid={`revenue.row.${i + 1}`}
                        >
                          <TableCell className="font-medium text-sm">
                            {t.candidate}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {t.vendor}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {t.client}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={t.status} />
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            ₹{t.budget.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold text-green-600">
                            ₹{t.commission.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <StatusPill status={t.clientPayment} />
                          </TableCell>
                          <TableCell>
                            <StatusPill status={t.vendorPayout} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1.5">
                              {t.status === "offer_extended" && (
                                <Button
                                  size="sm"
                                  className="h-6 text-xs bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => markTxJoined(t.id)}
                                  data-ocid={`revenue.confirm_button.${i + 1}`}
                                >
                                  Mark Joined
                                </Button>
                              )}
                              {t.status === "joined" &&
                                t.clientPayment === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={() => markClientPaid(t.id)}
                                    data-ocid={`revenue.secondary_button.${i + 1}`}
                                  >
                                    Client Paid
                                  </Button>
                                )}
                              {t.clientPayment === "received" &&
                                t.vendorPayout === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => markVendorPaid(t.id)}
                                    data-ocid={`revenue.primary_button.${i + 1}`}
                                  >
                                    Pay Vendor
                                  </Button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials">
            {loading ? (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                data-ocid="revenue.loading_state"
              >
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="p-6 space-y-3">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-8 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Pending Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>Client</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((inv, i) => (
                          <TableRow
                            key={inv.id}
                            className="border-border"
                            data-ocid={`revenue.row.${i + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {inv.client}
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              {inv.amount}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {inv.due}
                            </TableCell>
                            <TableCell>
                              <StatusPill status={inv.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-teal hover:text-teal"
                                onClick={() =>
                                  toast.success(`Invoice sent to ${inv.client}`)
                                }
                                data-ocid={`revenue.secondary_button.${i + 1}`}
                              >
                                Send
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Vendor Payouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead>Vendor</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payouts.map((p, i) => (
                          <TableRow
                            key={p.id}
                            className="border-border"
                            data-ocid={`revenue.row.${i + 1}`}
                          >
                            <TableCell>
                              <p className="font-medium text-sm">{p.vendor}</p>
                              <p className="text-xs text-muted-foreground">
                                {p.placement}
                              </p>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              {p.amount}
                            </TableCell>
                            <TableCell>
                              <StatusPill status={p.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-teal hover:text-teal"
                                onClick={() =>
                                  toast.success(
                                    `Payout initiated for ${p.vendor}`,
                                  )
                                }
                                data-ocid={`revenue.primary_button.${i + 1}`}
                              >
                                Pay
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Escalation Tab */}
          <TabsContent value="escalation" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {loading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      disputes.filter((d) => d.status === "Open").length
                    )}
                  </p>
                  <p className="text-xs text-red-500">Open</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {loading ? (
                      <Skeleton className="h-8 w-8 mx-auto" />
                    ) : (
                      disputes.filter((d) => d.status === "In Progress").length
                    )}
                  </p>
                  <p className="text-xs text-blue-500">In Progress</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-xs text-green-500">Resolved (month)</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="space-y-3" data-ocid="revenue.loading_state">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {disputes.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <Card
                      className="bg-card border-border hover:border-red-200 transition-colors"
                      data-ocid={`revenue.item.${i + 1}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">
                                {d.id}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {d.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground font-medium">
                              {d.parties}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusPill status={d.status} />
                            {d.status !== "Resolved" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    toast(
                                      `Dispute ${d.id}: investigation started.`,
                                      { icon: "🔍" },
                                    )
                                  }
                                  data-ocid={`revenue.secondary_button.${i + 1}`}
                                >
                                  Investigate
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleResolveDispute(d.id)}
                                  data-ocid={`revenue.confirm_button.${i + 1}`}
                                >
                                  Resolve
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
