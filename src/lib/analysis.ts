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
    "heat pump",
    "refrigerant",
    "condenser",
    "evaporator",
    "duct",
    "airflow",
    "air flow",
  ],

  Plumbing: [
    "sink",
    "toilet",
    "faucet",
    "pipe",
    "pipes",
    "drain",
    "shower",
    "bathtub",
    "water pressure",
    "water leak",
    "water leakage",
    "plumbing",
    "plumber",
    "leaking water",
  ],

  Electrical: [
    "outlet",
    "outlets",
    "socket",
    "sockets",
    "breaker",
    "breakers",
    "circuit breaker",
    "electrical",
    "electricity",
    "electrician",
    "wiring",
    "wire",
    "wires",
    "power",
    "light switch",
    "switch",
    "spark",
    "sparks",
    "sparking",
    "short circuit",
    "fuse",
    "fuse box",
    "electrical panel",
    "electrical shock",
    "electric shock",
    "exposed wiring",
    "exposed wire",
    "live wire",
    "live wiring",
  ],

  Structural: [
    "door",
    "window",
    "roof",
    "ceiling",
    "wall",
    "lock",
    "floor",
    "frame",
    "structural",
  ],

  Pest: [
    "cockroach",
    "roach",
    "rat",
    "mouse",
    "rodent",
    "bed bugs",
    "bedbug",
    "termite",
    "ants",
    "insects",
    "pest",
  ],
};

/*
 * Strong combinations are intentionally weighted higher
 * than generic keywords.
 *
 * Example:
 * "outlets + breaker + keeps tripping"
 * must strongly favor Electrical.
 */
const CATEGORY_COMBINATIONS: Record<
  Exclude<Category, "Other">,
  { terms: string[]; weight: number }[]
> = {
  Electrical: [
    { terms: ["outlet", "breaker"], weight: 6 },
    { terms: ["outlets", "breaker"], weight: 6 },
    { terms: ["socket", "breaker"], weight: 6 },
    { terms: ["sockets", "breaker"], weight: 6 },

    { terms: ["outlet", "no power"], weight: 6 },
    { terms: ["outlets", "no power"], weight: 6 },
    { terms: ["socket", "no power"], weight: 6 },
    { terms: ["sockets", "no power"], weight: 6 },

    { terms: ["breaker", "keeps tripping"], weight: 8 },
    { terms: ["breaker", "keeps trip"], weight: 8 },
    { terms: ["breaker", "trips"], weight: 6 },
    { terms: ["breaker", "trip"], weight: 5 },

    { terms: ["sparks", "outlet"], weight: 7 },
    { terms: ["sparking", "outlet"], weight: 7 },
    { terms: ["spark", "outlet"], weight: 7 },

    { terms: ["sparks", "electrical"], weight: 7 },
    { terms: ["sparking", "electrical"], weight: 7 },

    { terms: ["burning smell", "outlet"], weight: 7 },
    { terms: ["burning smell", "electrical"], weight: 7 },

    { terms: ["exposed wire", "electrical"], weight: 8 },
    { terms: ["exposed wiring", "electrical"], weight: 8 },
    { terms: ["live wire", "electrical"], weight: 8 },
    { terms: ["live wiring", "electrical"], weight: 8 },

    { terms: ["short circuit", "power"], weight: 7 },
    { terms: ["short circuit", "electrical"], weight: 7 },
  ],

  HVAC: [
    { terms: ["thermostat", "heating"], weight: 5 },
    { terms: ["thermostat", "cooling"], weight: 5 },
    { terms: ["air conditioner", "not cooling"], weight: 6 },
    { terms: ["air conditioning", "not cooling"], weight: 6 },
    { terms: ["furnace", "not heating"], weight: 6 },
    { terms: ["heater", "not heating"], weight: 6 },
  ],

  Appliance: [
    { terms: ["refrigerator", "not cooling"], weight: 6 },
    { terms: ["fridge", "not cooling"], weight: 6 },
    { terms: ["dishwasher", "not draining"], weight: 6 },
    { terms: ["washing machine", "not starting"], weight: 6 },
    { terms: ["washer", "not starting"], weight: 6 },
  ],

  Plumbing: [
    { terms: ["pipe", "water leak"], weight: 6 },
    { terms: ["sink", "water leak"], weight: 6 },
    { terms: ["toilet", "water leak"], weight: 6 },
    { terms: ["faucet", "water leak"], weight: 6 },
  ],

  Structural: [
    { terms: ["door", "lock"], weight: 5 },
    { terms: ["window", "frame"], weight: 5 },
    { terms: ["ceiling", "water"], weight: 5 },
    { terms: ["roof", "water"], weight: 5 },
  ],

  Pest: [
    { terms: ["cockroach", "kitchen"], weight: 5 },
    { terms: ["mouse", "droppings"], weight: 6 },
    { terms: ["rat", "droppings"], weight: 6 },
  ],
};

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

/*
 * Normalize text before classification.
 */
function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/*
 * Check whether a term is negated.
 *
 * Examples:
 * "no smoke" -> smoke is NOT present
 * "without sparks" -> sparks are NOT present
 * "there is no fire" -> fire is NOT present
 *
 * "there are sparks" -> sparks ARE present
 */
function negated(text: string, term: string) {
  let searchFrom = 0;

  while (true) {
    const idx = text.indexOf(term, searchFrom);

    if (idx < 0) {
      return false;
    }

    const before = text.slice(Math.max(0, idx - 80), idx);

    const negationPattern =
      /\b(no|not|without|isn't|is not|aren't|are not|there is no|there are no)\b[^.!?]*$/i;

    if (negationPattern.test(before)) {
      searchFrom = idx + term.length;
      continue;
    }

    return false;
  }
}

function has(text: string, terms: string[]) {
  return terms.some(
    (term) => text.includes(term) && !negated(text, term),
  );
}

function countMatches(text: string, terms: string[]) {
  return terms.reduce(
    (count, term) =>
      count + (text.includes(term) && !negated(text, term) ? 1 : 0),
    0,
  );
}

/*
 * IMPORTANT:
 * "smoke" alone is NOT Critical.
 * "smoke" alone is also NOT enough to classify something as Electrical.
 *
 * Critical requires a clear immediate safety emergency.
 */
const CRITICAL_TERMS = [
  "active fire",
  "fire in",
  "fire inside",
  "on fire",
  "there is a fire",
  "there are flames",
  "flames",
  "gas leak",
  "gas leakage",
  "gas smell",
  "smell of gas",
  "smells like gas",
  "explosion",
  "explosion risk",
  "electrical shock",
  "electric shock",
  "electrocution",
  "electrocuted",
  "someone was shocked",
  "life-threatening",
  "life threatening",
  "carbon monoxide emergency",
  "carbon monoxide alarm",
];

const HIGH_TERMS = [
  "burning smell",
  "smell of burning",
  "burning odor",
  "sparks",
  "spark",
  "sparking",
  "exposed wiring",
  "exposed wire",
  "exposed live wire",
  "exposed live wiring",
  "live wire",
  "live wiring",
  "major flooding",
  "flooding",
  "flooded",
  "sewage backup",
  "no heat in winter",
  "breaker keeps tripping",
  "breaker keeps trip",
  "breaker trips",
  "breaker trip",
  "keeps tripping",
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
  "outlets",
  "socket",
  "sockets",
  "electrical",
  "electricity",
  "wiring",
  "wire",
  "wires",
  "breaker",
  "breakers",
  "panel",
  "light switch",
  "electrical equipment",
];

function detectCategory(text: string): {
  category: Category | null;
  strength: number;
} {
  let bestCategory: Category | null = null;
  let bestScore = 0;

  const categories = Object.keys(
    KEYWORDS,
  ) as Exclude<Category, "Other">[];

  for (const category of categories) {
    /*
     * Generic keyword evidence.
     *
     * Each keyword gives 2 points.
     */
    let score = countMatches(text, KEYWORDS[category]) * 2;

    /*
     * Strong combinations receive additional weight.
     */
    for (const combination of CATEGORY_COMBINATIONS[category]) {
      const matches = combination.terms.every(
        (term) =>
          text.includes(term) && !negated(text, term),
      );

     
