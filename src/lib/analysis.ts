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
   KEYWORDS
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
    "wiring",
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

/* =========================================================
   CATEGORY COMBINATIONS
   ========================================================= */

const CATEGORY_COMBINATIONS: Record<
  Exclude<Category, "Other">,
  { terms: string[]; weight: number }[]
> = {
  HVAC: [
    {
      terms: ["air conditioner", "not cooling"],
      weight: 15,
    },
    {
      terms: ["air conditioning", "not cooling"],
      weight: 15,
    },
    {
      terms: ["air conditioner", "burning smell"],
      weight: 20,
    },
    {
      terms: ["air conditioning", "burning smell"],
      weight: 20,
    },
    {
      terms: ["hvac", "burning smell"],
      weight: 20,
    },
    {
      terms: ["furnace", "burning smell"],
      weight: 20,
    },
    {
      terms: ["heater", "burning smell"],
      weight: 20,
    },
    {
      terms: ["cooling system", "burning smell"],
      weight: 20,
    },
    {
      terms: ["thermostat", "cooling"],
      weight: 10,
    },
    {
      terms: ["thermostat", "heating"],
      weight: 10,
    },
    {
      terms: ["furnace", "not heating"],
      weight: 12,
    },
    {
      terms: ["heater", "not heating"],
      weight: 12,
    },
  ],

  Plumbing: [
    {
      terms: ["pipe", "water leak"],
      weight: 12,
    },
    {
      terms: ["sink", "water leak"],
      weight: 12,
    },
    {
      terms: ["toilet", "water leak"],
      weight: 12,
    },
    {
      terms: ["faucet", "water leak"],
      weight: 12,
    },
    {
      terms: ["toilet", "not flushing"],
      weight: 12,
    },
    {
      terms: ["sink", "not draining"],
      weight: 12,
    },
    {
      terms: ["shower", "low water pressure"],
      weight: 12,
    },
  ],

  Electrical: [
    {
      terms: ["outlet", "sparks"],
      weight: 20,
    },
    {
      terms: ["outlet", "sparking"],
      weight: 20,
    },
    {
      terms: ["socket", "sparks"],
      weight: 20,
    },
    {
      terms: ["socket", "sparking"],
      weight: 20,
    },
    {
      terms: ["outlet", "no power"],
      weight: 15,
    },
    {
      terms: ["socket", "no power"],
      weight: 15,
    },
    {
      terms: ["breaker", "keeps tripping"],
      weight: 20,
    },
    {
      terms: ["breaker", "keeps trip"],
      weight: 20,
    },
    {
      terms: ["breaker", "trips"],
      weight: 15,
    },
    {
      terms: ["burning smell", "outlet"],
      weight: 20,
    },
    {
      terms: ["burning smell", "socket"],
      weight: 20,
    },
    {
      terms: ["burning smell", "electrical"],
      weight: 20,
    },
    {
      terms: ["exposed wire", "electrical"],
      weight: 20,
    },
    {
      terms: ["exposed wiring", "electrical"],
      weight: 20,
    },
    {
      terms: ["live wire", "electrical"],
      weight: 20,
    },
    {
      terms: ["live wiring", "electrical"],
      weight: 20,
    },
    {
      terms: ["short circuit", "electrical"],
      weight: 20,
    },
  ],

  Appliance: [
    {
      terms: ["refrigerator", "not cooling"],
      weight: 15,
    },
    {
      terms: ["fridge", "not cooling"],
      weight: 15,
    },
    {
      terms: ["dishwasher", "not draining"],
      weight: 15,
    },
    {
      terms: ["washing machine", "not starting"],
      weight: 15,
    },
    {
      terms: ["washer", "not starting"],
      weight: 15,
    },
    {
      terms: ["dryer", "not heating"],
      weight: 15,
    },
    {
      terms: ["oven", "not heating"],
      weight: 15,
    },
  ],

  Structural: [
    {
      terms: ["door", "lock"],
      weight: 12,
    },
    {
      terms: ["window", "frame"],
      weight: 12,
    },
    {
      terms: ["ceiling", "water"],
      weight: 12,
    },
    {
      terms: ["roof", "water"],
      weight: 12,
    },
    {
      terms: ["wall", "crack"],
      weight: 12,
    },
    {
      terms: ["floor", "damage"],
      weight: 12,
    },
  ],

  Pest: [
    {
      terms: ["cockroach", "kitchen"],
      weight: 12,
    },
    {
      terms: ["mouse", "droppings"],
      weight: 15,
    },
    {
      terms: ["rat", "droppings"],
      weight: 15,
    },
    {
      terms: ["bed bugs", "bedroom"],
      weight: 15,
    },
    {
      terms: ["termite", "wood"],
      weight: 15,
    },
  ],
};

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
   NEGATION
   ========================================================= */

function negated(
  text: string,
  term: string,
) {
  let searchFrom = 0;

  while (true) {
    const index = text.indexOf(
      term,
      searchFrom,
    );

    if (index === -1) {
      return false;
    }

    const before = text
      .slice(
        Math.max(0, index - 50),
        index,
      )
      .trim();

    const directNegation =
      /(?:^|\s)(?:no|without|isn't|is not|aren't|are not|there is no|there are no)\s+(?:[\w'-]+\s+){0,2}$/i.test(
        before,
      );

    if (directNegation) {
      searchFrom =
        index + term.length;
      continue;
    }

    return false;
  }
}

/* =========================================================
   TEXT MATCHING
   ========================================================= */

function has(
  text: string,
  terms: string[],
) {
  return terms.some(
    (term) =>
      text.includes(term) &&
      !negated(text, term),
  );
}

function countMatches(
  text: string,
  terms: string[],
) {
  return terms.reduce(
    (count, term) =>
      count +
      (text.includes(term) &&
      !negated(text, term)
        ? 1
        : 0),
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
   * Keyword scoring
   */
  for (const category of Object.keys(
    KEYWORDS,
  ) as Exclude<Category, "Other">[]) {
    scores[category] += countMatches(
      text,
      KEYWORDS[category],
    );
  }

  /*
   * Combination scoring
   */
  for (const category of Object.keys(
    CATEGORY_COMBINATIONS,
  ) as Exclude<Category, "Other">[]) {
    for (const combination of CATEGORY_COMBINATIONS[
      category
    ]) {
      const matched =
        combination.terms.every(
          (term) =>
            text.includes(term) &&
            !negated(text, term),
        );

      if (matched) {
        scores[category] +=
          combination.weight;
      }
    }
  }

  /*
   * Explicit Appliance detection
   */
  if (
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
    ])
  ) {
    return {
      category: "Appliance",
      strength: Math.max(
        scores.Appliance,
        20,
      ),
    };
  }

  /*
   * Explicit HVAC detection
   */
  if (
    has(text, [
      "air conditioner",
      "air conditioning",
      "hvac",
      "furnace",
      "heater",
      "heat pump",
      "thermostat",
      "cooling system",
    ])
  ) {
    return {
      category: "HVAC",
      strength: Math.max(
        scores.HVAC,
        15,
      ),
    };
  }

  /*
   * Explicit Plumbing detection
   */
  if (
    has(text, [
      "plumbing",
      "plumber",
      "toilet",
      "sink",
      "faucet",
      "pipe",
      "pipes",
      "drain",
      "shower",
      "bathtub",
      "water leak",
      "water leakage",
      "leaking water",
      "sewage",
      "sewer",
    ])
  ) {
    return {
      category: "Plumbing",
      strength: Math.max(
        scores.Plumbing,
        15,
      ),
    };
  }

  /*
   * Explicit Electrical detection
   *
   * IMPORTANT:
   * Generic words such as "power", "switch",
   * "wire" alone are intentionally NOT enough.
   */
  if (
    has(text, [
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
      "wiring",
      "fuse",
      "fuse box",
      "short circuit",
      "electrical shock",
      "electric shock",
      "electrocution",
      "sparking",
      "sparks",
      "exposed wiring",
      "exposed wire",
      "live wire",
      "live wiring",
    ])
  ) {
    return {
      category: "Electrical",
      strength: Math.max(
        scores.Electrical,
        15,
      ),
    };
  }

  /*
   * Explicit Structural detection
   */
  if (
    has(text, [
      "structural",
      "roof",
      "ceiling",
      "wall",
      "floor",
      "door",
      "window",
      "frame",
      "lock",
    ])
  ) {
    return {
      category: "Structural",
      strength: Math.max(
        scores.Structural,
        10,
      ),
    };
  }

  /*
   * Explicit Pest detection
   */
  if (
    has(text, [
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
    ])
  ) {
    return {
      category: "Pest",
      strength: Math.max(
        scores.Pest,
        10,
      ),
    };
  }

  /*
   * If there is no reliable evidence,
   * return Other.
   */
  return {
    category: null,
    strength: 0,
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
    has(text, CRITICAL_TERMS)
  ) {
    return "Critical";
  }

  /*
   * Burning smell is High.
   *
   * This applies even when Category = Other.
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
   * Other high-risk conditions.
   */
  if (
    has(text, HIGH_TERMS)
  ) {
    return "High";
  }

  /*
   * Electrical escalation.
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
   * Plumbing escalation.
   */
  if (
    category === "Plumbing" &&
    has(text, [
      "major flooding",
      "flooding",
      "flooded",
      "sewage backup",
    ])
  ) {
    return "High";
  }

  /*
   * Cosmetic/minor issue.
   */
  if (
    has(text, LOW_TERMS)
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
  const burningSmell = has(
    text,
    [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ],
  );

  /*
   * Other + High
   */
  if (
    category === "Other" &&
    priority === "High"
  ) {
    return "Reported maintenance issue with elevated safety or property-damage risk. The exact source cannot be confirmed without an on-site inspection.";
  }

  /*
   * Other + Critical
   */
  if (
    category === "Other" &&
    priority === "Critical"
  ) {
    return "Reported immediate emergency condition from an unidentified source. The exact cause cannot be confirmed without an on-site inspection.";
  }

  /*
   * HVAC + burning smell
   */
  if (
    category === "HVAC" &&
    has(text, [
      "air conditioner",
      "air conditioning",
      "cooling",
      "not cooling",
    ]) &&
    burningSmell
  ) {
    return "Reported HVAC cooling failure with a burning smell coming from the unit. Treat as a high-priority safety concern; the exact cause cannot be confirmed without an on-site inspection.";
  }

  /*
   * HVAC cooling
   */
  if (
    category === "HVAC" &&
    has(text, [
      "air conditioner",
      "air conditioning",
      "cooling",
      "not cooling",
    ])
  ) {
    return "Possible air conditioning cooling-system issue. The exact cause cannot be confirmed without an inspection. Requires inspection.";
  }

  /*
   * Electrical
   */
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
      return "Reported electrical sparking. This may represent an immediate electrical safety hazard and requires prompt professional inspection.";
    }

    if (
      has(text, [
        "burning smell",
        "burning odor",
        "burning scent",
      ])
    ) {
      return "Reported possible electrical overheating or burning odor. The exact source cannot be confirmed without an on-site inspection.";
    }

    return "Possible electrical system issue requiring inspection by a qualified electrician.";
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
  const burningSmell = has(
    text,
    [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
    ],
  );

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
      return "Potential immediate safety hazard indicated by the burning smell from the HVAC unit. The equipment should be inspected urgently.";
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
      "Is water leaking?",
      "Is the system producing any unusual noise or smell?",
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
      "Is there visible damage or movement?",
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
  const text = normalize(
    input.description,
  );

  /*
   * Automatic category detection.
   */
  const detected =
    detectCategory(text);

  /*
   * Manual category selection wins ONLY
   * when the user explicitly selected one.
   *
   * Otherwise use automatic classification.
   */
  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Determine priority from the description.
   */
  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  /*
   * Safety escalation wins over
   * manually selected priority.
   *
   * High/Critical cannot be downgraded
   * by selecting Medium or Low.
   */
  let priority: Priority;

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
    priority = detectedPriority;
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
   * Deterministic confidence.
   */
  let confidence = 0.78;

  if (
    detected.category === category
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
    confidence = Math.max(
      confidence,
      0.95,
    );
  } else if (
    priority === "High"
  ) {
    confidence = Math.max(
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
    analysis.priority === "High"
  ) {
    return `Hi ${tenant}, thank you for reporting this issue. We have identified it as a high-priority maintenance concern and will arrange an urgent inspection by a ${analysis.technician}. Please avoid using the affected equipment if doing so could be unsafe.`;
  }

  if (
    analysis.priority === "Medium"
  ) {
    return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to inspect it. We will provide an update once the inspection is scheduled.`;
  }

  return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to review it.`;
}
