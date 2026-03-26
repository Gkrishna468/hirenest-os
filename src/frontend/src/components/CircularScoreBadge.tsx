interface CircularScoreBadgeProps {
  score: number;
  size?: number;
}

export function CircularScoreBadge({
  score,
  size = 60,
}: CircularScoreBadgeProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75
      ? "oklch(0.74 0.12 186)"
      : score >= 50
        ? "oklch(0.74 0.14 55)"
        : "oklch(0.62 0.22 25)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ position: "absolute" }}
        role="img"
        aria-label={`Match score: ${score}%`}
      >
        <title>Match score: {score}%</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.24 0.04 232)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="text-xs font-bold"
        style={{ color, position: "relative", zIndex: 1 }}
      >
        {score}%
      </span>
    </div>
  );
}
