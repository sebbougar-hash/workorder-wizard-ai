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

const KEYWORDS: Record<Exclude<Category, "Other">, string[]> = {
  HVAC: [
    "air conditioner",
    "air conditioning",
    "hvac",
    "furnace",
    "heater",
    "heating",
    "thermostat",
    "cooling system",
    "cooling",
    "not cooling",
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
    "electrocution",
    "electrocuted",
    "exposed wiring",
    "exposed wire",
    "live wire",
    "live wiring",
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

const CATEGORY_COMBINATIONS: Record<
  Exclude<Category, "Other">,
  { terms: string[]; weight: number }[]
> = {
  HVAC: [
    {
      terms: ["air conditioner", "not cooling"],
      weight: 10,
    },
    {
      terms: ["air conditioning", "not cooling"],
      weight: 10,
    },
    {
      terms: ["air conditioner", "burning smell"],
      weight: 15,
    },
    {
      terms: ["air conditioning", "burning smell"],
      weight: 15,
    },
    {
      terms: ["hvac", "burning smell"],
      weight: 15,
    },
    {
      terms: ["furnace", "burning smell"],
      weight: 15,
    },
    {
      terms: ["heater", "burning smell"],
      weight: 15,
    },
    {
      terms: ["cooling system", "burning smell"],
      weight: 15,
    },
    {
      terms: ["thermostat", "heating"],
      weight: 6,
    },
    {
      terms: ["thermostat", "cooling"],
      weight: 6,
    },
    {
      terms: ["furnace", "not heating"],
      weight: 8,
    },
    {
      terms: ["heater", "not heating"],
      weight: 8,
    },
  ],

  Electrical: [
    {
      terms: ["outlet", "breaker"],
      weight: 8,
    },
    {
      terms: ["outlets", "breaker"],
      weight: 8,
    },
    {
      terms: ["socket", "breaker"],
      weight: 8,
    },
    {
      terms: ["sockets", "breaker"],
      weight: 8,
    },
    {
      terms: ["outlet", "no power"],
      weight: 8,
    },
    {
      terms: ["outlets", "no power"],
      weight: 8,
    },
    {
      terms: ["socket", "no power"],
      weight: 8,
    },
    {
      terms: ["sockets", "no power"],
      weight: 8,
    },
    {
      terms: ["breaker", "keeps tripping"],
      weight: 10,
    },
    {
      terms: ["breaker", "trips"],
      weight: 8,
    },
    {
      terms: ["sparks", "outlet"],
      weight: 10,
    },
    {
      terms: ["sparking", "outlet"],
      weight: 10,
    },
    {
      terms: ["spark", "outlet"],
      weight: 10,
    },
    {
      terms: ["sparks", "electrical"],
      weight: 10,
    },
    {
      terms: ["sparking", "electrical"],
      weight: 10,
    },
    {
      terms: ["burning smell", "outlet"],
      weight: 10,
    },
    {
      terms: ["burning smell", "electrical"],
      weight: 10,
    },
    {
      terms: ["exposed wire", "electrical"],
      weight: 10,
    },
    {
      terms: ["exposed wiring", "electrical"],
      weight: 10,
    },
    {
      terms: ["live wire", "electrical"],
      weight: 10,
    },
    {
      terms: ["live wiring", "electrical"],
      weight: 10,
    },
    {
      terms: ["short circuit", "power"],
      weight: 10,
    },
    {
      terms: ["short circuit", "electrical"],
      weight: 10,
    },
  ],

  Appliance: [
    {
      terms: ["refrigerator", "not cooling"],
      weight: 8,
    },
    {
      terms: ["fridge", "not cooling"],
      weight: 8,
    },
    {
      terms: ["dishwasher", "not draining"],
      weight: 8,
    },
    {
      terms: ["washing machine", "not starting"],
      weight: 8,
    },
    {
      terms: ["washer", "not starting"],
      weight: 8,
    },
  ],

  Plumbing: [
    {
      terms: ["pipe", "water leak"],
      weight: 8,
    },
    {
      terms: ["sink", "water leak"],
      weight: 8,
    },
    {
      terms: ["toilet", "water leak"],
      weight: 8,
    },
    {
      terms: ["faucet", "water leak"],
      weight: 8,
    },
  ],

  Structural: [
    {
      terms: ["door", "lock"],
      weight: 6,
    },
    {
      terms: ["window", "frame"],
      weight: 6,
    },
    {
      terms: ["ceiling", "water"],
      weight: 6,
    },
    {
      terms: ["roof", "water"],
      weight: 6,
    },
  ],

  Pest: [
    {
      terms: ["cockroach", "kitchen"],
      weight: 6,
    },
    {
      terms: ["mouse", "droppings"],
      weight: 8,
    },
    {
      terms: ["rat", "droppings"],
      weight: 8,
    },
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

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/*
 * Checks whether a specific occurrence of a term is negated.
 *
 * Important:
 * We only inspect a short window immediately before the term.
 *
 * This prevents:
 *
 * "not cooling and there is a burning smell"
 *
 * from incorrectly treating "burning smell" as negated.
 */
function negated(text: string, term: string) {
  let searchFrom = 0;

  while (true) {
    const index = text.indexOf(term, searchFrom);

    if (index === -1) {
      return false;
    }

    const before = text
      .slice(Math.max(0, index - 30), index)
      .trim();

    const directNegation =
      /(?:^|\s)(?:no|without|isn't|is not|aren't|are not|there is no|there are no)\s+(?:[\w'-]+\s+){0,1}$/i.test(
        before
      );

    if (directNegation) {
      searchFrom = index + term.length;
      continue;
    }

    return false;
  }
}
  

function has(text: string, terms: string[]) {
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

const applianceEvidence = has(text, [
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
]);

const applianceBurningSmell = has(text, [
  "burning smell",
  "smell of burning",
  "burning odor",
  "burning scent",
]);

if (applianceEvidence && applianceBurningSmell) {
  return {
    category: "Appliance",
    strength: Math.max(bestScore, 20),
  };
}
  /*
   * HVAC + burning smell should remain HVAC
   * unless the user explicitly identifies an
   * electrical component such as an outlet,
   * breaker, panel, or wiring.
   */
  const hvacEvidence = has(text, [
    "air conditioner",
    "air conditioning",
    "hvac",
    "furnace",
    "heater",
    "heating",
    "cooling system",
    "cooling",
    "heat pump",
  ]);

  const burningSmell = has(text, [
    "burning smell",
    "smell of burning",
    "burning odor",
    "burning scent",
  ]);

  const explicitElectricalEquipment =
    has(text, [
      "outlet",
      "outlets",
      "socket",
      "sockets",
      "breaker",
      "breakers",
      "electrical panel",
      "wiring",
      "wire",
      "wires",
      "exposed wire",
      "exposed wiring",
      "live wire",
      "live wiring",
    ]);

  if (
    hvacEvidence &&
    burningSmell &&
    !explicitElectricalEquipment
  ) {
    return {
      category: "HVAC",
      strength: Math.max(bestScore, 20),
    };
  }

  if (bestCategory === null) {
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

function detectPriority(
  text: string,
  category: Category,
): Priority {
  /*
   * CRITICAL has absolute precedence.
   */
  if (has(text, CRITICAL_TERMS)) {
    return "Critical";
  }

  /*
   * A burning smell is ALWAYS HIGH unless
   * the user explicitly negates it.
   *
   * Example:
   * "The air conditioner is not cooling and
   * there is a burning smell coming from the unit."
   *
   * => High
   */
  const burningSmell = has(text, [
    "burning smell",
    "smell of burning",
    "burning odor",
    "burning scent",
  ]);

  if (burningSmell) {
    return "High";
  }

  /*
   * Other known high-risk conditions.
   */
  if (has(text, HIGH_TERMS)) {
    return "High";
  }

  /*
   * Electrical-specific escalation.
   */
  if (
    category === "Electrical" &&
    has(text, [
      "spark",
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
    ])
  ) {
    return "High";
  }

  /*
   * Cosmetic/minor issues are LOW.
   */
  if (has(text, LOW_TERMS)) {
    return "Low";
  }

  return "Medium";
}

function buildProblemSummary(
  text: string,
  category: Category,
  priority: Priority,
) {
  const burningSmell = has(text, [
    "burning smell",
    "smell of burning",
    "burning odor",
    "burning scent",
  ]);

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

  if (category === "Electrical") {
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

  if (category === "Plumbing") {
    return "Possible plumbing issue requiring inspection to determine the source and extent of the problem.";
  }

  if (category === "Appliance") {
    return "Possible appliance malfunction requiring inspection by an appliance technician.";
  }

  if (category === "Structural") {
    return "Possible building or structural maintenance issue requiring inspection.";
  }

  if (category === "Pest") {
    return "Possible pest infestation requiring assessment and appropriate pest-control treatment.";
  }

  if (priority === "Critical") {
    return "Reported immediate emergency condition. Treat as an urgent safety situation; the exact cause cannot be confirmed without an on-site inspection.";
  }

  return "Maintenance issue reported. The exact cause cannot be confirmed without an on-site inspection.";
}

function buildRecommendedAction(
  category: Category,
  priority: Priority,
  text: string,
) {
  const burningSmell = has(text, [
    "burning smell",
    "smell of burning",
    "burning odor",
    "burning scent",
  ]);

  if (priority === "Critical") {
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

  if (priority === "High") {
    return `Assign a ${technicianRoleFor(
      category,
    )} for urgent inspection and corrective action.`;
  }

  if (category === "HVAC") {
    return "Assign an HVAC technician to inspect the cooling or heating system.";
  }

  if (category === "Plumbing") {
    return "Assign a licensed plumber to inspect the plumbing system and identify the source of the issue.";
  }

  if (category === "Electrical") {
    return "Assign a licensed electrician to inspect the electrical system.";
  }

  if (category === "Appliance") {
    return "Assign an appliance technician to inspect the appliance.";
  }

  if (category === "Structural") {
    return "Assign qualified maintenance personnel or a contractor to inspect the affected area.";
  }

  if (category === "Pest") {
    return "Assign a pest control technician to inspect the affected area.";
  }

  return "Assign a general maintenance technician to inspect the reported issue.";
}

function buildSafetyAssessment(
  priority: Priority,
  category: Category,
  text: string,
) {
  if (priority === "Critical") {
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
    if (category === "HVAC") {
      return "Potential immediate safety hazard indicated by the burning smell from the HVAC unit. The equipment should be inspected urgently.";
    }

    if (category === "Electrical") {
      return "Potential electrical safety hazard indicated by the burning smell. Avoid unsafe contact and arrange urgent inspection by a qualified electrician.";
    }

    return "Potential safety hazard indicated by the reported burning smell. Urgent professional inspection is recommended.";
  }

  if (priority === "High") {
    return "Elevated safety or property-damage risk is indicated by the reported symptoms. Prompt professional inspection is recommended.";
  }

  if (priority === "Low") {
    return "No immediate safety hazard is indicated by the information provided.";
  }

  return "No immediate safety hazard is indicated by the information provided.";
}

function buildFollowUpQuestions(
  category: Category,
  text: string,
): string[] {
  if (category === "HVAC") {
    const questions = [
      "Is the system still running?",
      "Is water leaking?",
      "Is there any burning smell?",
    ];

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

    return questions;
  }

  if (category === "Electrical") {
    return [
      "Are there sparks or visible smoke?",
      "Is the affected equipment still powered?",
      "Has the breaker tripped?",
    ];
  }

  if (category === "Plumbing") {
    return [
      "Is the water leak still active?",
      "How much water is leaking?",
      "Can the water supply be safely shut off?",
    ];
  }

  if (category === "Appliance") {
    return [
      "Is the appliance still running?",
      "Is there any unusual noise or smell?",
      "Does the appliance have power?",
    ];
  }

  if (category === "Structural") {
    return [
      "Is the affected area still usable?",
      "Is there visible damage or movement?",
      "Is there any water intrusion?",
    ];
  }

  if (category === "Pest") {
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

export function analyzeMaintenanceRequest(input: {
  description: string;
  selectedCategory?: Category | "";
  selectedPriority?: Priority | "";
}): Analysis {
  const text = normalize(input.description);

  const detected = detectCategory(text);

  /*
   * Use selected category when the user chose one.
   * Otherwise use automatic classification.
   */
  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Calculate priority from the actual description.
   */
  const detectedPriority = detectPriority(
    text,
    category,
  );

  /*
   * Safety escalation always wins.
   *
   * Example:
   * selectedPriority = Medium
   * description = burning smell
   *
   * Final priority = High
   */
  let priority: Priority = detectedPriority;

  if (
    detectedPriority === "Critical" ||
    detectedPriority === "High"
  ) {
    priority = detectedPriority;
  } else if (input.selectedPriority) {
    priority = input.selectedPriority;
  }

  const riskLevel: RiskLevel = priority;

  const problemSummary = buildProblemSummary(
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
    technicianRoleFor(category);

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
   * Deterministic confidence score.
   */
  let confidence = 0.78;

  if (detected.category === category) {
    confidence += 0.08;
  }

  if (detected.strength >= 10) {
    confidence += 0.07;
  }

  if (priority === "Critical") {
    confidence = Math.max(
      confidence,
      0.95,
    );
  } else if (priority === "High") {
    confidence = Math.max(
      confidence,
      0.91,
    );
  }

  confidence = Math.min(
    0.99,
    Number(confidence.toFixed(2)),
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

export function suggestedTenantResponse(input: {
  tenant: string;
  analysis: Analysis;
}) {
  const {
    tenant,
    analysis,
  } = input;

  if (analysis.priority === "Critical") {
    return `Hi ${tenant}, thank you for reporting this issue. We are treating it as an urgent safety matter and escalating it immediately. Please avoid the affected area or equipment if it is unsafe to approach, and contact emergency services if there is an immediate danger.`;
  }

  if (analysis.priority === "High") {
    return `Hi ${tenant}, thank you for reporting this issue. We have identified it as a high-priority maintenance concern and will arrange an urgent inspection by a ${analysis.technician}. Please avoid using the affected equipment if doing so could be unsafe.`;
  }

  if (analysis.priority === "Medium") {
    return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to inspect it. We will provide an update once the inspection is scheduled.`;
  }

  return `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to review it.`;
}
