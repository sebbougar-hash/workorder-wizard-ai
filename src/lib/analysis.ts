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
  "Other",
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
   CATEGORY KEYWORDS
   ========================================================= */

const KEYWORDS: Record<
  Exclude<Category, "Other">,
  string[]
> = {
  HVAC: [
    "air conditioner",
    "air conditioning",
    "hvac",
    "furnace",
    "heater",
    "heating",
    "thermostat",
    "heat pump",
    "cooling system",
    "airflow",
    "air flow",
    "refrigerant",
    "condenser",
    "evaporator",
    "ductwork",
    "duct",
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
    "water supply",
    "drainage",
    "clogged drain",
    "clogged sink",
    "blocked drain",
    "blocked sink",
  ],

  Electrical: [
    "electrical",
    "electrician",
    "electricity",
    "outlet",
    "outlets",
    "socket",
    "sockets",
    "breaker",
    "breakers",
    "circuit breaker",
    "electrical panel",
    "fuse",
    "fuse box",
    "wiring",
    "wire",
    "wires",
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
    "garbage disposal",
    "disposal",
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
    "cracked",
    "damage",
    "damaged",
    "hole",
    "broken door",
    "broken window",
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
    "droppings",
  ],
};

/* =========================================================
   CONTEXTUAL PATTERNS
   Strong contextual evidence beats generic keywords.
   ========================================================= */

const CONTEXT_RULES: {
  category: Exclude<Category, "Other">;
  patterns: string[];
  weight: number;
}[] = [
  /* ---------------- HVAC ---------------- */

  {
    category: "HVAC",
    patterns: [
      "air conditioner not cooling",
      "air conditioner is not cooling",
      "ac not cooling",
      "ac is not cooling",
      "air conditioning not working",
      "air conditioning is not working",
      "hvac not working",
      "hvac is not working",
      "heater not working",
      "heater is not working",
      "furnace not working",
      "furnace is not working",
      "furnace not heating",
      "heater not heating",
      "thermostat not working",
      "thermostat is not working",
      "no cold air",
      "no cool air",
      "no heat",
      "air conditioner blowing warm air",
      "ac blowing warm air",
      "heating system not working",
      "cooling system not working",
    ],
    weight: 30,
  },

  {
    category: "HVAC",
    patterns: [
      "air conditioner making noise",
      "air conditioner making a noise",
      "ac making noise",
      "furnace making noise",
      "heater making noise",
      "hvac making noise",
      "air conditioner smells",
      "air conditioner smells bad",
      "burning smell from air conditioner",
      "burning smell from ac",
      "burning smell from hvac",
      "burning smell from furnace",
      "burning smell from heater",
    ],
    weight: 35,
  },

  /* ---------------- PLUMBING ---------------- */

  {
    category: "Plumbing",
    patterns: [
      "water leaking from pipe",
      "water leaking from the pipe",
      "pipe is leaking",
      "pipe is leaking water",
      "broken pipe",
      "burst pipe",
      "water coming from pipe",
      "water coming out of pipe",
      "water under sink",
      "water under the sink",
      "sink is leaking",
      "sink leaking",
      "faucet is leaking",
      "faucet leaking",
      "toilet is leaking",
      "toilet leaking",
      "toilet is clogged",
      "toilet clogged",
      "toilet won't flush",
      "toilet will not flush",
      "sink won't drain",
      "sink will not drain",
      "drain is clogged",
      "drain clogged",
      "shower drain clogged",
      "low water pressure",
      "no water pressure",
      "water pressure is low",
      "sewage coming up",
      "sewage backup",
      "sewer backup",
    ],
    weight: 35,
  },

  /*
   * Ceiling + water is ambiguous.
   * We do NOT automatically make it Structural.
   * Other rules decide based on source.
   */
  {
    category: "Plumbing",
    patterns: [
      "water coming through ceiling from pipe",
      "water coming through the ceiling from a pipe",
      "water dripping from ceiling from pipe",
      "water dripping through ceiling from pipe",
      "pipe above ceiling leaking",
      "pipe in ceiling leaking",
      "water from ceiling caused by pipe",
      "leak inside ceiling",
      "leak in ceiling from pipe",
      "plumbing leak in ceiling",
    ],
    weight: 45,
  },

  /* ---------------- ELECTRICAL ---------------- */

  {
    category: "Electrical",
    patterns: [
      "outlet is sparking",
      "outlet sparking",
      "socket is sparking",
      "socket sparking",
      "outlet is smoking",
      "socket is smoking",
      "outlet has no power",
      "socket has no power",
      "outlet stopped working",
      "socket stopped working",
      "breaker keeps tripping",
      "breaker keeps turning off",
      "breaker keeps shutting off",
      "breaker trips",
      "circuit breaker keeps tripping",
      "lights keep flickering",
      "lights are flickering",
      "light keeps flickering",
      "electrical panel is hot",
      "electrical panel feels hot",
      "wire is exposed",
      "wires are exposed",
      "exposed electrical wire",
      "live wire",
      "electric shock",
      "electrical shock",
      "short circuit",
    ],
    weight: 40,
  },

  /* ---------------- APPLIANCE ---------------- */

  {
    category: "Appliance",
    patterns: [
      "refrigerator not cooling",
      "refrigerator is not cooling",
      "fridge not cooling",
      "fridge is not cooling",
      "freezer not freezing",
      "freezer is not freezing",
      "dishwasher not draining",
      "dishwasher is not draining",
      "dishwasher won't start",
      "dishwasher will not start",
      "washing machine not starting",
      "washing machine is not starting",
      "washing machine won't start",
      "washer won't start",
      "dryer not heating",
      "dryer is not heating",
      "oven not heating",
      "oven is not heating",
      "stove not working",
      "microwave not working",
    ],
    weight: 40,
  },

  /*
   * Appliance must win over generic plumbing
   * when the water issue originates from an appliance.
   */
  {
    category: "Appliance",
    patterns: [
      "washing machine leaking",
      "washer leaking",
      "dishwasher leaking",
      "refrigerator leaking",
      "fridge leaking",
      "water leaking from washing machine",
      "water leaking from dishwasher",
      "water under washing machine",
      "water under dishwasher",
      "oven smells like burning",
      "dryer smells like burning",
      "washing machine smells like burning",
      "dishwasher smells like burning",
    ],
    weight: 50,
  },

  /* ---------------- STRUCTURAL ---------------- */

  {
    category: "Structural",
    patterns: [
      "roof is leaking",
      "roof leaking",
      "water coming through roof",
      "water coming through the roof",
      "rain coming through roof",
      "rain coming through the roof",
      "ceiling is leaking",
      "ceiling leaking",
      "water coming through ceiling from roof",
      "water coming through the ceiling from roof",
      "water coming through ceiling after rain",
      "water coming through the ceiling after rain",
      "wall has a crack",
      "wall has cracks",
      "crack in the wall",
      "cracks in the wall",
      "ceiling has a crack",
      "crack in ceiling",
      "door frame is damaged",
      "window frame is damaged",
      "broken window",
      "broken door",
      "door lock is broken",
      "lock is broken",
      "floor is damaged",
      "floor is cracked",
    ],
    weight: 40,
  },

  /* ---------------- PEST ---------------- */

  {
    category: "Pest",
    patterns: [
      "cockroaches in kitchen",
      "cockroach in kitchen",
      "roaches in kitchen",
      "mouse in kitchen",
      "mouse in bedroom",
      "rats in basement",
      "rat in basement",
      "mouse droppings",
      "rat droppings",
      "bed bugs in bedroom",
      "bedbugs in bedroom",
      "termite damage",
      "ants in kitchen",
      "pest infestation",
      "insect infestation",
    ],
    weight: 40,
  },
];

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
) {
  return TECHNICIAN_BY_CATEGORY[category];
}

/* =========================================================
   NORMALIZATION
   ========================================================= */

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/* =========================================================
   NEGATION ENGINE
   =========================================================
   
   Handles examples such as:

   "no water leak"
   "there is no leak"
   "not leaking"
   "isn't leaking"
   "without sparks"
   "no burning smell"

   It is intentionally local to the matched phrase.
   ========================================================= */

const NEGATION_WORDS = [
  "no",
  "not",
  "without",
  "isn't",
  "isnt",
  "is not",
  "aren't",
  "arent",
  "are not",
  "wasn't",
  "wasnt",
  "was not",
  "weren't",
  "werent",
  "were not",
  "doesn't",
  "doesnt",
  "does not",
  "don't",
  "dont",
  "do not",
  "didn't",
  "didnt",
  "did not",
  "never",
];

function isNegatedAt(
  text: string,
  index: number,
) {
  /*
   * Examine only the text immediately before
   * the matched occurrence.
   */
  const before = text
    .slice(
      Math.max(0, index - 60),
      index,
    )
    .trim();

  if (!before) {
    return false;
  }

  /*
   * Direct forms:
   *
   * "no leak"
   * "no water leak"
   * "without sparks"
   */
  const direct = new RegExp(
    `(?:^|\\s)(?:${NEGATION_WORDS.map(
      escapeRegExp,
    ).join("|")})\\s+(?:[\\w'-]+\\s+){0,3}$`,
    "i",
  );

  if (direct.test(before)) {
    return true;
  }

  /*
   * Common constructions:
   *
   * "there is no leak"
   * "there are no sparks"
   * "there was no water"
   */
  if (
    /\b(?:there is|there are|there was|there were)\s+no\s+(?:[\w'-]+\s+){0,3}$/i.test(
      before,
    )
  ) {
    return true;
  }

  return false;
}

function escapeRegExp(
  value: string,
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function findActiveOccurrences(
  text: string,
  term: string,
) {
  const positions: number[] = [];

  let start = 0;

  while (true) {
    const index = text.indexOf(
      term,
      start,
    );

    if (index === -1) {
      break;
    }

    if (
      !isNegatedAt(
        text,
        index,
      )
    ) {
      positions.push(index);
    }

    start =
      index + term.length;
  }

  return positions;
}

function has(
  text: string,
  terms: string[],
) {
  return terms.some(
    (term) =>
      findActiveOccurrences(
        text,
        term,
      ).length > 0,
  );
}

function countMatches(
  text: string,
  terms: string[],
) {
  return terms.reduce(
    (count, term) =>
      count +
      findActiveOccurrences(
        text,
        term,
      ).length,
    0,
  );
}

/* =========================================================
   PRIORITY TERMS
   ========================================================= */

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
  "burning scent",
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

  /*
   * -------------------------------------------------------
   * 1. Generic keyword evidence
   * -------------------------------------------------------
   */
  for (const category of categories) {
    scores[category] += countMatches(
      text,
      KEYWORDS[category],
    );
  }

  /*
   * -------------------------------------------------------
   * 2. Contextual evidence
   * -------------------------------------------------------
   */
  for (const rule of CONTEXT_RULES) {
    if (
      has(text, rule.patterns)
    ) {
      scores[rule.category] +=
        rule.weight;
    }
  }

  /*
   * -------------------------------------------------------
   * 3. Important contextual overrides
   * -------------------------------------------------------
   */

  /*
   * Appliance source beats generic plumbing.
   *
   * "The dishwasher is leaking"
   *
   * => Appliance
   */
  if (
    has(text, [
      "washing machine leaking",
      "washer leaking",
      "dishwasher leaking",
      "refrigerator leaking",
      "fridge leaking",
      "water leaking from washing machine",
      "water leaking from dishwasher",
      "water under washing machine",
      "water under dishwasher",
    ])
  ) {
    scores.Appliance += 60;
  }

  /*
   * HVAC source beats generic electrical
   * when the burning smell is clearly from HVAC.
   */
  if (
    has(text, [
      "burning smell from air conditioner",
      "burning smell from ac",
      "burning smell from hvac",
      "burning smell from furnace",
      "burning smell from heater",
    ])
  ) {
    scores.HVAC += 60;
  }

  /*
   * Electrical equipment beats generic HVAC
   * when the electrical component is explicitly named.
   */
  if (
    has(text, [
      "burning smell from outlet",
      "burning smell from socket",
      "burning smell from electrical panel",
      "burning smell from breaker",
      "smoke from outlet",
      "smoke from socket",
      "sparking outlet",
      "sparking socket",
    ])
  ) {
    scores.Electrical += 70;
  }

  /*
   * Roof/rain context beats generic plumbing.
   */
  if (
    has(text, [
      "water coming through roof",
      "water coming through the roof",
      "rain coming through roof",
      "rain coming through the roof",
      "water coming through ceiling after rain",
      "water coming through the ceiling after rain",
      "roof is leaking",
      "roof leaking",
    ])
  ) {
    scores.Structural += 70;
  }

  /*
   * Pipe/plumbing source beats generic structural.
   */
  if (
    has(text, [
      "water coming through ceiling from pipe",
      "water coming through the ceiling from a pipe",
      "water dripping from ceiling from pipe",
      "pipe above ceiling leaking",
      "pipe in ceiling leaking",
      "plumbing leak in ceiling",
    ])
  ) {
    scores.Plumbing += 70;
  }

  /*
   * -------------------------------------------------------
   * 4. Find winner
   * -------------------------------------------------------
   */

  let bestCategory:
    | Exclude<Category, "Other">
    | null = null;

  let bestScore = 0;

  let secondBestScore = 0;

  for (const category of categories) {
    if (
      scores[category] >
      bestScore
    ) {
      secondBestScore =
        bestScore;

      bestScore =
        scores[category];

      bestCategory =
        category;
    } else if (
      scores[category] >
      secondBestScore
    ) {
      secondBestScore =
        scores[category];
    }
  }

  /*
   * No meaningful evidence.
   */
  if (
    !bestCategory ||
    bestScore < 2
  ) {
    return {
      category: null,
      strength: 0,
    };
  }

  /*
   * If the best result is only slightly
   * stronger than another category and has
   * weak evidence, avoid overconfidence.
   *
   * Strong contextual rules are allowed to win.
   */
  if (
    bestScore < 8 &&
    bestScore -
      secondBestScore <
      2
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
  /*
   * Critical always wins.
   */
  if (
    has(
      text,
      CRITICAL_TERMS,
    )
  ) {
    return "Critical";
  }

  /*
   * Burning smell is HIGH.
   */
  if (
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ])
  ) {
    return "High";
  }

  /*
   * Other known high-risk conditions.
   */
  if (
    has(
      text,
      HIGH_TERMS,
    )
  ) {
    return "High";
  }

  /*
   * Electrical-specific escalation.
   */
  if (
    category === "Electrical" &&
    has(text, [
      "sparks",
      "sparking",
      "exposed wire",
      "exposed wiring",
      "live wire",
      "live wiring",
      "breaker keeps tripping",
      "breaker trips",
      "short circuit",
    ])
  ) {
    return "High";
  }

  /*
   * Plumbing-specific escalation.
   */
  if (
    category === "Plumbing" &&
    has(text, [
      "major flooding",
      "flooding",
      "flooded",
      "sewage backup",
      "sewer backup",
    ])
  ) {
    return "High";
  }

  /*
   * Low priority.
   */
  if (
    has(
      text,
      LOW_TERMS,
    )
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
) {
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ]);

  if (
    category === "Other" &&
    priority === "Critical"
  ) {
    return "Reported immediate emergency condition from an unidentified source. The exact cause cannot be confirmed without an on-site inspection.";
  }

  if (
    category === "Other" &&
    priority === "High"
  ) {
    return "Reported maintenance issue with elevated safety or property-damage risk. The exact source cannot be confirmed without an on-site inspection.";
  }

  if (
    category === "HVAC" &&
    burningSmell
  ) {
    return "Reported HVAC issue with a burning smell coming from the equipment. Treat as a high-priority safety concern; the exact cause requires on-site inspection.";
  }

  if (
    category === "HVAC"
  ) {
    return "Possible HVAC system issue requiring inspection to determine the exact cause.";
  }

  if (
    category === "Plumbing"
  ) {
    return "Possible plumbing issue requiring inspection to determine the source and extent of the problem.";
  }

  if (
    category === "Electrical"
  ) {
    if (
      has(text, [
        "spark",
        "sparks",
        "sparking",
      ])
    ) {
      return "Reported electrical sparking. This may represent an electrical safety hazard and requires prompt professional inspection.";
    }

    if (
      burningSmell
    ) {
      return "Reported possible electrical overheating or burning odor. The exact source requires on-site inspection.";
    }

    return "Possible electrical system issue requiring inspection by a qualified electrician.";
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

  return "Maintenance issue reported. The exact cause cannot be confirmed without an on-site inspection.";
}

/* =========================================================
   RECOMMENDED ACTION
   ========================================================= */

function buildRecommendedAction(
  category: Category,
  priority: Priority,
  text: string,
) {
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ]);

  if (
    priority === "Critical"
  ) {
    return "Escalate immediately and contact appropriate emergency services when necessary.";
  }

  if (
    priority === "High" &&
    burningSmell &&
    category === "HVAC"
  ) {
    return "Stop using the HVAC unit if it is safe to do so, keep occupants away from the equipment, and dispatch an HVAC technician for urgent inspection. Escalate to emergency services if smoke, fire, or another immediate hazard develops.";
  }

  if (
    priority === "High" &&
    category === "Electrical"
  ) {
    return "Treat as an urgent electrical safety issue and dispatch a qualified electrician for prompt inspection. If there is active smoke, fire, or electric shock, escalate immediately.";
  }

  if (
    priority === "High" &&
    category === "Other"
  ) {
    return "Treat as an urgent maintenance concern and dispatch a general maintenance technician for prompt inspection. Escalate immediately if smoke, fire, gas, or another immediate hazard develops.";
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
    return "Assign an HVAC technician to inspect the cooling or heating system.";
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
) {
  if (
    priority === "Critical"
  ) {
    return "Immediate safety hazard indicated. Escalate without delay and follow emergency procedures when applicable.";
  }

  if (
    priority === "High" &&
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ])
  ) {
    if (
      category === "HVAC"
    ) {
      return "Potential immediate safety hazard indicated by the burning smell from the HVAC equipment. The equipment should be inspected urgently.";
    }

    if (
      category === "Electrical"
    ) {
      return "Potential electrical safety hazard indicated by the burning smell. Avoid unsafe contact and arrange urgent inspection by a qualified electrician.";
    }

    return "Potential safety hazard indicated by the reported burning smell. Urgent professional inspection is recommended.";
  }

  if (
    priority === "High"
  ) {
    return "Elevated safety or property-damage risk is indicated by the reported symptoms. Prompt professional inspection is recommended.";
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
  if (
    category === "HVAC"
  ) {
    if (
      has(text, [
        "burning smell",
        "smell of burning",
        "burning odor",
        "burning scent",
      ])
    ) {
      return [
        "Has the HVAC unit been turned off?",
        "Is there any visible smoke or fire?",
        "Is the burning smell getting stronger?",
      ];
    }

    return [
      "Is the system still running?",
      "Is the system producing any unusual noise or smell?",
      "When did the problem start?",
    ];
  }

  if (
    category === "Electrical"
  ) {
    return [
      "Are there sparks or visible smoke?",
      "Is the affected equipment still powered?",
      "Has the breaker tripped?",
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
    category === "Appliance"
  ) {
    return [
      "Is the appliance still running?",
      "Is there any unusual noise or smell?",
      "Does the appliance have power?",
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
    "Has anything been done to resolve it?",
  ];
}

/* =========================================================
   MAIN ANALYSIS
   ========================================================= */

export function analyzeMaintenanceRequest(
  input: {
    description: string;
    selectedCategory?: Category | "";
    selectedPriority?: Priority | "";
  },
): Analysis {
  const text =
    normalize(
      input.description,
    );

  /*
   * Detect category automatically.
   */
  const detected =
    detectCategory(text);

  /*
   * Explicit user selection wins.
   * Otherwise use automatic classification.
   */
  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Determine priority from actual
   * description.
   */
  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  /*
   * Safety escalation always wins.
   *
   * Critical cannot become High.
   * High cannot become Medium/Low.
   */
  let priority: Priority;

  if (
    detectedPriority ===
    "Critical"
  ) {
    priority = "Critical";
  } else if (
    detectedPriority ===
    "High"
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

  const riskLevel: RiskLevel =
    priority;

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

  /*
   * Confidence.
   */
  let confidence = 0.78;

  if (
    detected.category ===
    category
  ) {
    confidence += 0.08;
  }

  if (
    detected.strength >= 10
  ) {
    confidence += 0.07;
  }

  if (
    category === "Other"
  ) {
    confidence = Math.min(
      confidence,
      0.82,
    );
  }

  if (
    priority === "Critical"
  ) {
    confidence =
      Math.max(
        confidence,
        0.95,
      );
  } else if (
    priority === "High"
  ) {
    confidence =
      Math.max(
        confidence,
        0.91,
      );
  }

  confidence = Math.min(
    0.99,
    Number(
      confidence.toFixed(2),
    ),
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
) {
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
