import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

const MOCK_SPENDING = [
  {
    id: "1",
    requirement: "Senior React Developer",
    vendor: "Vendor #1",
    status: "Joined",
    budget: "₹2,00,000",
    spent: "₹1,80,000",
    date: "12 Jan 2026",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: "2",
    requirement: "DevOps Engineer – AWS",
    vendor: "Vendor #2",
    status: "Interview",
    budget: "₹1,50,000",
    spent: "₹0",
    date: "28 Feb 2026",
    statusColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "3",
    requirement: "Data Scientist – Python/ML",
    vendor: "Vendor #1",
    status: "Offer Extended",
    budget: "₹1,80,000",
    spent: "₹1,80,000",
    date: "10 Mar 2026",
    statusColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "4",
    requirement: "Full Stack Node.js Developer",
    vendor: "Vendor #3",
    status: "Shortlisted",
    budget: "₹1,20,000",
    spent: "₹0",
    date: "18 Mar 2026",
    statusColor: "bg-blue-100 text-blue-700",
  },
];

function KPICard({
  icon,
  title,
  value,
  subtitle,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`card-surface rounded-xl p-6 ${
        highlight ? "ring-2 ring-orange/40" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            highlight ? "bg-orange/10" : "bg-teal/10"
          }`}
        >
          {icon}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
      </div>
      <p
        className={`text-3xl font-display font-bold ${
          highlight ? "text-orange" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

export function ClientSpendingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Hiring Spend
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your recruitment budget and placement costs
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
        >
          <KPICard
            icon={<CreditCard className="h-5 w-5 text-teal" />}
            title="Total Spent"
            value="₹4,20,000"
            subtitle="All time"
          />
          <KPICard
            icon={<Users className="h-5 w-5 text-teal" />}
            title="Active Hires"
            value="3"
            subtitle="Currently working"
          />
          <KPICard
            icon={<TrendingUp className="h-5 w-5 text-orange" />}
            title="Pending Payments"
            value="₹60,000"
            subtitle="Due this month"
            highlight
          />
        </motion.div>

        {/* Spending Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-bold text-lg text-foreground">
              Spending by Requirement
            </h2>
          </div>
          <Table data-ocid="client_spending.table">
            <TableHeader>
              <TableRow>
                <TableHead>Requirement</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Your Spend</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SPENDING.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-ocid={`client_spending.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-foreground">
                    {row.requirement}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.vendor}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.budget}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {row.spent}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
}
