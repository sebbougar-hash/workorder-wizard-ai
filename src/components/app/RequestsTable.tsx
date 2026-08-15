import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CategoryBadge, PriorityBadge, StatusBadge } from "@/components/app/badges";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MaintenanceRequest } from "@/lib/store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RequestsTable({ requests }: { requests: MaintenanceRequest[] }) {
  if (!requests.length) {
    return (
      <div className="card-surface p-10 text-center">
        <p className="text-sm font-medium text-foreground">No requests match these filters</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the filters or create a new maintenance request.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="card-surface hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/60 hover:bg-surface/60">
              <TableHead>Request</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Link
                    to="/requests/$id"
                    params={{ id: r.id }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {r.id}
                  </Link>
                  <p className="mt-0.5 max-w-56 truncate text-xs text-muted-foreground">
                    {r.description}
                  </p>
                </TableCell>
                <TableCell className="text-sm">{r.property}</TableCell>
                <TableCell className="text-sm">{r.unit}</TableCell>
                <TableCell>
                  <CategoryBadge value={r.category} />
                </TableCell>
                <TableCell>
                  <PriorityBadge value={r.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={r.status} />
                </TableCell>
                <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                  {formatDate(r.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/requests/$id" params={{ id: r.id }}>
                      View <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {requests.map((r) => (
          <Link
            key={r.id}
            to="/requests/$id"
            params={{ id: r.id }}
            className="card-surface block p-4 transition-shadow hover:shadow-elevated"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">{r.id}</p>
                <p className="text-xs text-muted-foreground">
                  {r.property} · Unit {r.unit}
                </p>
              </div>
              <StatusBadge value={r.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-foreground">{r.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CategoryBadge value={r.category} />
              <PriorityBadge value={r.priority} />
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDate(r.createdAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
