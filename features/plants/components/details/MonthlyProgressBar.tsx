import { cn } from "@/components/ui/utils";

interface MonthlyProgressBarProps {
  activeMonths: number[];
  color?: "green" | "purple" | "teal";
  label?: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const colorClasses = {
  green: "bg-green-500",
  purple: "bg-purple-500",
  teal: "bg-teal-500",
};

function groupConsecutiveMonths(months: number[]): number[][] {
  if (!months.length) return [];

  const sorted = [...months].sort((a, b) => a - b);
  const groups: number[][] = [];
  let currentGroup = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
    }
  }

  groups.push(currentGroup);
  return groups;
}

export function MonthlyProgressBar({
  activeMonths,
  color = "green",
  label,
}: MonthlyProgressBarProps) {
  const segments = groupConsecutiveMonths(activeMonths);

  return (
    <div className="space-y-3">
      {label && (
        <div className="text-sm font-medium text-gray-700">{label}</div>
      )}

      <div className="space-y-2">
        {/* Bar */}
        <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          {segments.map((group, i) => {
            const start = group[0] - 1;
            const end = group[group.length - 1];

            const left = (start / 12) * 100;
            const width = ((end - start) / 12) * 100;

            return (
              <div
                key={i}
                className={cn(
                  "absolute top-0 h-full rounded-full transition-all",
                  colorClasses[color],
                )}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              />
            );
          })}
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-xs text-gray-500">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
