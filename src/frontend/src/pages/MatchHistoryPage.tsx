import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { Clock, History, Search } from "lucide-react";

interface MatchSession {
  id: string;
  jdSnippet: string;
  timestamp: string;
  topScore: number;
  candidateCount: number;
  status: "Active" | "Archived";
}

const MOCK_SESSIONS: MatchSession[] = [
  {
    id: "1",
    jdSnippet:
      "Senior React Developer — 5+ yrs React, TypeScript, AWS required",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    topScore: 92,
    candidateCount: 9,
    status: "Active",
  },
  {
    id: "2",
    jdSnippet:
      "DevOps Engineer — Kubernetes, Docker, Terraform, CI/CD pipeline expert",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    topScore: 88,
    candidateCount: 9,
    status: "Active",
  },
  {
    id: "3",
    jdSnippet:
      "Python ML Engineer — TensorFlow, PyTorch, MLOps, 5+ years experience",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    topScore: 85,
    candidateCount: 9,
    status: "Archived",
  },
  {
    id: "4",
    jdSnippet: "Java Microservices Architect — Spring Boot, Kafka, PostgreSQL",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    topScore: 79,
    candidateCount: 9,
    status: "Archived",
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

export function MatchHistoryPage() {
  const navigate = useNavigate();

  const stored = localStorage.getItem("hirenest_match_history");
  const rawSessions: MatchSession[] = stored ? JSON.parse(stored) : [];
  const sessions: MatchSession[] =
    rawSessions.length > 0 ? rawSessions : MOCK_SESSIONS;
  const isEmpty = rawSessions.length === 0;

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 space-y-6"
      data-ocid="match_history.page"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <History className="h-7 w-7 text-teal" />
            Match History
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEmpty
              ? "Showing demo sessions — run a real match to see your history"
              : `${sessions.length} matching session${sessions.length !== 1 ? "s" : ""} recorded`}
          </p>
        </div>
        <Button
          className="bg-teal text-background hover:bg-teal-600 font-semibold"
          onClick={() => navigate({ to: "/ai-match" })}
          data-ocid="match_history.primary_button"
        >
          <Search className="h-4 w-4 mr-2" /> New Match
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div
          className="card-surface rounded-xl p-16 text-center"
          data-ocid="match_history.empty_state"
        >
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No match history yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Run your first AI match to see session history here
          </p>
          <Button
            onClick={() => navigate({ to: "/ai-match" })}
            className="bg-teal text-background hover:bg-teal-600"
            data-ocid="match_history.secondary_button"
          >
            Go to AI Match
          </Button>
        </div>
      ) : (
        <div className="card-surface rounded-xl overflow-hidden">
          {isEmpty && (
            <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Demo data — complete a real AI match session to populate your
                history
              </p>
            </div>
          )}
          <Table data-ocid="match_history.table">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">
                  JD Preview
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Date / Time
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Top Match %
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Candidates Ranked
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s, idx) => (
                <TableRow
                  key={s.id}
                  className="border-border hover:bg-muted/20"
                  data-ocid={`match_history.item.${idx + 1}`}
                >
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-foreground font-medium truncate">
                      {s.jdSnippet.length > 60
                        ? `${s.jdSnippet.slice(0, 60)}…`
                        : s.jdSnippet}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(s.timestamp)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-lg font-bold ${getScoreColor(s.topScore)}`}
                    >
                      {s.topScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-foreground">
                      {s.candidateCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        s.status === "Active"
                          ? "bg-green-100 text-green-700 border-green-200 border"
                          : "bg-muted text-muted-foreground border border-border"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-teal/30 text-teal hover:bg-teal/10 hover:text-teal text-xs"
                      onClick={() => navigate({ to: "/ai-match" })}
                      data-ocid="match_history.secondary_button"
                    >
                      View Results
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
