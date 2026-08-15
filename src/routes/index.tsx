import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Inbox, Flame, Gauge } from "lucide-react";

import { AppLayout } from "@/components/app/AppLayout";
import { RequestsTable } from "@/components/app/RequestsTable";
import { Button } from "@/components/ui/button";
import { useRequests } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | MaintenanceAI Request Triage" },
      {
        name: "description",
        content:
          "Monitor open maintenance requests, critical issues and resolutions across your property portfolio with MaintenanceAI.",
      },
      { property: "og:title", content: "MaintenanceAI Dashboard" },
      {
        property: "og:description",
        content:
          "Turn maintenance requests into actionable work orders with automated triage, priority scoring and technician routing.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const requests = useRequests();

  const open = requests.filter((r) => r.status !== "Resolved");
  const kpis = [
    {
      label: "Open Requests",
      value: open.length,
      icon: Inbox,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Critical",
      value: open.filter((r) => r.priority === "Critical").length,
      icon: Flame,
      tone: "text-destructive bg-destructive/10",
    },
    {
      label: "High Priority",
      value: open.filter((r) => r.priority === "High").length,
      icon: AlertTriangle,
      tone: "text-warning-foreground bg-warning/15",
    },
    {
      label: "Medium",
      value: open.filter((r) => r.priority === "Medium").length,
      icon: Gauge,
      tone: "text-info bg-info/10",
    },
    {
      label: "Resolved Today",
      value: requests.filter(
        (r) =>
          r.status === "Resolved" &&
          new Date(r.createdAt).toDateString() === new Date().toDateString(),
      ).length,
      icon: CheckCircle2,
      tone: "text-success bg-success/12",
    },
  ];

  const recent = [...requests]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 8);

  return (
    <AppLayout
      title="Dashboard"
      description="Turn maintenance requests into actionable work orders."
      actions={
        <Button asChild size="sm">
          <Link to="/requests/new">New Request</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {kpi.label}
              </p>
              <span className={cn("flex size-8 items-center justify-center rounded-lg", kpi.tone)}>
                <kpi.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recent Requests</h2>
            <p className="text-sm text-muted-foreground">
              Latest submissions with automated triage results.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/requests">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <RequestsTable requests={recent} />
      </section>
    </AppLayout>
  );
}
