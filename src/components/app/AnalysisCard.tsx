import { Link } from "@tanstack/react-router";
import { ShieldAlert, Sparkles, UserCog, ListChecks, Gauge } from "lucide-react";

import { CategoryBadge, PriorityBadge } from "@/components/app/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Analysis } from "@/lib/analysis";
import { cn } from "@/lib/utils";

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          AI Analysis
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge value={analysis.category} />
          <PriorityBadge value={analysis.priority} label={`Priority: ${analysis.priority}`} />
          <PriorityBadge value={analysis.riskLevel} label={`Risk: ${analysis.riskLevel}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <Field label="Problem Summary">{analysis.problemSummary}</Field>
        <Field label="Recommended Action">{analysis.recommendedAction}</Field>
        <Field label="Recommended Technician" icon={<UserCog className="size-3.5" />}>
          {analysis.technician}
        </Field>
        <Field label="Follow-up Questions" icon={<ListChecks className="size-3.5" />}>
          <ul className="mt-1 space-y-1.5">
            {analysis.followUpQuestions.map((q) => (
              <li key={q} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </Field>
        <div
          className={cn(
            "rounded-lg border p-3",
            analysis.riskLevel === "Critical"
              ? "border-destructive/30 bg-destructive/8 text-destructive"
              : analysis.riskLevel === "High"
                ? "border-warning/40 bg-warning/12 text-warning-foreground"
                : "border-border bg-muted text-muted-foreground",
          )}
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <ShieldAlert className="size-3.5" /> Safety Assessment
          </p>
          <p className="mt-1.5 text-sm">{analysis.safetyAssessment}</p>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Gauge className="size-3.5" /> Confidence
            </span>
            <span className="text-foreground">{analysis.confidence}%</span>
          </div>
          <Progress value={analysis.confidence} className="mt-2 h-2" />
        </div>
        <p className="text-xs text-muted-foreground">
          Automated triage suggestion based on the reported description. No physical diagnosis has
          been performed; an on-site inspection is required to confirm the cause.
        </p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <div className="mt-1 text-foreground">{children}</div>
    </div>
  );
}

export function TenantResponseCard({
  message,
  onChange,
}: {
  message: string;
  onChange: (value: string) => void;
}) {
  return <TenantResponseInner message={message} onChange={onChange} />;
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function TenantResponseInner({
  message,
  onChange,
}: {
  message: string;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Message copied to clipboard");
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base">Suggested Tenant Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <Textarea
            value={message}
            rows={10}
            onChange={(e) => onChange(e.target.value)}
            className="text-sm"
          />
        ) : (
          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted p-3 font-sans text-sm text-foreground">
            {message}
          </pre>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={copy}>
            Copy Message
          </Button>
          <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done Editing" : "Edit Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RequestLink({ id }: { id: string }) {
  return (
    <Link to="/requests/$id" params={{ id }} className="font-semibold text-primary hover:underline">
      {id}
    </Link>
  );
}
