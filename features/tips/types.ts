export type DashboardTipType =
  | "water"
  | "fertilize"
  | "prune"
  | "tip"
  | "warning";
export type DashboardTipPriority = "low" | "medium" | "high";

export type DashboardTip = {
  id: string;
  plantId?: string;
  plantName?: string;
  type: DashboardTipType;
  priority: DashboardTipPriority;
  message: string;
  time?: string;
};
