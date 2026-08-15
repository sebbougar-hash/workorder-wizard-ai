import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PRIORITIES, type Priority } from "@/lib/analysis";
import { TECHNICIANS, updateSettings, useSettings } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | MaintenanceAI" },
      {
        name: "description",
        content:
          "Configure company details, default maintenance priority, emergency escalation and automated triage behaviour.",
      },
      { property: "og:title", content: "Settings | MaintenanceAI" },
      {
        property: "og:description",
        content: "Company details, escalation rules and automated triage preferences.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const settings = useSettings();
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);

  function save() {
    if (!companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      toast.error("Enter a valid contact email address.");
      return;
    }
    updateSettings({ companyName: companyName.trim(), contactEmail: contactEmail.trim() });
    toast.success("Company information saved");
  }

  return (
    <AppLayout title="Settings" description="Workspace configuration for your maintenance team.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                maxLength={120}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={contactEmail}
                maxLength={255}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <Button onClick={save}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label>Default Priority</Label>
              <Select
                value={settings.defaultPriority}
                onValueChange={(v) => {
                  updateSettings({ defaultPriority: v as Priority });
                  toast.success(`Default priority set to ${v}`);
                }}
              >
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
            <ToggleRow
              label="Emergency Escalation"
              description="Automatically flag critical requests for immediate escalation."
              checked={settings.emergencyEscalation}
              onChange={(v) => updateSettings({ emergencyEscalation: v })}
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">AI Assistance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ToggleRow
              label="Automatic Categorization"
              description="Suggest a category and risk level from the reported description."
              checked={settings.autoCategorization}
              onChange={(v) => updateSettings({ autoCategorization: v })}
            />
            <ToggleRow
              label="AI Generated Tenant Responses"
              description="Draft a suggested tenant reply after each analysis."
              checked={settings.aiTenantResponses}
              onChange={(v) => updateSettings({ aiTenantResponses: v })}
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Technician Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TECHNICIANS.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.specialty}</p>
                </div>
                <span className="text-xs text-muted-foreground">{t.phone}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
