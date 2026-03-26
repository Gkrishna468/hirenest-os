import { isSupabaseConnected, supabase } from "./supabase";

export interface MatchQueueItem {
  id: string;
  requirement: string;
  candidate: string;
  vendor: string;
  score: number;
  status: string;
}

export interface CommissionRow {
  id: string;
  client: string;
  amount: string;
  due: string;
  status: string;
}

export interface PayoutRow {
  id: string;
  vendor: string;
  placement: string;
  amount: string;
  status: string;
}

export interface DisputeRow {
  id: string;
  type: string;
  parties: string;
  status: string;
}

export interface RevenueKPIs {
  mtdRevenue: string;
  activePlacements: number;
  pendingInvoicesTotal: string;
  pendingPayoutsTotal: string;
}

const MOCK_MATCH_QUEUE: MatchQueueItem[] = [
  {
    id: "M001",
    requirement: "Senior React Developer — FinTech Corp",
    candidate: "Arjun Sharma",
    score: 92,
    vendor: "TechVault Solutions",
    status: "Pending AI Review",
  },
  {
    id: "M002",
    requirement: "DevOps Lead — InsurePrime",
    candidate: "Priya Nair",
    score: 87,
    vendor: "CloudBridge Staffing",
    status: "Pending AI Review",
  },
  {
    id: "M003",
    requirement: "Data Scientist — HealthStack AI",
    candidate: "Rohan Mehta",
    score: 78,
    vendor: "DataPros India",
    status: "Pending AI Review",
  },
  {
    id: "M004",
    requirement: "Java Backend Architect — LogiCore",
    candidate: "Sneha Iyer",
    score: 85,
    vendor: "JavaHive Tech",
    status: "Pending AI Review",
  },
  {
    id: "M005",
    requirement: "Product Designer — EdTech Ventures",
    candidate: "Kiran Desai",
    score: 81,
    vendor: "CreativeStack",
    status: "Pending AI Review",
  },
];

const MOCK_INVOICES: CommissionRow[] = [
  {
    id: "INV001",
    client: "FinTech Corp",
    amount: "₹1,50,000",
    due: "30 Mar 2026",
    status: "Invoiced",
  },
  {
    id: "INV002",
    client: "InsurePrime",
    amount: "₹75,000",
    due: "02 Apr 2026",
    status: "Pending",
  },
  {
    id: "INV003",
    client: "HealthStack AI",
    amount: "₹90,000",
    due: "05 Apr 2026",
    status: "Pending",
  },
  {
    id: "INV004",
    client: "LogiCore Systems",
    amount: "₹1,20,000",
    due: "28 Mar 2026",
    status: "Paid",
  },
  {
    id: "INV005",
    client: "EdTech Ventures",
    amount: "₹60,000",
    due: "10 Apr 2026",
    status: "Invoiced",
  },
];

const MOCK_PAYOUTS: PayoutRow[] = [
  {
    id: "PAY001",
    vendor: "TechVault Solutions",
    placement: "Arjun Sharma @ FinTech",
    amount: "₹1,20,000",
    status: "Processing",
  },
  {
    id: "PAY002",
    vendor: "CloudBridge Staffing",
    placement: "Priya Nair @ InsurePrime",
    amount: "₹60,000",
    status: "Pending",
  },
  {
    id: "PAY003",
    vendor: "DataPros India",
    placement: "Rohan Mehta @ HealthStack",
    amount: "₹72,000",
    status: "Pending",
  },
  {
    id: "PAY004",
    vendor: "JavaHive Tech",
    placement: "Sneha Iyer @ LogiCore",
    amount: "₹96,000",
    status: "Paid",
  },
  {
    id: "PAY005",
    vendor: "CreativeStack",
    placement: "Kiran Desai @ EdTech",
    amount: "₹48,000",
    status: "Pending",
  },
];

const MOCK_DISPUTES: DisputeRow[] = [
  {
    id: "D001",
    type: "Payment Delay",
    parties: "InsurePrime ↔ CloudBridge",
    status: "In Progress",
  },
  {
    id: "D002",
    type: "Candidate Rejection",
    parties: "HealthStack AI ↔ DataPros",
    status: "Open",
  },
  {
    id: "D003",
    type: "Quality Issue",
    parties: "LogiCore ↔ JavaHive Tech",
    status: "Open",
  },
  {
    id: "D004",
    type: "Payment Delay",
    parties: "EdTech Ventures ↔ CreativeStack",
    status: "In Progress",
  },
  {
    id: "D005",
    type: "Candidate Rejection",
    parties: "FinTech Corp ↔ TechVault",
    status: "Open",
  },
];

export async function getMatchQueue(): Promise<MatchQueueItem[]> {
  if (isSupabaseConnected && supabase) {
    const { data, error } = await supabase
      .from("match_queue")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        requirement: row.requirement_title,
        candidate: row.candidate_name,
        vendor: row.vendor_name,
        score: row.match_score,
        status: row.status,
      }));
    }
  }
  return MOCK_MATCH_QUEUE;
}

export async function approveMatch(id: string): Promise<void> {
  if (isSupabaseConnected && supabase) {
    await supabase
      .from("match_queue")
      .update({ status: "Approved" })
      .eq("id", id);
  }
}

export async function getInvoices(): Promise<CommissionRow[]> {
  if (isSupabaseConnected && supabase) {
    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        client: row.client_name,
        amount: `₹${Number(row.client_amount).toLocaleString("en-IN")}`,
        due: row.invoice_due_date || "—",
        status: row.status,
      }));
    }
  }
  return MOCK_INVOICES;
}

export async function getPayouts(): Promise<PayoutRow[]> {
  if (isSupabaseConnected && supabase) {
    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        vendor: row.vendor_name,
        placement: `${row.candidate_name} @ ${row.client_name}`,
        amount: `₹${Number(row.vendor_payout).toLocaleString("en-IN")}`,
        status: row.status,
      }));
    }
  }
  return MOCK_PAYOUTS;
}

export async function getDisputes(): Promise<DisputeRow[]> {
  if (isSupabaseConnected && supabase) {
    const { data, error } = await supabase
      .from("disputes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        type: row.dispute_type,
        parties: row.parties,
        status: row.status,
      }));
    }
  }
  return MOCK_DISPUTES;
}

export async function resolveDispute(id: string): Promise<void> {
  if (isSupabaseConnected && supabase) {
    await supabase.from("disputes").update({ status: "Resolved" }).eq("id", id);
  }
}
