"use client";

type PlantScoreCardProps = {
  percent: number;
  label: string;
  hint: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function getScoreTone(percent: number) {
  if (percent >= 85) {
    return {
      ring: "stroke-emerald-500",
      text: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (percent >= 70) {
    return {
      ring: "stroke-lime-500",
      text: "text-lime-700",
      badge: "bg-lime-50 text-lime-700 border-lime-200",
    };
  }

  if (percent >= 50) {
    return {
      ring: "stroke-amber-500",
      text: "text-amber-700",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (percent >= 30) {
    return {
      ring: "stroke-orange-500",
      text: "text-orange-700",
      badge: "bg-orange-50 text-orange-700 border-orange-200",
    };
  }

  return {
    ring: "stroke-red-500",
    text: "text-red-700",
    badge: "bg-red-50 text-red-700 border-red-200",
  };
}

export function PlantScoreCard({ percent, label, hint }: PlantScoreCardProps) {
  const safePercent = clamp(percent);
  const tone = getScoreTone(safePercent);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white/50 p-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg
          viewBox="0 0 64 64"
          className="h-16 w-16 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-neutral-200"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            className={tone.ring}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-semibold ${tone.text}`}>
            {safePercent}%
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-gray-900">Plant Score</p>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tone.badge}`}
          >
            {label}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-600">{hint}</p>
      </div>
    </div>
  );
}
