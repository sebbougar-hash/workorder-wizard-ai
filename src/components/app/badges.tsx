import type { Priority, Status } from "@/lib/analysis";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-secondary text-secondary-foreground border-border",
  Medium: "bg-info/10 text-info border-info/25",
  High: "bg-warning/15 text-warning-foreground border-warning/40",
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
};

const statusStyles: Record<Status, string> = {
  New: "bg-info/10 text-info border-info/25",
  "Under Review": "bg-accent text-accent-foreground border-accent",
  Assigned: "bg-secondary text-secondary-foreground border-border",
  "In Progress": "bg-warning/15 text-warning-foreground border-warning/40",
  Resolved: "bg-success/12 text-success border-success/30",
};

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

export function PriorityBadge({ value, label }: { value: Priority; label?: string }) {
  return <span className={cn(base, priorityStyles[value])}>{label ?? value}</span>;
}

export function StatusBadge({ value }: { value: Status }) {
  return <span className={cn(base, statusStyles[value])}>{value}</span>;
}

export function CategoryBadge({ value }: { value: string }) {
  return (
    <span className={cn(base, "bg-muted text-muted-foreground border-border")}>{value}</span>
  );
}
