import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { AppLayout } from "@/components/app/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CATEGORIES, PRIORITIES } from "@/lib/analysis";
import { useRequests } from "@/lib/store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | MaintenanceAI Portfolio Insights" },
      {
        name: "description",
        content:
          "Track request volume, priority mix, response and resolution times across your managed properties.",
      },
      { property: "og:title", content: "Analytics | MaintenanceAI" },
      {
        property: "og:description",
        content: "Request volume, priority mix and resolution performance for your portfolio.",
      },
    ],
  }),
  component: Analytics,
});

const categoryConfig: ChartConfig = {
  count: { label: "Requests", color: "var(--color-chart-1)" },
};

const priorityConfig: ChartConfig = {
  Low: { label: "Low", color: "var(--color-chart-2)" },
  Medium: { label: "Medium", color: "var(--color-chart-1)" },
  High: { label: "High", color: "var(--color-chart-3)" },
  Critical: { label: "Critical", color: "var(--color-chart-4)" },
};

const trendConfig: ChartConfig = {
  requests: { label: "Requests", color: "var(--color-chart-1)" },
  resolved: { label: "Resolved", color: "var(--color-chart-2)" },
};

function Analytics() {
  const requests = useRequests();

  const stats = useMemo(() => {
    const total = requests.length;
    const resolved = requests.filter((r) => r.status === "Resolved").length;
    return {
      total,
      critical: requests.filter((r) => r.priority === "Critical").length,
      high: requests.filter((r) => r.priority === "High").length,
      resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    };
  }, [requests]);

  const byCategory = CATEGORIES.map((c) => ({
    category: c,
    count: requests.filter((r) => r.category === c).length,
  })).filter((d) => d.count > 0);

  const byPriority = PRIORITIES.map((p) => ({
    priority: p,
    count: requests.filter((r) => r.priority === p).length,
    fill: priorityConfig[p]?.color as string,
  }));

  const overTime = [
    { week: "Week 27", requests: 18, resolved: 15 },
    { week: "Week 28", requests: 22, resolved: 19 },
    { week: "Week 29", requests: 26, resolved: 21 },
    { week: "Week 30", requests: 21, resolved: 20 },
    { week: "Week 31", requests: 29, resolved: 24 },
    { week: "Week 32", requests: 24, resolved: 22 },
  ];

  const kpis = [
    { label: "Total Requests", value: String(stats.total) },
    { label: "Critical Requests", value: String(stats.critical) },
    { label: "High Priority Requests", value: String(stats.high) },
    { label: "Average Response Time", value: "2h 15m" },
    { label: "Average Resolution Time", value: "1d 6h" },
    { label: "Resolution Rate", value: `${stats.resolutionRate}%` },
  ];

  return (
    <AppLayout title="Analytics" description="Portfolio-wide maintenance performance.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {k.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Requests by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="h-72 w-full">
              <BarChart data={byCategory} margin={{ left: -12, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Requests by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={priorityConfig} className="h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="priority" />} />
                <Pie data={byPriority} dataKey="count" nameKey="priority" innerRadius={55}>
                  {byPriority.map((entry) => (
                    <Cell key={entry.priority} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-72 w-full">
              <LineChart data={overTime} margin={{ left: -12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="requests"
                  stroke="var(--color-requests)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
