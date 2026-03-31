"use client";

type ScoreCircleProps = {
  percent: number;
};

export default function ScoreCircle({ percent }: ScoreCircleProps) {
  const size = 64;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percent / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#eab308";
    return "#ef4444";
  };

  const color = getColor(percent);

  return (
    <div className="relative w-16 h-16">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress ring */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transition: "stroke-dashoffset 0.6s ease",
          }}
        />
      </svg>

      {/* Inner circle content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">{percent}%</span>
      </div>
    </div>
  );
}
