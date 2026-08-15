export type Category =
  | "HVAC"
  | "Plumbing"
  | "Electrical"
  | "Appliance"
  | "Structural"
  | "Pest"
  | "Other";

export type Priority = "Low" | "Medium" | "High" | "Critical";
export type RiskLevel = Priority;
export type Status = "New" | "Under Review" | "Assigned" | "In Progress" | "Resolved";

export const CATEGORIES: Category[] = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Appliance",
  "Structural",
  "Pest",
  "Other",
];
export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
export const STATUSES: Status[] = [
  "New",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];
export const PROPERTIES = [
  "Sunset Apartments",
  "Park View Residences",
  "Downtown Lofts",
  "Riverside Homes",
];

export interface Analysis {
  category: Category;
  priority: Priority;
  riskLevel: RiskLevel;
  problemSummary: string;
  recommendedAction: string;
  technician: string;
  followUpQuestions: string[];
  safetyAssessment: string;
  confidence: number;
}

const KEYWORDS: Record<Exclude<Category, "Other">, string[]> = {
  Appliance: [
    "refrigerator",
    "fridge",
    "freezer",
    "dishwasher",
    "washing machine",
    "washer",
    "dryer",
    "oven",
    "stove",
    "microwave",
  ],
  HVAC: [
    "air conditioner",
    "air conditioning",
    "hvac",
    "furnace",
    "heater",
    "heating",
    "thermostat",
    "cooling system",
    "ac ",
    " ac",
  ],
  Plumbing: [
    "sink",
    "toilet",
    "faucet",
    "pipe",
    "drain",
    "shower",
    "bathtub",
    "water pressure",
    "water leak",
  ],
  Electrical: [
    "outlet",
    "socket",
    "breaker",
    "electrical",
    "electricity",
    "wiring",
    "power",
    "light switch",
    "sparks",
    "smoke",
    "burning smell",
  ],
  Structural: ["door", "window", "roof", "ceiling", "wall", "lock"],
  Pest: [
    "cockroach",
    "roach",
    "rat",
    "mouse",
    "rodent",
    "bed bugs",
    "termite",
  ],
};

// Order matters: specific categories are evaluated before generic ones.
const DETECTION_ORDER: Exclude<Category, "Other">[] = [
  "Appliance",
  "Pest",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Structural",
];

const TECHNICIAN_BY_CATEGORY: Record<Category, string> = {
  HVAC: "HVAC technician",
  Plumbing: "Licensed plumber",
  Electrical: "Licensed electrician",
  Appliance: "Appliance technician",
  Structural: "General maintenance / qualified contractor",
  Pest: "Pest control technician",
  Other: "General maintenance technician",
};

export function technicianRoleFor(category: Category) {
  return TECHNICIAN_BY_CATEGORY[category];
}

function negated(text: string, term: string) {
  // catch phrasings like "no smoke", "without sparks", "no burning smell, sparks"
  const idx = text.indexOf(term);
  if (idx < 0) return false;
  const before = text.slice(Math.max(0, idx - 60), idx);
  return /\b(no|not|without|isn't|is not|there is no|any)\b[^.]*$/.test(before);
}

function has(text: string, terms: string[]) {
  return terms.some((t) => text.includes(t) && !negated(text, t));
}

function countMatches(text: string, terms: string[]) {
  return terms.filter((t) => text.includes(t)).length;
}

const CRITICAL_TERMS = [
  "active fire",
  "fire in",
  "fire inside",
  "on fire",
  "there is a fire",
  "flames",
  "gas leak",
  "gas smell",
  "smell of gas",
  "smells like gas",
  "explosion",
  "electrical shock",
  "electric shock",
  "electrocut",
  "someone was shocked",
  "life-threatening",
  "carbon monoxide",
];

const HIGH_TERMS = [
  "burning smell",
  "smell of burning",
  "sparks",
  "sparking",
  "exposed wiring",
  "exposed live wiring",
  "live wire",
  "major flooding",
  "flooding",
  "flooded",
  "sewage backup",
  "no heat in winter",
  "breaker keeps tripping",
  "breaker trips",
  "keeps tripping",
  "smoke",
];

const LOW_TERMS = [
  "cosmetic",
  "paint",
  "scratch",
  "scuff",
  "aesthetic",
  "stain",
  "chipped",
  "squeak",
  "loose handle",
  "minor",
];

const WATER_TERMS = [
  "water",
  "leak",
  "leaking",
  "wet",
  "flood",
  "moisture",
  "dripping",
];
const ELECTRIC_PROXIMITY_TERMS = [
  "outlet",
  "socket",
  "electrical",
  "electricity",
  "wiring",
  "breaker",
  "panel",
  "light switch",
  "electrical equipment",
];

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
}

function detectCategory(text: string): { category: Category | null; strength: number } {
  let best: Category | null = null;
  let bestCount = 0;
  for (const cat of DETECTION_ORDER) {
    const count = countMatches(text, KEYWORDS[cat]);
    if (count > 0 && best === null) {
      best = cat;
      bestCount = count;
    }
  }
  return { category: best, strength: bestCount };
}

export function analyzeMaintenanceRequest(input: {
  description: string;
  selectedCategory?: Category | "";
  selectedPriority?: Priority | "";
}): Analysis {
  const text = normalize(input.description || "");
  const selectedCategory = (input.selectedCategory || "") as Category | "";
  const selectedPriority = (input.selectedPriority || "") as Priority | "";

  const detected = detectCategory(text);

  // Category: keep the user's explicit choice unless there is no keyword support
  // for it and strong evidence for a different one.
  let category: Category;
  if (selectedCategory && selectedCategory !== "Other") {
    const selectedSupported =
      countMatches(text, KEYWORDS[selectedCategory as Exclude<Category, "Other">]) > 0;
    category =
      !selectedSupported && detected.category && detected.strength >= 2
        ? detected.category
        : selectedCategory;
  } else {
    category = detected.category ?? (selectedCategory || "Other");
  }

  // --- Safety combination rules (highest precedence) ---
  const waterNearElectric =
    has(text, WATER_TERMS) && has(text, ELECTRIC_PROXIMITY_TERMS);
  const isCritical = has(text, CRITICAL_TERMS);
  const isHigh = has(text, HIGH_TERMS) || waterNearElectric;

  let riskLevel: RiskLevel;
  if (isCritical) riskLevel = "Critical";
  else if (isHigh) riskLevel = "High";
  else if (has(text, LOW_TERMS) && !has(text, WATER_TERMS)) riskLevel = "Low";
  else riskLevel = "Medium";

  // The user's selected priority may raise risk within safe bounds but can never
  // create a Critical classification on its own.
  let priority: Priority = riskLevel;
  if (
    selectedPriority &&
    selectedPriority !== "Critical" &&
    PRIORITIES.indexOf(selectedPriority) > PRIORITIES.indexOf(priority)
  ) {
    priority = selectedPriority;
    riskLevel = priority;
  }

  const problemSummary = buildSummary(text, category, riskLevel);
  const recommendedAction = buildAction(category, riskLevel, waterNearElectric);
  const followUpQuestions = buildQuestions(category);
  const safetyAssessment = buildSafety(riskLevel);
  const confidence = buildConfidence(text, detected, selectedCategory, riskLevel);

  return {
    category,
    priority,
    riskLevel,
    problemSummary,
    recommendedAction,
    technician: TECHNICIAN_BY_CATEGORY[category],
    followUpQuestions,
    safetyAssessment,
    confidence,
  };
}

function subjectFor(text: string, category: Category): string {
  const subjects: [string, string][] = [
    ["refrigerator", "refrigerator"],
    ["fridge", "refrigerator"],
    ["freezer", "freezer"],
    ["dishwasher", "dishwasher"],
    ["washing machine", "washing machine"],
    ["washer", "washing machine"],
    ["dryer", "dryer"],
    ["oven", "oven"],
    ["stove", "stove"],
    ["microwave", "microwave"],
    ["air conditioner", "air conditioning system"],
    ["air conditioning", "air conditioning system"],
    [" ac", "air conditioning system"],
    ["furnace", "furnace"],
    ["heater", "heating system"],
    ["heating", "heating system"],
    ["thermostat", "thermostat"],
    ["toilet", "toilet"],
    ["sink", "sink"],
    ["faucet", "faucet"],
    ["shower", "shower"],
    ["drain", "drain"],
    ["pipe", "pipe"],
    ["panel", "electrical panel"],
    ["outlet", "electrical outlet"],
    ["breaker", "circuit breaker"],
    ["wiring", "wiring"],
    ["ceiling", "ceiling"],
    ["roof", "roof"],
    ["window", "window"],
    ["door", "door"],
    ["lock", "lock"],
  ];
  for (const [term, label] of subjects) if (text.includes(term)) return label;
  return `${category.toLowerCase()} system`;
}

function buildSummary(text: string, category: Category, risk: RiskLevel) {
  const subject = subjectFor(text, category);
  if (risk === "Critical") {
    return `Reported immediate emergency involving the ${subject}. Treat as an urgent safety situation; the exact cause cannot be confirmed without an on-site inspection.`;
  }
  if (risk === "High") {
    return `Possible ${category.toLowerCase()} fault involving the ${subject} with a potential safety or property risk. Likely requires prompt inspection by a qualified professional.`;
  }
  const symptom = text.includes("not cooling")
    ? "cooling-system issue"
    : text.includes("not heating")
      ? "heating-system issue"
      : text.includes("not starting")
        ? "start-up or power-supply issue"
        : text.includes("not draining")
          ? "drainage issue"
          : text.includes("leak")
            ? "leak"
            : "functional fault";
  return `Possible ${subject} ${symptom}. The exact cause cannot be confirmed without an inspection. Requires inspection.`;
}

function buildAction(category: Category, risk: RiskLevel, waterNearElectric: boolean) {
  if (risk === "Critical") {
    return "Escalate immediately and contact appropriate emergency services when necessary.";
  }
  if (waterNearElectric) {
    return "Stop using the appliance and keep away from the affected electrical area. Have a qualified technician inspect it.";
  }
  if (risk === "High" && category === "Electrical") {
    return "Stop using the affected equipment/circuit and arrange qualified professional inspection.";
  }
  switch (category) {
    case "Appliance":
      return "Assign an appliance technician for inspection.";
    case "HVAC":
      return "Assign an HVAC technician to inspect the cooling system.";
    case "Plumbing":
      return "Assign a plumber to inspect the leak.";
    case "Electrical":
      return "Assign a qualified electrician to inspect the affected circuit.";
    case "Structural":
      return "Assign general maintenance to inspect the affected structure.";
    case "Pest":
      return "Schedule a pest control technician for an on-site treatment assessment.";
    default:
      return "Assign a maintenance technician for an on-site inspection.";
  }
}

function buildQuestions(category: Category): string[] {
  switch (category) {
    case "Appliance":
      return [
        "Is the appliance completely unusable?",
        "Is there any smoke or burning smell?",
        "Is there any water leaking?",
      ];
    case "HVAC":
      return [
        "Is the system still running?",
        "Is water leaking?",
        "Is there any burning smell?",
      ];
    case "Plumbing":
      return [
        "Is water still actively leaking?",
        "Where exactly is the leak?",
        "Is the affected area near electrical equipment?",
      ];
    case "Electrical":
      return [
        "Is there smoke or a burning smell?",
        "Did the breaker trip?",
        "Are sparks visible?",
      ];
    case "Structural":
      return [
        "Is the affected area unsafe to use?",
        "Is water entering the unit?",
        "When did the damage first appear?",
      ];
    case "Pest":
      return [
        "How many sightings have occurred?",
        "Which rooms are affected?",
        "Has any treatment been applied before?",
      ];
    default:
      return [
        "Can you describe the issue in more detail?",
        "When did the issue start?",
        "Is the unit still usable?",
      ];
  }
}

function buildSafety(risk: RiskLevel) {
  if (risk === "Critical")
    return "This appears to be an immediate safety emergency. Escalate immediately and contact appropriate emergency services when necessary.";
  if (risk === "High")
    return "This issue may present a safety or property risk and should be inspected promptly by a qualified professional.";
  return "No immediate safety hazard is indicated by the information provided.";
}

function buildConfidence(
  text: string,
  detected: { category: Category | null; strength: number },
  selectedCategory: Category | "",
  risk: RiskLevel,
) {
  const words = text.trim().split(" ").filter(Boolean).length;
  let score = 60;
  if (detected.category) score += 12;
  if (detected.strength >= 2) score += 6;
  if (selectedCategory && detected.category === selectedCategory) score += 10;
  else if (selectedCategory) score += 4;
  if (words >= 8) score += 6;
  if (words >= 16) score += 4;
  if (words < 4) score -= 18;
  if (risk === "Critical" || risk === "High") score += 4;
  return Math.max(35, Math.min(98, score));
}

export function suggestedTenantResponse(opts: {
  tenant: string;
  analysis: Analysis;
}) {
  const first = (opts.tenant || "there").trim().split(" ")[0];
  const label = `${opts.analysis.priority.toLowerCase()}-priority ${opts.analysis.category.toLowerCase()} issue`;
  const closing =
    opts.analysis.riskLevel === "Critical"
      ? "This has been escalated as an emergency and is being handled immediately."
      : opts.analysis.riskLevel === "High"
        ? "This has been flagged for prompt inspection by a qualified professional."
        : `${/^[aeiou]/i.test(opts.analysis.technician) ? "An" : "A"} ${opts.analysis.technician.toLowerCase()} will be assigned to inspect it.`;
  return `Hi ${first},

Thank you for reporting the maintenance issue.

We've reviewed your request and classified it as a ${label}. ${closing}

We'll keep you updated.

Maintenance Team`;
}
