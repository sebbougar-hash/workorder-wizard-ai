import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Pencil, ShieldAlert, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AnalysisCard, TenantResponseCard } from "@/components/app/AnalysisCard";
import { AppLayout } from "@/components/app/AppLayout";
import { CategoryBadge, PriorityBadge, StatusBadge } from "@/components/app/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeMaintenanceRequest,
  suggestedTenantResponse,
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  type Category,
  type Priority,
  type Status,
} from "@/lib/analysis";
import { techniciansForCategory, updateRequest, useRequest } from "@/lib/store";

export const Route = createFileRoute("/requests/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Request ${params.id} | MaintenanceAI` },
      {
        name: "description",
        content: `Full triage detail for maintenance request ${params.id}: category, risk, recommended technician, safety assessment and status.`,
      },
      { property: "og:title", content: `Request ${params.id} | MaintenanceAI` },
      {
        property: "og:description",
        content: `Triage detail, technician routing and status history for request ${params.id}.`,
      },
    ],
  }),
  component: RequestDetails,
});

function RequestDetails() {
  const { id } = useParams({ from: "/requests/$id" });
  const request = useRequest(id);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [technician, setTechnician] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("Other");
  const [draftPriority, setDraftPriority] = useState<Priority>("Medium");

  if (!request) {
    return (
      <AppLayout title="Request not found">
        <div className="card-surface p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            We couldn't find a request with ID {id}.
          </p>
          <Button asChild className="mt-4">
            <Link to="/requests">Back to requests</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const techs = techniciansForCategory(request.category);

  function setStatus(status: Status) {
    updateRequest(request!.id, { status });
    toast.success(`Status updated to ${status}`);
  }

  function openEdit() {
    setDraftDescription(request!.description);
    setDraftCategory(request!.category);
    setDraftPriority(request!.priority);
    setEditOpen(true);
  }

  function saveEdit() {
    if (draftDescription.trim().length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }
    const analysis = analyzeMaintenanceRequest({
      description: draftDescription,
      selectedCategory: draftCategory,
      selectedPriority: draftPriority,
    });
    updateRequest(request!.id, {
      description: draftDescription.trim(),
      category: analysis.category,
      priority: analysis.priority,
      riskLevel: analysis.riskLevel,
      analysis,
      tenantMessage: suggestedTenantResponse({ tenant: request!.tenant, analysis }),
    });
    setEditOpen(false);
    toast.success("Request updated and re-analyzed");
  }

  function assign() {
    if (!technician) {
      toast.error("Select a technician to assign.");
      return;
    }
    updateRequest(request!.id, { assignedTechnician: technician, status: "Assigned" });
    setAssignOpen(false);
    toast.success(`Assigned to ${technician}`);
  }

  const tenantMessage =
    request.tenantMessage ??
    suggestedTenantResponse({ tenant: request.tenant, analysis: request.analysis });

  return (
    <AppLayout
      title={`Request ${request.id}`}
      description={`${request.property} · Unit ${request.unit} · ${request.tenant}`}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/requests">
            <ArrowLeft className="size-3.5" /> Back
          </Link>
        </Button>
      }
    >
      <div className="card-surface flex flex-wrap items-center gap-2 p-4">
        <Button size="sm" onClick={() => setStatus("Under Review")}>
          <CheckCircle2 className="size-3.5" /> Approve
        </Button>
        <Button size="sm" variant="outline" onClick={openEdit}>
          <Pencil className="size-3.5" /> Edit
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
          <UserPlus className="size-3.5" /> Assign Technician
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            updateRequest(request.id, { priority: "Critical", status: "In Progress" });
            toast.success("Request escalated to Critical");
          }}
        >
          <ShieldAlert className="size-3.5" /> Escalate
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setStatus("Resolved")}>
          Resolve
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={request.status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Info label="Request ID" value={request.id} />
                <Info label="Property" value={request.property} />
                <Info label="Unit" value={request.unit} />
                <Info label="Tenant" value={request.tenant} />
                <Info
                  label="Created Date"
                  value={new Date(request.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
                <Info label="Assigned Technician" value={request.assignedTechnician ?? "Unassigned"} />
              </dl>
              <div className="flex flex-wrap gap-2">
                <CategoryBadge value={request.category} />
                <PriorityBadge value={request.priority} label={`Priority: ${request.priority}`} />
                <PriorityBadge value={request.riskLevel} label={`Risk: ${request.riskLevel}`} />
                <StatusBadge value={request.status} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </p>
                <p className="mt-1 text-sm text-foreground">{request.description}</p>
              </div>
              {request.imageDataUrl ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Attached Photo
                  </p>
                  <img
                    src={request.imageDataUrl}
                    alt={`Tenant-submitted photo for request ${request.id}`}
                    className="mt-2 max-h-64 rounded-lg border border-border object-cover"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Image uploaded for technician review.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <TenantResponseCard
            message={tenantMessage}
            onChange={(value) => updateRequest(request.id, { tenantMessage: value })}
          />
        </div>

        <AnalysisCard analysis={request.analysis} />
      </div>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Technicians filtered by the request category ({request.category}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Technician</Label>
            <Select value={technician} onValueChange={setTechnician}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {techs.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name} — {t.specialty} · {t.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={assign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
            <DialogDescription>
              Saving re-runs the deterministic analysis with the updated details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={5}
                maxLength={1000}
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={draftCategory} onValueChange={(v) => setDraftCategory(v as Category)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={draftPriority} onValueChange={(v) => setDraftPriority(v as Priority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save & Re-analyze</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
