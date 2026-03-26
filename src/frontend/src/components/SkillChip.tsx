interface SkillChipProps {
  skill: string;
  variant?: "default" | "matched" | "missing";
}

export function SkillChip({ skill, variant = "default" }: SkillChipProps) {
  const styles =
    variant === "matched"
      ? "bg-teal/10 text-teal border-teal/30"
      : variant === "missing"
        ? "bg-destructive/10 text-destructive border-destructive/30"
        : "bg-accent/30 text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles}`}
    >
      {skill}
    </span>
  );
}
