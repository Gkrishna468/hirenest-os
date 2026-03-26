interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: {
    label: "Submitted",
    className: "bg-muted text-muted-foreground border-border",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-teal/10 text-teal border-teal/30",
  },
  interview: {
    label: "Interview",
    className: "bg-orange/10 text-orange border-orange/30",
  },
  closed: {
    label: "Closed",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  active: { label: "Active", className: "bg-teal/10 text-teal border-teal/30" },
  paused: {
    label: "Paused",
    className: "bg-muted text-muted-foreground border-border",
  },
  available: {
    label: "Available",
    className: "bg-teal/10 text-teal border-teal/30",
  },
  busy: {
    label: "Busy",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  open: {
    label: "Open to Offers",
    className: "bg-orange/10 text-orange border-orange/30",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
