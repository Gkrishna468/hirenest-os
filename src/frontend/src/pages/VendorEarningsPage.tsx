import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const MOCK_EARNINGS = [
  {
    id: "1",
    candidate: "Arjun Sharma",
    requirement: "Senior React Developer",
    client: "Client #1",
    status: "Joined",
    budget: "₹2,00,000",
    earnings: "₹1,70,000",
    payoutStatus: "Paid",
    payoutColor: "bg-green-100 text-green-700",
  },
  {
    id: "2",
    candidate: "Priya Nair",
    requirement: "Data Scientist – ML",
    client: "Client #2",
    status: "Offer Extended",
    budget: "₹1,80,000",
    earnings: "₹1,53,000",
    payoutStatus: "Pending",
    payoutColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "3",
    candidate: "Rohan Mehta",
    requirement: "DevOps Engineer – AWS",
    client: "Client #1",
    status: "Interview",
    budget: "₹1,50,000",
    earnings: "₹—",
    payoutStatus: "Not yet",
    payoutColor: "bg-gray-100 text-gray-600",
  },
];

function KPICard({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "teal" | "orange" | "blue";
}) {
  const bgMap = {
    teal: "bg-teal/10",
    orange: "bg-orange/10",
    blue: "bg-blue-500/10",
  };
  const textMap = {
    teal: "text-green-600",
    orange: "text-orange",
    blue: "text-blue-600",
  };
  return (
    <div className="card-surface rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgMap[color]}`}
        >
          {icon}
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
      </div>
      <p className={`text-3xl font-display font-bold ${textMap[color]}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

export function VendorEarningsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Earnings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your placements and payout status
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
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            title="Total Earned"
            value="₹1,70,000"
            subtitle="Lifetime"
            color="teal"
          />
          <KPICard
            icon={<Clock className="h-5 w-5 text-orange" />}
            title="Pending Payout"
            value="₹85,000"
            subtitle="Will be processed after client pays"
            color="orange"
          />
          <KPICard
            icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />}
            title="This Month"
            value="₹30,000"
            subtitle="Projected"
            color="blue"
          />
        </motion.div>

        {/* Earnings Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-bold text-lg text-foreground">
              Earnings by Placement
            </h2>
          </div>
          <Table data-ocid="vendor_earnings.table">
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Your Earnings (85%)</TableHead>
                <TableHead>Payout Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EARNINGS.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-ocid={`vendor_earnings.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-foreground">
                    {row.candidate}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.requirement}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.client}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal">
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.budget}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {row.earnings}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.payoutColor}`}
                    >
                      {row.payoutStatus}
                    </span>
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
