/* =========================================================
   maintenanceAnalysis.ts

   Bilingual maintenance analysis engine
   Languages:
   - English
   - French

   Architecture:
   - Normalization
   - Negation detection
   - Contextual category scoring
   - Safety detection
   - Priority escalation
   - Deterministic confidence
   - AI-ready interface

   IMPORTANT:
   This is a deterministic rule engine.
   It is designed to be enhanced by an AI classifier later.
   ========================================================= */

/* =========================================================
   TYPES
   ========================================================= */

export type Category =
  | "HVAC"
  | "Plumbing"
  | "Electrical"
  | "Appliance"
  | "Structural"
  | "Pest"
  | "Other";

export type Priority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type RiskLevel = Priority;

export type Status =
  | "New"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "Resolved";

export const CATEGORIES: Category[] = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Appliance",
  "Structural",
  "Pest",
];

export const PRIORITIES: Priority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

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

/* =========================================================
   AI-READY TYPES
   ========================================================= */

export interface AIClassification {
  category?: Category;
  priority?: Priority;
  confidence?: number;
}

export interface AnalysisOptions {
  aiResult?: AIClassification;
}

/* =========================================================
   TECHNICIANS
   ========================================================= */

const TECHNICIAN_BY_CATEGORY: Record<
  Category,
  string
> = {
  HVAC: "HVAC technician",
  Plumbing: "Licensed plumber",
  Electrical: "Licensed electrician",
  Appliance: "Appliance technician",
  Structural:
    "General maintenance / qualified contractor",
  Pest: "Pest control technician",
  Other: "General maintenance technician",
};

export function technicianRoleFor(
  category: Category,
): string {
  return TECHNICIAN_BY_CATEGORY[category];
}

/* =========================================================
   NORMALIZATION
   ========================================================= */

function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/* =========================================================
   PHRASE GROUPS
   ========================================================= */

const CATEGORY_PHRASES: Record<
  Exclude<Category, "Other">,
  string[]
> = {
  HVAC: [
    "air conditioner",
    "air conditioning",
    "ac unit",
    "ac system",
    "hvac",
    "furnace",
    "heater",
    "heating system",
    "heating",
    "thermostat",
    "cooling system",
    "heat pump",
    "refrigerant",
    "condenser",
    "evaporator",
    "airflow",
    "air flow",

    "climatisation",
    "clim",
    "climatiseur",
    "climatiseur",
    "pompe a chaleur",
    "chauffage",
    "chaudiere",
    "thermostat",
    "ventilation",
    "systeme de ventilation",
    "air ne sort plus",
    "air ne refroidit plus",
    "ne refroidit plus",
    "ne chauffe plus",
    "ne fait plus de froid",
    "ne fait plus de chaud",
  ],

  Plumbing: [
    "plumbing",
    "plumber",
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
    "leaking water",
    "sewage",
    "sewer",
    "dripping",

    "plomberie",
    "plombier",
    "evier",
    "lavabo",
    "toilettes",
    "toilette",
    "wc",
    "robinet",
    "tuyau",
    "tuyaux",
    "canalisation",
    "canalisations",
    "evacuation",
    "douche",
    "baignoire",
    "pression d'eau",
    "fuite d'eau",
    "fuite",
    "eau qui fuit",
    "eau coule",
    "ca coule",
    "degat des eaux",
    "egout",
  ],

  Electrical: [
    "electrical",
    "electrician",
    "electricity",
    "outlet",
    "outlets",
    "socket",
    "sockets",
    "plug",
    "power outlet",
    "breaker",
    "breakers",
    "circuit breaker",
    "electrical panel",
    "wiring",
    "wire",
    "wires",
    "fuse",
    "fuse box",
    "short circuit",
    "electrical shock",
    "electric shock",
    "electrocution",
    "electrocuted",
    "exposed wiring",
    "exposed wire",
    "live wire",
    "live wiring",
    "sparking",
    "sparks",

    "electrique",
    "electricien",
    "electricite",
    "prise",
    "prises",
    "prise electrique",
    "prise de courant",
    "interrupteur",
    "interrupteurs",
    "disjoncteur",
    "disjoncteurs",
    "tableau electrique",
    "tableau",
    "cable",
    "cables",
    "fil",
    "fils",
    "fil electrique",
    "fils electriques",
    "fusible",
    "court circuit",
    "courant",
    "etincelle",
    "etincelles",
    "etincelle",
    "arc electrique",
    "choc electrique",
    "electrocution",
    "fil denude",
    "fils denudes",
    "fil sous tension",
    "fils sous tension",
  ],

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
    "appliance",

    "refrigerateur",
    "frigo",
    "congelateur",
    "lave vaisselle",
    "lave-vaisselle",
    "machine a laver",
    "lave linge",
    "seche linge",
    "seche-linge",
    "seche cheveux",
    "four",
    "cuisiniere",
    "plaque de cuisson",
    "micro ondes",
    "micro-ondes",
    "appareil",
    "appareil electrique",
  ],

  Structural: [
    "structural",
    "roof",
    "ceiling",
    "wall",
    "floor",
    "door",
    "window",
    "frame",
    "lock",
    "crack",
    "broken door",
    "broken window",

    "structure",
    "toit",
    "toiture",
    "plafond",
    "mur",
    "sol",
    "porte",
    "fenetre",
    "cadre",
    "serrure",
    "fissure",
    "fissure mur",
    "porte cassee",
    "fenetre cassee",
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
    "infestation",

    "cafard",
    "cafards",
    "blatte",
    "rats",
    "rat",
    "souris",
    "rongeur",
    "punaises",
    "punaises de lit",
    "termite",
    "termites",
    "fourmis",
    "insecte",
    "insectes",
    "nuisible",
    "nuisibles",
    "infestation",
  ],
};

/* =========================================================
   DANGER / PRIORITY PHRASES
   ========================================================= */

const CRITICAL_PHRASES = [
  "active fire",
  "fire inside",
  "fire in the apartment",
  "fire in the house",
  "there is a fire",
  "there are flames",
  "on fire",
  "flames",
  "gas leak",
  "gas leakage",
  "gas smell",
  "smell of gas",
  "smells like gas",
  "explosion",
  "explosion risk",
  "electrocution",
  "electrocuted",
  "electric shock",
  "electrical shock",
  "someone was shocked",
  "life threatening",
  "life-threatening",
  "carbon monoxide emergency",
  "carbon monoxide alarm",

  "feu",
  "incendie",
  "il y a le feu",
  "flammes",
  "en feu",
  "fuite de gaz",
  "odeur de gaz",
  "sent le gaz",
  "explosion",
  "risque d'explosion",
  "electrocution",
  "electrocute",
  "choc electrique",
  "quelqu'un a pris un choc",
  "monoxyde de carbone",
  "alarme monoxyde de carbone",
];

const HIGH_PHRASES = [
  "burning smell",
  "smell of burning",
  "burning odor",
  "burning scent",
  "smells burnt",
  "smells burned",
  "smoke",
  "sparks",
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
  "sewer backup",
  "no heat in winter",
  "breaker keeps tripping",
  "breaker keeps trip",
  "breaker trips",
  "keeps tripping",

  "odeur de brule",
  "odeur de brule",
  "sent le brule",
  "sent le brûle",
  "ca sent le brule",
  "ça sent le brûlé",
  "odeur de brulee",
  "odeur de brule",
  "fumee",
  "fume",
  "etincelle",
  "etincelles",
  "arc electrique",
  "fil denude",
  "fils denudes",
  "fil sous tension",
  "fils sous tension",
  "grosse fuite",
  "inondation",
  "inonde",
  "debordement",
  "refoulement des eaux",
  "refoulement d'egout",
  "disjoncteur saute",
  "disjoncteur saute tout le temps",
  "disjoncteur disjoncte",
];

/* =========================================================
   LOW PRIORITY
   ========================================================= */

const LOW_PHRASES = [
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

  "esthetique",
  "peinture",
  "rayure",
  "rayure legere",
  "tache",
  "egratignure",
  "petite fissure",
  "poignee desserree",
  "mineur",
  "mineure",
];

/* =========================================================
   CONTEXTUAL CATEGORY RULES
   ========================================================= */

interface ContextRule {
  category: Exclude<Category, "Other">;
  terms: string[];
  weight: number;
}

const CONTEXT_RULES: ContextRule[] = [
  /* ---------------- HVAC ---------------- */

  {
    category: "HVAC",
    terms: [
      "air conditioner",
      "not cooling",
    ],
    weight: 35,
  },

  {
    category: "HVAC",
    terms: [
      "air conditioning",
      "not cooling",
    ],
    weight: 35,
  },

  {
    category: "HVAC",
    terms: [
      "climatiseur",
      "ne refroidit plus",
    ],
    weight: 40,
  },

  {
    category: "HVAC",
    terms: [
      "climatisation",
      "ne refroidit plus",
    ],
    weight: 40,
  },

  {
    category: "HVAC",
    terms: [
      "climatiseur",
      "sent le brule",
    ],
    weight: 45,
  },

  {
    category: "HVAC",
    terms: [
      "climatiseur",
      "odeur de brule",
    ],
    weight: 45,
  },

  {
    category: "HVAC",
    terms: [
      "air conditioner",
      "burning smell",
    ],
    weight: 45,
  },

  {
    category: "HVAC",
    terms: [
      "hvac",
      "burning smell",
    ],
    weight: 45,
  },

  {
    category: "HVAC",
    terms: [
      "furnace",
      "burning smell",
    ],
    weight: 45,
  },

  {
    category: "HVAC",
    terms: [
      "heater",
      "burning smell",
    ],
    weight: 45,
  },

  /* ---------------- ELECTRICAL ---------------- */

  {
    category: "Electrical",
    terms: [
      "outlet",
      "burning smell",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "socket",
      "burning smell",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "prise",
      "odeur de brule",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "prise",
      "sent le brule",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "prise",
      "fume",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "prise",
      "etincelle",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "prise",
      "chauffe",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "socket",
      "sparking",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "outlet",
      "sparking",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "breaker",
      "keeps tripping",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "disjoncteur",
      "saute",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "disjoncteur",
      "disjoncte",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "tableau electrique",
      "fume",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "tableau electrique",
      "odeur de brule",
    ],
    weight: 80,
  },

  {
    category: "Electrical",
    terms: [
      "electrical",
      "burning smell",
    ],
    weight: 60,
  },

  {
    category: "Electrical",
    terms: [
      "electrical",
      "sparking",
    ],
    weight: 70,
  },

  {
    category: "Electrical",
    terms: [
      "electricite",
      "odeur de brule",
    ],
    weight: 65,
  },

  {
    category: "Electrical",
    terms: [
      "electricite",
      "etincelle",
    ],
    weight: 70,
  },

  /* ---------------- APPLIANCE ---------------- */

  {
    category: "Appliance",
    terms: [
      "refrigerator",
      "not cooling",
    ],
    weight: 45,
  },

  {
    category: "Appliance",
    terms: [
      "fridge",
      "not cooling",
    ],
    weight: 45,
  },

  {
    category: "Appliance",
    terms: [
      "washing machine",
      "not starting",
    ],
    weight: 45,
  },

  {
    category: "Appliance",
    terms: [
      "machine a laver",
      "ne demarre plus",
    ],
    weight: 50,
  },

  {
    category: "Appliance",
    terms: [
      "machine a laver",
      "odeur de brule",
    ],
    weight: 70,
  },

  {
    category: "Appliance",
    terms: [
      "lave linge",
      "odeur de brule",
    ],
    weight: 70,
  },

  {
    category: "Appliance",
    terms: [
      "dryer",
      "not heating",
    ],
    weight: 45,
  },

  {
    category: "Appliance",
    terms: [
      "oven",
      "not heating",
    ],
    weight: 45,
  },

  {
    category: "Appliance",
    terms: [
      "four",
      "ne chauffe plus",
    ],
    weight: 50,
  },

  {
    category: "Appliance",
    terms: [
      "four",
      "odeur de brule",
    ],
    weight: 70,
  },

  {
    category: "Appliance",
    terms: [
      "refrigerateur",
      "odeur de brule",
    ],
    weight: 70,
  },

  /* ---------------- PLUMBING ---------------- */

  {
    category: "Plumbing",
    terms: [
      "sink",
      "water leak",
    ],
    weight: 50,
  },

  {
    category: "Plumbing",
    terms: [
      "toilet",
      "water leak",
    ],
    weight: 50,
  },

  {
    category: "Plumbing",
    terms: [
      "pipe",
      "water leak",
    ],
    weight: 55,
  },

  {
    category: "Plumbing",
    terms: [
      "evier",
      "fuite",
    ],
    weight: 55,
  },

  {
    category: "Plumbing",
    terms: [
      "lavabo",
      "fuite",
    ],
    weight: 55,
  },

  {
    category: "Plumbing",
    terms: [
      "toilette",
      "fuite",
    ],
    weight: 55,
  },

  {
    category: "Plumbing",
    terms: [
      "tuyau",
      "fuite",
    ],
    weight: 55,
  },

  {
    category: "Plumbing",
    terms: [
      "douche",
      "pression",
    ],
    weight: 45,
  },

  /* ---------------- STRUCTURAL ---------------- */

  {
    category: "Structural",
    terms: [
      "door",
      "lock",
    ],
    weight: 45,
  },

  {
    category: "Structural",
    terms: [
      "window",
      "frame",
    ],
    weight: 45,
  },

  {
    category: "Structural",
    terms: [
      "wall",
      "crack",
    ],
    weight: 55,
  },

  {
    category: "Structural",
    terms: [
      "mur",
      "fissure",
    ],
    weight: 60,
  },

  {
    category: "Structural",
    terms: [
      "plafond",
      "fuite",
    ],
    weight: 45,
  },

  {
    category: "Structural",
    terms: [
      "toit",
      "fuite",
    ],
    weight: 50,
  },

  /* ---------------- PEST ---------------- */

  {
    category: "Pest",
    terms: [
      "cockroach",
      "kitchen",
    ],
    weight: 50,
  },

  {
    category: "Pest",
    terms: [
      "mouse",
      "droppings",
    ],
    weight: 60,
  },

  {
    category: "Pest",
    terms: [
      "rat",
      "droppings",
    ],
    weight: 60,
  },

  {
    category: "Pest",
    terms: [
      "cafards",
      "cuisine",
    ],
    weight: 55,
  },

  {
    category: "Pest",
    terms: [
      "souris",
      "crottes",
    ],
    weight: 60,
  },

  {
    category: "Pest",
    terms: [
      "rats",
      "crottes",
    ],
    weight: 60,
  },
];

/* =========================================================
   NEGATION ENGINE
   ========================================================= */

const NEGATION_WORDS = [
  "no",
  "not",
  "never",
  "without",
  "isn't",
  "isnt",
  "aren't",
  "arent",
  "wasn't",
  "wasnt",
  "weren't",
  "werent",
  "doesn't",
  "doesnt",
  "don't",
  "dont",
  "didn't",
  "didnt",

  "pas",
  "aucun",
  "aucune",
  "sans",
  "jamais",
  "ne",
  "n'est",
  "nest",
  "n'est pas",
  "n'a pas",
  "na pas",
  "n'y a pas",
  "ny a pas",
];

/*
 * Detects whether a phrase is negated in its
 * immediate linguistic context.
 *
 * Examples:
 *
 * "no smoke" -> true
 * "pas de fumee" -> true
 * "ne sent pas le brule" -> true
 * "no burning smell" -> true
 *
 * But:
 *
 * "not cooling and there is a burning smell"
 *
 * should NOT negate "burning smell".
 */
function isNegated(
  text: string,
  term: string,
): boolean {
  let from = 0;

  while (true) {
    const index = text.indexOf(
      term,
      from,
    );

    if (index === -1) {
      return false;
    }

    const before = text
      .slice(
        Math.max(0, index - 60),
        index,
      )
      .trim();

    /*
     * Direct English negation.
     */
    const englishNegation =
      /(?:^|\s)(?:no|not|never|without|isn't|isnt|aren't|arent|wasn't|wasnt|weren't|werent|doesn't|doesnt|don't|dont|didn't|didnt)\s+(?:[\w'-]+\s+){0,3}$/i.test(
        before,
      );

    /*
     * French:
     *
     * pas de brule
     * ne sent pas le brule
     * n'y a pas de fumee
     * aucune fumee
     * sans fumee
     */
    const frenchNegation =
      /(?:^|\s)(?:pas|aucun|aucune|sans|jamais)\s+(?:de\s+)?(?:[\w'-]+\s+){0,3}$/i.test(
        before,
      ) ||
      /(?:ne|n)\s+(?:[\w'-]+\s+){0,3}(?:pas|plus)\s+(?:[\w'-]+\s+){0,3}$/i.test(
        before,
      );

    if (
      englishNegation ||
      frenchNegation
    ) {
      from =
        index + term.length;
      continue;
    }

    return false;
  }
}

/* =========================================================
   MATCH HELPERS
   ========================================================= */

function has(
  text: string,
  terms: string[],
): boolean {
  return terms.some(
    (term) =>
      text.includes(term) &&
      !isNegated(text, term),
  );
}

function countMatches(
  text: string,
  terms: string[],
): number {
  return terms.reduce(
    (count, term) => {
      if (
        text.includes(term) &&
        !isNegated(text, term)
      ) {
        return count + 1;
      }

      return count;
    },
    0,
  );
}

/* =========================================================
   SPECIAL DANGER DETECTION
   ========================================================= */

function hasCriticalCondition(
  text: string,
): boolean {
  return has(
    text,
    CRITICAL_PHRASES,
  );
}

function hasHighRiskCondition(
  text: string,
): boolean {
  return has(
    text,
    HIGH_PHRASES,
  );
}

/* =========================================================
   CATEGORY DETECTION
   ========================================================= */

function detectCategory(
  text: string,
): {
  category: Category | null;
  strength: number;
} {
  const categories: Exclude<
    Category,
    "Other"
  >[] = [
    "HVAC",
    "Plumbing",
    "Electrical",
    "Appliance",
    "Structural",
    "Pest",
  ];

  const scores: Record<
    Exclude<Category, "Other">,
    number
  > = {
    HVAC: 0,
    Plumbing: 0,
    Electrical: 0,
    Appliance: 0,
    Structural: 0,
    Pest: 0,
  };

  /* -------------------------------------------------------
     1. Base keyword evidence
     ------------------------------------------------------- */

  for (const category of categories) {
    scores[category] +=
      countMatches(
        text,
        CATEGORY_PHRASES[category],
      ) * 5;
  }

  /* -------------------------------------------------------
     2. Contextual rules
     ------------------------------------------------------- */

  for (const rule of CONTEXT_RULES) {
    const matched = rule.terms.every(
      (term) =>
        text.includes(term) &&
        !isNegated(text, term),
    );

    if (matched) {
      scores[rule.category] +=
        rule.weight;
    }
  }

  /* -------------------------------------------------------
     3. Explicit object ownership
     
     This is critical for ambiguous cases.

     "prise sent le brule"
     => Electrical

     "machine a laver sent le brule"
     => Appliance

     "climatiseur sent le brule"
     => HVAC
     ------------------------------------------------------- */

  const electricalObject =
    has(text, [
      "prise",
      "prise electrique",
      "prise de courant",
      "outlet",
      "socket",
      "disjoncteur",
      "breaker",
      "tableau electrique",
      "electrical panel",
      "wiring",
      "cable",
      "fil electrique",
    ]);

  const applianceObject =
    has(text, [
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

      "refrigerateur",
      "frigo",
      "congelateur",
      "lave vaisselle",
      "machine a laver",
      "lave linge",
      "seche linge",
      "four",
      "cuisiniere",
      "micro ondes",
    ]);

  const hvacObject =
    has(text, [
      "air conditioner",
      "air conditioning",
      "ac unit",
      "hvac",
      "furnace",
      "heater",
      "heat pump",

      "climatiseur",
      "climatisation",
      "chaudiere",
      "chauffage",
      "pompe a chaleur",
    ]);

  const plumbingObject =
    has(text, [
      "sink",
      "toilet",
      "faucet",
      "pipe",
      "drain",
      "shower",
      "bathtub",

      "evier",
      "lavabo",
      "toilette",
      "robinet",
      "tuyau",
      "canalisation",
      "douche",
      "baignoire",
    ]);

  /* -------------------------------------------------------
     4. Burning smell contextual ownership
     ------------------------------------------------------- */

  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells burnt",

      "odeur de brule",
      "sent le brule",
      "ca sent le brule",
      "odeur de brulee",
    ]);

  if (burning) {
    if (electricalObject) {
      scores.Electrical += 100;
    }

    if (applianceObject) {
      scores.Appliance += 90;
    }

    if (hvacObject) {
      scores.HVAC += 90;
    }
  }

  /* -------------------------------------------------------
     5. Water context disambiguation
     ------------------------------------------------------- */

  const water =
    has(text, [
      "water",
      "water leak",
      "leaking water",
      "flooding",
      "water damage",

      "eau",
      "fuite d'eau",
      "eau qui coule",
      "ca coule",
      "inondation",
      "degat des eaux",
    ]);

  if (water) {
    if (
      has(text, [
        "roof",
        "ceiling",
        "wall",
        "toit",
        "plafond",
        "mur",
      ])
    ) {
      scores.Structural += 45;
    }

    if (
      plumbingObject
    ) {
      scores.Plumbing += 60;
    }
  }

  /* -------------------------------------------------------
     6. Pick strongest category
     ------------------------------------------------------- */

  let bestCategory:
    | Exclude<Category, "Other">
    | null = null;

  let bestScore = 0;

  let secondScore = 0;

  for (const category of categories) {
    const score =
      scores[category];

    if (score > bestScore) {
      secondScore = bestScore;
      bestScore = score;
      bestCategory = category;
    } else if (
      score > secondScore
    ) {
      secondScore = score;
    }
  }

  if (
    bestCategory === null ||
    bestScore < 5
  ) {
    return {
      category: null,
      strength: 0,
    };
  }

  /*
   * If two categories are almost tied and
   * there is no strong contextual evidence,
   * avoid overconfident classification.
   */
  if (
    bestScore < 20 &&
    bestScore - secondScore <= 3
  ) {
    return {
      category: null,
      strength: 0,
    };
  }

  return {
    category: bestCategory,
    strength: bestScore,
  };
}

/* =========================================================
   PRIORITY DETECTION
   ========================================================= */

function detectPriority(
  text: string,
  category: Category,
): Priority {
  /* -------------------------------------------------------
     CRITICAL
     ------------------------------------------------------- */

  if (
    hasCriticalCondition(text)
  ) {
    return "Critical";
  }

  /* -------------------------------------------------------
     HIGH SAFETY CONDITIONS
     ------------------------------------------------------- */

  if (
    hasHighRiskCondition(text)
  ) {
    return "High";
  }

  /* -------------------------------------------------------
     Contextual high-risk conditions
     ------------------------------------------------------- */

  if (
    category === "Electrical" &&
    has(text, [
      "sparks",
      "sparking",
      "spark",
      "etincelle",
      "etincelles",
      "arc electrique",
      "short circuit",
      "court circuit",
      "exposed wire",
      "exposed wiring",
      "fil denude",
      "fils denudes",
      "live wire",
      "live wiring",
      "fil sous tension",
      "fils sous tension",
    ])
  ) {
    return "High";
  }

  if (
    category === "Plumbing" &&
    has(text, [
      "major flooding",
      "flooding",
      "flooded",
      "sewage backup",
      "inondation",
      "inonde",
      "refoulement",
      "grosse fuite",
    ])
  ) {
    return "High";
  }

  /* -------------------------------------------------------
     LOW
     ------------------------------------------------------- */

  if (
    has(text, LOW_PHRASES)
  ) {
    return "Low";
  }

  return "Medium";
}

/* =========================================================
   PROBLEM SUMMARY
   ========================================================= */

function buildProblemSummary(
  text: string,
  category: Category,
  priority: Priority,
): string {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells burnt",

      "odeur de brule",
      "sent le brule",
      "ca sent le brule",
      "odeur de brulee",
    ]);

  if (
    category === "Electrical" &&
    burning
  ) {
    return "Reported electrical equipment with a burning odor. This may indicate overheating or an electrical fault and requires prompt professional inspection.";
  }

  if (
    category === "Appliance" &&
    burning
  ) {
    return "Reported appliance with a burning odor. This may indicate overheating or an internal fault and requires prompt professional inspection.";
  }

  if (
    category === "HVAC" &&
    burning
  ) {
    return "Reported HVAC equipment with a burning odor. This may indicate overheating or an equipment fault and requires urgent professional inspection.";
  }

  if (
    category === "Electrical"
  ) {
    return "Possible electrical system issue requiring inspection by a qualified electrician.";
  }

  if (
    category === "HVAC"
  ) {
    return "Possible HVAC system issue requiring inspection by an HVAC technician.";
  }

  if (
    category === "Plumbing"
  ) {
    return "Possible plumbing issue requiring inspection to determine the source and extent of the problem.";
  }

  if (
    category === "Appliance"
  ) {
    return "Possible appliance malfunction requiring inspection by an appliance technician.";
  }

  if (
    category === "Structural"
  ) {
    return "Possible building or structural maintenance issue requiring inspection.";
  }

  if (
    category === "Pest"
  ) {
    return "Possible pest infestation requiring assessment and appropriate pest-control treatment.";
  }

  if (
    priority === "Critical"
  ) {
    return "Reported immediate emergency condition. The exact cause cannot be confirmed without an on-site inspection.";
  }

  if (
    priority === "High"
  ) {
    return "Reported maintenance issue with elevated safety or property-damage risk. The exact source requires professional inspection.";
  }

  return "Maintenance issue reported. The exact cause cannot be confirmed without an on-site inspection.";
}

/* =========================================================
   RECOMMENDED ACTION
   ========================================================= */

function buildRecommendedAction(
  category: Category,
  priority: Priority,
  text: string,
): string {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells burnt",

      "odeur de brule",
      "sent le brule",
      "ca sent le brule",
    ]);

  if (
    priority === "Critical"
  ) {
    return "Escalate immediately and follow emergency procedures. Contact appropriate emergency services when there is an immediate danger.";
  }

  if (
    priority === "High" &&
    category === "Electrical"
  ) {
    return burning
      ? "Avoid using the affected electrical equipment if it is safe to do so and dispatch a qualified electrician for urgent inspection. Escalate immediately if smoke, fire, or electric shock occurs."
      : "Treat this as an urgent electrical safety issue and dispatch a qualified electrician for prompt inspection.";
  }

  if (
    priority === "High" &&
    category === "HVAC"
  ) {
    return "Stop using the HVAC equipment if it is safe to do so and dispatch an HVAC technician for urgent inspection. Escalate immediately if smoke or fire develops.";
  }

  if (
    priority === "High" &&
    category === "Appliance"
  ) {
    return "Stop using the affected appliance if it is safe to do so and dispatch an appliance technician for urgent inspection. Escalate immediately if smoke or fire develops.";
  }

  if (
    priority === "High"
  ) {
    return `Assign a ${technicianRoleFor(
      category,
    )} for urgent inspection and corrective action.`;
  }

  if (
    category === "HVAC"
  ) {
    return "Assign an HVAC technician to inspect the heating, cooling, or ventilation system.";
  }

  if (
    category === "Plumbing"
  ) {
    return "Assign a licensed plumber to inspect the plumbing system and identify the source of the issue.";
  }

  if (
    category === "Electrical"
  ) {
    return "Assign a licensed electrician to inspect the electrical system.";
  }

  if (
    category === "Appliance"
  ) {
    return "Assign an appliance technician to inspect the appliance.";
  }

  if (
    category === "Structural"
  ) {
    return "Assign qualified maintenance personnel or a contractor to inspect the affected area.";
  }

  if (
    category === "Pest"
  ) {
    return "Assign a pest control technician to inspect the affected area.";
  }

  return "Assign a general maintenance technician to inspect the reported issue.";
}

/* =========================================================
   SAFETY ASSESSMENT
   ========================================================= */

function buildSafetyAssessment(
  priority: Priority,
  category: Category,
  text: string,
): string {
  if (
    priority === "Critical"
  ) {
    return "Immediate safety hazard indicated. Escalate without delay and follow emergency procedures.";
  }

  if (
    priority === "High"
  ) {
    if (
      category === "Electrical"
    ) {
      return "Potential electrical safety hazard indicated. Avoid unsafe contact and arrange urgent inspection by a qualified electrician.";
    }

    if (
      category === "HVAC"
    ) {
      return "Potential HVAC safety hazard indicated. The equipment should be inspected urgently.";
    }

    if (
      category === "Appliance"
    ) {
      return "Potential appliance safety hazard indicated. The equipment should be inspected urgently.";
    }

    return "Elevated safety or property-damage risk is indicated. Prompt professional inspection is recommended.";
  }

  if (
    priority === "Low"
  ) {
    return "No immediate safety hazard is indicated by the information provided.";
  }

  return "No immediate safety hazard is indicated by the information provided.";
}

/* =========================================================
   FOLLOW-UP QUESTIONS
   ========================================================= */

function buildFollowUpQuestions(
  category: Category,
  text: string,
): string[] {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells burnt",

      "odeur de brule",
      "sent le brule",
      "ca sent le brule",
    ]);

  if (
    category === "Electrical"
  ) {
    if (burning) {
      return [
        "Has the affected outlet or equipment been turned off?",
        "Is there any visible smoke, sparking, or heat?",
        "Is the burning smell getting stronger?",
      ];
    }

    return [
      "Are there sparks or visible smoke?",
      "Is the affected equipment still powered?",
      "Has the breaker or fuse tripped?",
    ];
  }

  if (
    category === "HVAC"
  ) {
    if (burning) {
      return [
        "Has the HVAC unit been turned off?",
        "Is there any visible smoke or fire?",
        "Is the burning smell getting stronger?",
      ];
    }

    return [
      "Is the system still running?",
      "Is the system producing cold or warm air?",
      "Is there any unusual noise, smell, or water leakage?",
    ];
  }

  if (
    category === "Appliance"
  ) {
    if (burning) {
      return [
        "Has the appliance been turned off?",
        "Is there any visible smoke or sparking?",
        "Is the burning smell getting stronger?",
      ];
    }

    return [
      "Is the appliance still running?",
      "Does the appliance have power?",
      "Is there any unusual noise or smell?",
    ];
  }

  if (
    category === "Plumbing"
  ) {
    return [
      "Is the water leak still active?",
      "How much water is leaking?",
      "Can the water supply be safely shut off?",
    ];
  }

  if (
    category === "Structural"
  ) {
    return [
      "Is the affected area still usable?",
      "Is there visible damage, movement, or cracking?",
      "Is there any water intrusion?",
    ];
  }

  if (
    category === "Pest"
  ) {
    return [
      "Where were the pests observed?",
      "How many were seen?",
      "Are there signs of an active infestation?",
    ];
  }

  return [
    "Is the issue still occurring?",
    "When did the problem start?",
    "Has anything already been done to resolve it?",
  ];
}

/* =========================================================
   CONFIDENCE
   ========================================================= */

function calculateConfidence(
  detectedCategory: Category | null,
  finalCategory: Category,
  strength: number,
  priority: Priority,
): number {
  let confidence = 0.72;

  if (
    detectedCategory === finalCategory
  ) {
    confidence += 0.10;
  }

  if (
    strength >= 20
  ) {
    confidence += 0.08;
  }

  if (
    strength >= 50
  ) {
    confidence += 0.05;
  }

  if (
    finalCategory === "Other"
  ) {
    confidence = Math.min(
      confidence,
      0.80,
    );
  }

  if (
    priority === "High"
  ) {
    confidence = Math.max(
      confidence,
      0.90,
    );
  }

  if (
    priority === "Critical"
  ) {
    confidence = Math.max(
      confidence,
      0.95,
    );
  }

  return Math.min(
    0.99,
    Number(
      confidence.toFixed(2),
    ),
  );
}

/* =========================================================
   AI MERGE
   ========================================================= */

/*
 * AI should NOT blindly override deterministic safety rules.
 *
 * Example:
 *
 * Local engine:
 *   outlet + burning smell => Electrical / High
 *
 * AI:
 *   Appliance / Medium
 *
 * We keep the deterministic safety result.
 *
 * Later, this function can be expanded with
 * confidence thresholds and structured AI output.
 */
function mergeAIResult(
  localCategory: Category,
  localPriority: Priority,
  aiResult?: AIClassification,
): {
  category: Category;
  priority: Priority;
} {
  if (!aiResult) {
    return {
      category: localCategory,
      priority: localPriority,
    };
  }

  const dangerousPriority =
    localPriority === "Critical" ||
    localPriority === "High";

  /*
   * Never allow AI to downgrade
   * a deterministic safety escalation.
   */
  if (
    dangerousPriority
  ) {
    return {
      category:
        localCategory !== "Other"
          ? localCategory
          : aiResult.category ||
            localCategory,

      priority:
        localPriority,
    };
  }

  /*
   * For normal cases, AI can help
   * when it has sufficient confidence.
   */
  if (
    aiResult.category &&
    (aiResult.confidence ?? 0) >= 0.80
  ) {
    localCategory =
      aiResult.category;
  }

  if (
    aiResult.priority &&
    (aiResult.confidence ?? 0) >= 0.85
  ) {
    localPriority =
      aiResult.priority;
  }

  return {
    category: localCategory,
    priority: localPriority,
  };
}

/* =========================================================
   MAIN ANALYSIS
   ========================================================= */

export function analyzeMaintenanceRequest(
  input: {
    description: string;
    selectedCategory?: Category | "";
    selectedPriority?: Priority | "";
    options?: AnalysisOptions;
  },
): Analysis {
  const text =
    normalize(
      input.description || "",
    );

  /*
   * Empty description.
   */
  if (!text.trim()) {
    return {
      category: "Other",
      priority:
        input.selectedPriority ||
        "Medium",
      riskLevel:
        input.selectedPriority ||
        "Medium",
      problemSummary:
        "No maintenance description was provided.",
      recommendedAction:
        "Request more information before assigning the maintenance request.",
      technician:
        technicianRoleFor("Other"),
      followUpQuestions: [
        "What problem are you experiencing?",
        "Where is the problem located?",
        "When did the problem start?",
      ],
      safetyAssessment:
        "Safety cannot be assessed from the information provided.",
      confidence: 0.20,
    };
  }

  /* -------------------------------------------------------
     Automatic classification
     ------------------------------------------------------- */

  const detected =
    detectCategory(text);

  /*
   * Manual category selection wins.
   */
  let category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Determine priority from actual text.
   */
  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  let priority: Priority;

  /*
   * Safety escalation ALWAYS wins.
   */
  if (
    detectedPriority === "Critical"
  ) {
    priority = "Critical";
  } else if (
    detectedPriority === "High"
  ) {
    priority = "High";
  } else if (
    input.selectedPriority
  ) {
    priority =
      input.selectedPriority;
  } else {
    priority =
      detectedPriority;
  }

  /*
   * Optional AI layer.
   */
  const merged =
    mergeAIResult(
      category,
      priority,
      input.options?.aiResult,
    );

  category =
    merged.category;

  priority =
    merged.priority;

  const riskLevel: RiskLevel =
    priority;

  /* -------------------------------------------------------
     Build final analysis
     ------------------------------------------------------- */

  const problemSummary =
    buildProblemSummary(
      text,
      category,
      priority,
    );

  const recommendedAction =
    buildRecommendedAction(
      category,
      priority,
      text,
    );

  const technician =
    technicianRoleFor(
      category,
    );

  const followUpQuestions =
    buildFollowUpQuestions(
      category,
      text,
    );

  const safetyAssessment =
    buildSafetyAssessment(
      priority,
      category,
      text,
    );

  const confidence =
    calculateConfidence(
      detected.category,
      category,
      detected.strength,
      priority,
    );

  return {
    category,
    priority,
    riskLevel,
    problemSummary,
    recommendedAction,
    technician,
    followUpQuestions,
    safetyAssessment,
    confidence,
  };
}

/* =========================================================
   TENANT RESPONSE
   ========================================================= */

export function suggestedTenantResponse(
  input: {
    tenant: string;
    analysis: Analysis;
  },
): string {
  const {
    tenant,
    analysis,
  } = input;

  if (
    analysis.priority ===
    "Critical"
  ) {
    return `Hi ${tenant}, thank you for reporting this issue. We are treating it as an urgent safety matter and escalating it immediately. Please avoid the affected area or equipment if it is unsafe to approach, and contact emergency services if there is an immediate danger.`;
  }

  if (
    analysis.priority ===
    "High"
  ) {
    return `Hi ${tenant}, thank you for reporting this issue. We have identified it as a high-priority maintenance concern and will arrange an urgent inspection by a ${analysis.technician}. Please avoid using the affected equipment if doing so could be unsafe.`;
  }

  if (
    analysis.priority ===
    "Medium"
  ) {
    return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to inspect it. We will provide an update once the inspection is scheduled.`;
  }

  return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to review it.`;
}

/* =========================================================
   OPTIONAL DEBUG FUNCTION
   ========================================================= */

/*
 * Useful during development.
 *
 * It lets you see the raw normalized description
 * and the resulting classification.
 */
export function debugMaintenanceRequest(
  description: string,
) {
  const text =
    normalize(description);

  const detected =
    detectCategory(text);

  const priority =
    detectPriority(
      text,
      detected.category || "Other",
    );

  return {
    original: description,
    normalized: text.trim(),
    detectedCategory:
      detected.category,
    categoryStrength:
      detected.strength,
    detectedPriority:
      priority,
  };
}
