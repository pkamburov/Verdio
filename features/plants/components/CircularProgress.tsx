export function getScoreTone(value: number): "good" | "warn" | "bad" {
  if (value >= 75) return "good";
  if (value >= 45) return "warn";
  return "bad";
}

export function CircularScore({
  value,
  size = 64,
  strokeWidth = 8,
}: {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
}) {
  const v = Math.max(0, Math.min(100, value));
  const tone = getScoreTone(v);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  const toneClass =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-500"
        : "text-rose-600";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${toneClass}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-neutral-200"
          strokeWidth={strokeWidth}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-current"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>

      <div className="absolute text-sm font-semibold text-neutral-900">
        {Math.round(v)}%
      </div>
    </div>
  );
}
