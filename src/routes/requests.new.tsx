import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImageUp, Loader2, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AnalysisCard, TenantResponseCard } from "@/components/app/AnalysisCard";
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
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeMaintenanceRequest,
  suggestedTenantResponse,
  CATEGORIES,
  PRIORITIES,
  PROPERTIES,
  type Analysis,
  type Category,
  type Priority,
} from "@/lib/analysis";
import { addRequest, useSettings } from "@/lib/store";

export const Route = createFileRoute("/requests/new")({
  head: () => ({
    meta: [
      { title: "New Maintenance Request | MaintenanceAI" },
      {
        name: "description",
        content:
          "Submit a maintenance request and get an instant deterministic triage: category, priority, risk, technician and tenant response.",
      },
      { property: "og:title", content: "New Maintenance Request | MaintenanceAI" },
      {
        property: "og:description",
        content: "Submit a request and get instant category, priority, risk and technician routing.",
      },
    ],
  }),
  component: NewRequestPage,
});

type Errors = Partial<Record<"property" | "unit" | "tenant" | "description", string>>;

function NewRequestPage() {
  const navigate = useNavigate();
  const settings = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);

  const [property, setProperty] = useState("");
  const [unit, setUnit] = useState("");
  const [tenant, setTenant] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [priority, setPriority] = useState<Priority | "">(settings.defaultPriority);
  const [image, setImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [tenantMessage, setTenantMessage] = useState("");

  function validate(): Errors {
    const next: Errors = {};
    if (!property) next.property = "Select the property for this request.";
    if (!unit.trim()) next.unit = "Unit is required.";
    if (!tenant.trim()) next.tenant = "Tenant name is required.";
    if (description.trim().length < 10)
      next.description = "Describe the issue in at least 10 characters.";
    return next;
  }

  function handleImage(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage({ name: file.name, dataUrl: String(reader.result) });
    reader.onerror = () => toast.error("The image could not be read. Try another file.");
    reader.readAsDataURL(file);
  }

  function onAnalyze() {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please complete the required fields before analyzing.");
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    window.setTimeout(() => {
      const result = analyzeMaintenanceRequest({
        description,
        selectedCategory: category,
        selectedPriority: priority,
      });
      setAnalysis(result);
      setTenantMessage(suggestedTenantResponse({ tenant, analysis: result }));
      setAnalyzing(false);
      toast.success(`Analysis complete — ${result.category}, ${result.priority} priority`);
    }, 1400);
  }

  function onSubmit() {
    if (!analysis) return;
    const created = addRequest({
      property,
      unit: unit.trim(),
      tenant: tenant.trim(),
      description: description.trim(),
      category: (category || analysis.category) as Category,
      priority: (priority || analysis.priority) as Priority,
      imageName: image?.name,
      imageDataUrl: image?.dataUrl,
      analysis,
      tenantMessage,
    });
    toast.success(`${created.id} created`);
    navigate({ to: "/requests/$id", params: { id: created.id } });
  }

  return (
    <AppLayout
      title="New Maintenance Request"
      description="Capture the report, then run the deterministic triage analysis."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Property" required error={errors.property}>
                <Select value={property} onValueChange={setProperty}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Unit" required error={errors.unit}>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  maxLength={20}
                  placeholder="e.g. 12B"
                />
              </Field>
            </div>

            <Field label="Tenant" required error={errors.tenant}>
              <Input
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                maxLength={100}
                placeholder="Full name"
              />
            </Field>

            <Field label="Description" required error={errors.description}>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Describe what the tenant reported, including symptoms and location."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {description.length}/1000 characters
              </p>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category">
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Priority">
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Photo (optional)">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
              {image ? (
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={image.dataUrl}
                      alt={`Attached photo of the reported issue: ${image.name}`}
                      className="size-20 rounded-md border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{image.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Image uploaded for technician review.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove image"
                      onClick={() => {
                        setImage(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  <ImageUp className="size-4" /> Select image
                </Button>
              )}
            </Field>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button onClick={onAnalyze} disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Analyze Request
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onSubmit} disabled={!analysis || analyzing}>
                Create Request
              </Button>
            </div>
            {!analysis && !analyzing ? (
              <p className="text-xs text-muted-foreground">
                Run the analysis first to review the suggested triage before creating the request.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {analyzing ? (
            <Card className="shadow-card">
              <CardContent className="space-y-3 py-10 text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">Analyzing request</p>
                <p className="text-sm text-muted-foreground">
                  Classifying category, risk and routing recommendation…
                </p>
              </CardContent>
            </Card>
          ) : analysis ? (
            <>
              <AnalysisCard analysis={analysis} />
              {settings.aiTenantResponses ? (
                <TenantResponseCard message={tenantMessage} onChange={setTenantMessage} />
              ) : null}
            </>
          ) : (
            <Card className="border-dashed shadow-none">
              <CardContent className="py-12 text-center">
                <Sparkles className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">No analysis yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete the form and select “Analyze Request”. The same input always produces the
                  same result.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
