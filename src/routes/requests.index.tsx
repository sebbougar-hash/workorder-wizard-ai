import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppLayout } from "@/components/app/AppLayout";
import { RequestsTable } from "@/components/app/RequestsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, PRIORITIES, PROPERTIES, STATUSES } from "@/lib/analysis";
import { useRequests } from "@/lib/store";

export const Route = createFileRoute("/requests/")({
  head: () => ({
    meta: [
      { title: "Maintenance Requests | MaintenanceAI" },
      {
        name: "description",
        content:
          "Search, filter and route every maintenance request by property, category, priority and status.",
      },
      { property: "og:title", content: "Maintenance Requests | MaintenanceAI" },
      {
        property: "og:description",
        content: "Search, filter and route maintenance requests across your properties.",
      },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const requests = useRequests();
  const [query, setQuery] = useState("");
  const [property, setProperty] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      [...requests]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .filter((r) => {
          const q = query.trim().toLowerCase();
          const matchesQuery =
            !q ||
            [r.id, r.tenant, r.unit, r.description, r.property].some((v) =>
              v.toLowerCase().includes(q),
            );
          return (
            matchesQuery &&
            (property === "all" || r.property === property) &&
            (category === "all" || r.category === category) &&
            (priority === "all" || r.priority === priority) &&
            (status === "all" || r.status === status)
          );
        }),
    [requests, query, property, category, priority, status],
  );

  return (
    <AppLayout
      title="Maintenance Requests"
      description={`${filtered.length} of ${requests.length} requests`}
      actions={
        <Button asChild size="sm">
          <Link to="/requests/new">New Request</Link>
        </Button>
      }
    >
      <div className="card-surface space-y-4 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by request ID, tenant, unit or description"
            className="pl-9"
            aria-label="Search requests"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Property" value={property} onChange={setProperty} options={PROPERTIES} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
          <FilterSelect label="Priority" value={priority} onChange={setPriority} options={PRIORITIES} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUSES} />
        </div>
      </div>

      <RequestsTable requests={filtered} />
    </AppLayout>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {label.toLowerCase()}s</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
