/* =========================================================
   maintenanceAnalysis.ts
   Bilingual Maintenance Analysis Engine
   English + French
   ========================================================= */

export type Language = "en" | "fr";

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
  language: Language;
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
   LANGUAGE DETECTION
   ========================================================= */

const FRENCH_MARKERS = [
  "le ",
  "la ",
  "les ",
  "un ",
  "une ",
  "des ",
  "du ",
  "de ",
  "dans ",
  "avec ",
  "pour ",
  "mon ",
  "ma ",
  "mes ",
  "est ",
  "sont ",
  "j'ai",
  "je ",
  "il ",
  "elle ",
  "nous ",
  "vous ",
  "problème",
  "probleme",
  "panne",
  "fuite",
  "prise",
  "mur",
  "plafond",
  "chauffage",
  "climatisation",
  "eau ",
  "électricité",
  "electricite",
  "toilettes",
  "robinet",
];

function detectLanguage(text: string): Language {
  const lower = ` ${text.toLowerCase()} `;

  let frenchScore = 0;

  for (const marker of FRENCH_MARKERS) {
    if (lower.includes(marker)) {
      frenchScore++;
    }
  }

  /*
   * French-specific characters are useful signals,
   * but not sufficient by themselves.
   */
  if (/[àâçéèêëîïôùûüÿœ]/i.test(text)) {
    frenchScore += 3;
  }

  return frenchScore >= 2 ? "fr" : "en";
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
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/* =========================================================
   MULTILINGUAL TERM GROUPS
   ========================================================= */

const TERMS = {
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
    "not heating",
    "heat pump",
    "refrigerant",
    "condenser",
    "evaporator",
    "duct",
    "airflow",
    "air flow",

    "climatisation",
    "clim",
    "climatiseur",
    "climatiseur",
    "chauffage",
    "chaudiere",
    "chaudière",
    "radiateur",
    "thermostat",
    "pompe a chaleur",
    "pompe à chaleur",
    "ne refroidit pas",
    "ne chauffe pas",
    "ne chauffe plus",
    "ne refroidit plus",
    "air froid",
    "air chaud",
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
    "clogged drain",
    "not draining",

    "plomberie",
    "plombier",
    "evier",
    "évier",
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
    "évacuation",
    "douche",
    "baignoire",
    "pression d'eau",
    "pression d eau",
    "fuite d'eau",
    "fuite d eau",
    "fuite",
    "eau qui fuit",
    "eaux usees",
    "eaux usées",
    "egout",
    "égout",
    "bouche",
    "bouché",
    "bouchee",
    "bouchée",
    "ne s'evacue pas",
    "ne s'evacue",
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
    "spark",
    "power outage",
    "no power",

    "electrique",
    "électrique",
    "electricien",
    "électricien",
    "electricite",
    "électricité",
    "prise",
    "prises",
    "prise electrique",
    "prise électrique",
    "interrupteur",
    "disjoncteur",
    "disjoncteurs",
    "tableau electrique",
    "tableau électrique",
    "cablage",
    "câblage",
    "cable",
    "câble",
    "fil",
    "fils",
    "fusible",
    "boite a fusibles",
    "boîte à fusibles",
    "court circuit",
    "court-circuit",
    "choc electrique",
    "choc électrique",
    "electrocution",
    "etincelle",
    "étincelle",
    "etincelles",
    "étincelles",
    "fume",
    "fumee",
    "fumée",
    "plus de courant",
    "pas de courant",
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
    "coffee maker",
    "coffee machine",

    "refrigerateur",
    "réfrigérateur",
    "frigo",
    "congelateur",
    "congélateur",
    "lave vaisselle",
    "lave-vaisselle",
    "machine a laver",
    "machine à laver",
    "lave linge",
    "lave-linge",
    "seche linge",
    "sèche-linge",
    "seche cheveux",
    "sèche-cheveux",
    "four",
    "cuisiniere",
    "cuisinière",
    "micro onde",
    "micro-ondes",
    "machine a cafe",
    "machine à café",
    "cafetière",
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
    "sagging ceiling",
    "damaged wall",

    "structurel",
    "structurelle",
    "toit",
    "plafond",
    "mur",
    "sol",
    "porte",
    "fenetre",
    "fenêtre",
    "cadre",
    "serrure",
    "fissure",
    "porte cassee",
    "porte cassée",
    "fenetre cassee",
    "fenêtre cassée",
    "plafond qui s'affaisse",
    "mur endommage",
    "mur endommagé",
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
    "droppings",
    "infestation",

    "cafard",
    "cafards",
    "blatte",
    "blattes",
    "rat",
    "rats",
    "souris",
    "rongeur",
    "rongeurs",
    "punaises",
    "punaise de lit",
    "termites",
    "fourmis",
    "insecte",
    "insectes",
    "nuisible",
    "nuisibles",
    "excrements",
    "excréments",
    "infestation",
  ],
};

/* =========================================================
   STRONG CONTEXTUAL COMBINATIONS
   ========================================================= */

type Combination = {
  terms: string[];
  weight: number;
};

const COMBINATIONS: Record<
  Exclude<Category, "Other">,
  Combination[]
> = {
  HVAC: [
    {
      terms: ["air conditioner", "not cooling"],
      weight: 20,
    },
    {
      terms: ["air conditioning", "not cooling"],
      weight: 20,
    },
    {
      terms: ["climatiseur", "ne refroidit pas"],
      weight: 20,
    },
    {
      terms: ["climatisation", "ne refroidit pas"],
      weight: 20,
    },
    {
      terms: ["furnace", "not heating"],
      weight: 20,
    },
    {
      terms: ["heater", "not heating"],
      weight: 20,
    },
    {
      terms: ["chauffage", "ne chauffe pas"],
      weight: 20,
    },
    {
      terms: ["radiateur", "ne chauffe plus"],
      weight: 20,
    },
    {
      terms: ["thermostat", "heating"],
      weight: 12,
    },
    {
      terms: ["thermostat", "cooling"],
      weight: 12,
    },
    {
      terms: ["thermostat", "chauffage"],
      weight: 12,
    },
    {
      terms: ["thermostat", "climatisation"],
      weight: 12,
    },
  ],

  Plumbing: [
    {
      terms: ["sink", "water leak"],
      weight: 18,
    },
    {
      terms: ["toilet", "water leak"],
      weight: 18,
    },
    {
      terms: ["pipe", "water leak"],
      weight: 18,
    },
    {
      terms: ["faucet", "water leak"],
      weight: 18,
    },
    {
      terms: ["evier", "fuite"],
      weight: 18,
    },
    {
      terms: ["lavabo", "fuite"],
      weight: 18,
    },
    {
      terms: ["toilette", "fuite"],
      weight: 18,
    },
    {
      terms: ["robinet", "fuite"],
      weight: 18,
    },
    {
      terms: ["tuyau", "fuite"],
      weight: 18,
    },
    {
      terms: ["sink", "not draining"],
      weight: 18,
    },
    {
      terms: ["evier", "bouche"],
      weight: 18,
    },
  ],

  Electrical: [
    {
      terms: ["outlet", "burning smell"],
      weight: 30,
    },
    {
      terms: ["socket", "burning smell"],
      weight: 30,
    },
    {
      terms: ["outlet", "smells like burning"],
      weight: 30,
    },
    {
      terms: ["socket", "smells like burning"],
      weight: 30,
    },
    {
      terms: ["prise", "odeur de brule"],
      weight: 30,
    },
    {
      terms: ["prise", "sent le brule"],
      weight: 30,
    },
    {
      terms: ["prise", "odeur de brûlé"],
      weight: 30,
    },
    {
      terms: ["prise", "sent le brûlé"],
      weight: 30,
    },
    {
      terms: ["outlet", "sparks"],
      weight: 30,
    },
    {
      terms: ["socket", "sparking"],
      weight: 30,
    },
    {
      terms: ["prise", "etincelles"],
      weight: 30,
    },
    {
      terms: ["prise", "étincelles"],
      weight: 30,
    },
    {
      terms: ["breaker", "keeps tripping"],
      weight: 25,
    },
    {
      terms: ["disjoncteur", "saute"],
      weight: 25,
    },
    {
      terms: ["electrical", "burning smell"],
      weight: 25,
    },
    {
      terms: ["electrique", "odeur de brule"],
      weight: 25,
    },
    {
      terms: ["electricite", "odeur de brule"],
      weight: 25,
    },
    {
      terms: ["wiring", "burning smell"],
      weight: 25,
    },
    {
      terms: ["cablage", "odeur de brule"],
      weight: 25,
    },
    {
      terms: ["short circuit", "power"],
      weight: 25,
    },
    {
      terms: ["court circuit", "courant"],
      weight: 25,
    },
  ],

  Appliance: [
    {
      terms: ["refrigerator", "not cooling"],
      weight: 20,
    },
    {
      terms: ["fridge", "not cooling"],
      weight: 20,
    },
    {
      terms: ["dishwasher", "not draining"],
      weight: 20,
    },
    {
      terms: ["washing machine", "not starting"],
      weight: 20,
    },
    {
      terms: ["dryer", "not heating"],
      weight: 20,
    },
    {
      terms: ["oven", "not heating"],
      weight: 20,
    },
    {
      terms: ["refrigerateur", "ne refroidit pas"],
      weight: 20,
    },
    {
      terms: ["lave vaisselle", "ne vidange pas"],
      weight: 20,
    },
    {
      terms: ["machine a laver", "ne demarre pas"],
      weight: 20,
    },
    {
      terms: ["four", "ne chauffe pas"],
      weight: 20,
    },
  ],

  Structural: [
    {
      terms: ["ceiling", "crack"],
      weight: 20,
    },
    {
      terms: ["wall", "crack"],
      weight: 20,
    },
    {
      terms: ["roof", "water"],
      weight: 18,
    },
    {
      terms: ["ceiling", "water"],
      weight: 18,
    },
    {
      terms: ["plafond", "fissure"],
      weight: 20,
    },
    {
      terms: ["mur", "fissure"],
      weight: 20,
    },
    {
      terms: ["toit", "eau"],
      weight: 18,
    },
    {
      terms: ["plafond", "eau"],
      weight: 18,
    },
    {
      terms: ["door", "lock"],
      weight: 18,
    },
    {
      terms: ["porte", "serrure"],
      weight: 18,
    },
  ],

  Pest: [
    {
      terms: ["cockroach", "kitchen"],
      weight: 20,
    },
    {
      terms: ["mouse", "droppings"],
      weight: 25,
    },
    {
      terms: ["rat", "droppings"],
      weight: 25,
    },
    {
      terms: ["bed bugs", "bedroom"],
      weight: 25,
    },
    {
      terms: ["cafard", "cuisine"],
      weight: 20,
    },
    {
      terms: ["souris", "excrements"],
      weight: 25,
    },
    {
      terms: ["rat", "excrements"],
      weight: 25,
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
): string {
  return TECHNICIAN_BY_CATEGORY[category];
}

/* =========================================================
   NEGATION
   ========================================================= */

const NEGATION_WORDS = [
  "no",
  "not",
  "without",
  "isn't",
  "isnt",
  "aren't",
  "arent",
  "doesn't",
  "doesnt",
  "don't",
  "dont",
  "never",

  "pas",
  "plus",
  "aucun",
  "aucune",
  "sans",
  "jamais",
  "n'est pas",
  "n'est",
  "nest pas",
  "ne",
];

function isNegated(
  text: string,
  term: string,
): boolean {
  let start = 0;

  while (true) {
    const index = text.indexOf(
      term,
      start,
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
     * Check direct negation immediately
     * before the term.
     */
    for (const negation of NEGATION_WORDS) {
      const regex = new RegExp(
        `(?:^|\\s)${escapeRegex(
          negation,
        )}(?:\\s+[\\w'-]+){0,2}\\s*$`,
        "i",
      );

      if (regex.test(before)) {
        start = index + term.length;
        continue;
      }
    }

    /*
     * French constructions:
     *
     * "il n'y a pas de fuite"
     * "je n'ai pas de fuite"
     * "aucune fuite"
     * "pas de fumée"
     */
    const frenchNegative =
      /(n'y a pas|n y a pas|n'ai pas|n ai pas|n'est pas|n est pas|aucun|aucune|pas de|sans)\s+(?:[\w'-]+\s+){0,3}$/i.test(
        before,
      );

    if (frenchNegative) {
      start = index + term.length;
      continue;
    }

    return false;
  }
}

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
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
    (count, term) =>
      count +
      (text.includes(term) &&
      !isNegated(text, term)
        ? 1
        : 0),
    0,
  );
}

/* =========================================================
   SAFETY TERMS
   ========================================================= */

const CRITICAL_TERMS = [
  "active fire",
  "fire inside",
  "fire in",
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
  "life threatening",
  "life-threatening",
  "carbon monoxide emergency",
  "carbon monoxide alarm",

  "incendie",
  "feu",
  "flammes",
  "fuite de gaz",
  "odeur de gaz",
  "gaz",
  "explosion",
  "choc electrique",
  "choc électrique",
  "electrocution",
  "électrocution",
  "quelqu'un a pris un choc",
  "danger de mort",
  "monoxyde de carbone",
];

const HIGH_TERMS = [
  "burning smell",
  "smell of burning",
  "burning odor",
  "burning scent",
  "smells like burning",
  "smoke",
  "sparks",
  "spark",
  "sparking",
  "crackling",
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
  "keeps tripping",
  "ceiling collapsing",
  "roof collapsing",
  "wall collapsing",
  "structural collapse",

  "odeur de brule",
  "odeur de brûlé",
  "odeur de brule",
  "sent le brule",
  "sent le brûlé",
  "fumee",
  "fumée",
  "etincelles",
  "étincelles",
  "grésillement",
  "gresillement",
  "fil denude",
  "fil dénudé",
  "fils denudes",
  "fils dénudés",
  "fil sous tension",
  "inondation",
  "inonde",
  "inondé",
  "refoulement d'egout",
  "refoulement d'égout",
  "disjoncteur saute",
  "disjoncteur qui saute",
  "plafond qui s'effondre",
  "toit qui s'effondre",
  "mur qui s'effondre",
  "effondrement",
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

  "cosmetique",
  "cosmétique",
  "peinture",
  "rayure",
  "eraflure",
  "éraflure",
  "esthetique",
  "esthétique",
  "tache",
  "tâche",
  "petite tache",
  "egratigne",
  "égratigné",
  "grincement",
  "poignee desserree",
  "poignée desserrée",
  "mineur",
  "mineure",
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
   * Base keyword scores.
   */
  for (const category of categories) {
    scores[category] += countMatches(
      text,
      TERMS[category],
    );
  }

  /*
   * Contextual combinations.
   */
  for (const category of categories) {
    for (const combination of COMBINATIONS[
      category
    ]) {
      const matched =
        combination.terms.every(
          (term) =>
            text.includes(term) &&
            !isNegated(text, term),
        );

      if (matched) {
        scores[category] +=
          combination.weight;
      }
    }
  }

  /*
   * =======================================================
   * STRONG ELECTRICAL CONTEXT
   * =======================================================
   *
   * Outlet + burning smell
   * Socket + burning smell
   * Prise + odeur de brûlé
   *
   * These MUST be Electrical.
   */
  const electricalEquipment =
    has(text, [
      "outlet",
      "socket",
      "prise",
      "prise electrique",
      "prise électrique",
      "breaker",
      "disjoncteur",
      "electrical panel",
      "tableau electrique",
      "tableau électrique",
      "wiring",
      "cablage",
      "câblage",
    ]);

  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brule",
      "odeur de brûlé",
      "sent le brule",
      "sent le brûlé",
    ]);

  if (
    electricalEquipment &&
    burning
  ) {
    return {
      category: "Electrical",
      strength: Math.max(
        scores.Electrical,
        50,
      ),
    };
  }

  /*
   * =======================================================
   * STRONG APPLIANCE CONTEXT
   * =======================================================
   */
  const appliance =
    has(text, TERMS.Appliance);

  if (appliance) {
    /*
     * If an appliance itself smells burnt,
     * Appliance is more appropriate than
     * Electrical unless an electrical component
     * is explicitly identified.
     */
    if (
      burning &&
      !electricalEquipment
    ) {
      return {
        category: "Appliance",
        strength: Math.max(
          scores.Appliance,
          40,
        ),
      };
    }

    /*
     * Explicit appliance usually wins.
     */
    return {
      category: "Appliance",
      strength: Math.max(
        scores.Appliance,
        30,
      ),
    };
  }

  /*
   * =======================================================
   * STRONG HVAC CONTEXT
   * =======================================================
   */
  const hvac =
    has(text, TERMS.HVAC);

  if (hvac) {
    return {
      category: "HVAC",
      strength: Math.max(
        scores.HVAC,
        25,
      ),
    };
  }

  /*
   * =======================================================
   * STRONG PLUMBING CONTEXT
   * =======================================================
   */
  const plumbing =
    has(text, TERMS.Plumbing);

  if (plumbing) {
    /*
     * A ceiling/plafond + water leak may be
     * plumbing rather than structural.
     *
     * Water source takes precedence when
     * there is evidence of an active leak.
     */
    if (
      has(text, [
        "water leak",
        "water leakage",
        "leaking water",
        "fuite",
        "fuite d'eau",
        "fuite d eau",
        "eau qui fuit",
      ])
    ) {
      return {
        category: "Plumbing",
        strength: Math.max(
          scores.Plumbing,
          35,
        ),
      };
    }

    return {
      category: "Plumbing",
      strength: Math.max(
        scores.Plumbing,
        25,
      ),
    };
  }

  /*
   * =======================================================
   * STRONG ELECTRICAL CONTEXT
   * =======================================================
   */
  if (
    has(text, TERMS.Electrical)
  ) {
    return {
      category: "Electrical",
      strength: Math.max(
        scores.Electrical,
        30,
      ),
    };
  }

  /*
   * =======================================================
   * PEST
   * =======================================================
   */
  if (
    has(text, TERMS.Pest)
  ) {
    return {
      category: "Pest",
      strength: Math.max(
        scores.Pest,
        25,
      ),
    };
  }

  /*
   * =======================================================
   * STRUCTURAL
   * =======================================================
   *
   * Structural terms are intentionally weaker
   * when they appear alone.
   *
   * "There is water on the ceiling"
   * should not automatically become Structural.
   *
   * "There is a crack in the ceiling"
   * is clearly Structural.
   */
  const structuralStrong =
    has(text, [
      "structural",
      "roof",
      "wall",
      "floor",
      "door",
      "window",
      "frame",
      "lock",
      "crack",
      "fissure",
      "broken door",
      "broken window",
      "sagging ceiling",
      "damaged wall",
      "toit",
      "mur",
      "sol",
      "porte",
      "fenetre",
      "fenêtre",
      "cadre",
      "serrure",
      "fissure",
      "porte cassee",
      "porte cassée",
      "fenetre cassee",
      "fenêtre cassée",
      "plafond qui s'affaisse",
      "mur endommage",
      "mur endommagé",
    ]);

  if (structuralStrong) {
    return {
      category: "Structural",
      strength: Math.max(
        scores.Structural,
        25,
      ),
    };
  }

  /*
   * Ceiling/plafond alone is not enough.
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
   * CRITICAL
   */
  if (
    has(text, CRITICAL_TERMS)
  ) {
    return "Critical";
  }

  /*
   * HIGH SAFETY CONDITIONS
   */
  if (
    has(text, HIGH_TERMS)
  ) {
    return "High";
  }

  /*
   * Electrical-specific combinations.
   */
  if (
    category === "Electrical" &&
    (
      has(text, [
        "outlet",
        "socket",
        "prise",
        "prise electrique",
        "prise électrique",
      ]) &&
      has(text, [
        "burning smell",
        "smell of burning",
        "burning odor",
        "burning scent",
        "smells like burning",
        "odeur de brule",
        "odeur de brûlé",
        "sent le brule",
        "sent le brûlé",
      ])
    )
  ) {
    return "High";
  }

  /*
   * Electrical sparking.
   */
  if (
    category === "Electrical" &&
    has(text, [
      "spark",
      "sparks",
      "sparking",
      "etincelle",
      "étincelle",
      "etincelles",
      "étincelles",
      "crackling",
      "gresillement",
      "grésillement",
    ])
  ) {
    return "High";
  }

  /*
   * Plumbing flooding.
   */
  if (
    category === "Plumbing" &&
    has(text, [
      "major flooding",
      "flooding",
      "flooded",
      "sewage backup",
      "inondation",
      "inonde",
      "inondé",
      "refoulement d'egout",
      "refoulement d'égout",
    ])
  ) {
    return "High";
  }

  /*
   * Structural dangerous conditions.
   */
  if (
    category === "Structural" &&
    has(text, [
      "ceiling collapsing",
      "roof collapsing",
      "wall collapsing",
      "structural collapse",
      "plafond qui s'effondre",
      "toit qui s'effondre",
      "mur qui s'effondre",
      "effondrement",
    ])
  ) {
    return "Critical";
  }

  /*
   * Appliance dangerous burning/smoke.
   */
  if (
    category === "Appliance" &&
    has(text, [
      "smoke",
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "fumee",
      "fumée",
      "odeur de brule",
      "odeur de brûlé",
    ])
  ) {
    return "High";
  }

  /*
   * Minor/cosmetic.
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
  language: Language,
): string {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brule",
      "odeur de brûlé",
      "sent le brule",
      "sent le brûlé",
    ]);

  const waterLeak =
    has(text, [
      "water leak",
      "water leakage",
      "leaking water",
      "fuite",
      "fuite d'eau",
      "fuite d eau",
      "eau qui fuit",
    ]);

  if (
    category === "Electrical" &&
    burning
  ) {
    return language === "fr"
      ? "Odeur de brûlé signalée au niveau d'un élément électrique. Il peut s'agir d'une surchauffe ou d'un défaut électrique et une inspection professionnelle urgente est nécessaire."
      : "A burning smell was reported from an electrical component. This may indicate overheating or an electrical fault and requires urgent professional inspection.";
  }

  if (
    category === "Electrical" &&
    has(text, [
      "spark",
      "sparks",
      "sparking",
      "etincelle",
      "étincelle",
      "etincelles",
      "étincelles",
    ])
  ) {
    return language === "fr"
      ? "Des étincelles ont été signalées sur le système électrique. Cela peut représenter un risque électrique important et nécessite une inspection professionnelle rapide."
      : "Electrical sparking was reported. This may represent a significant electrical safety hazard and requires prompt professional inspection.";
  }

  if (
    category === "HVAC"
  ) {
    return language === "fr"
      ? "Problème potentiel du système de chauffage ou de climatisation nécessitant une inspection afin d'en déterminer la cause."
      : "Possible heating or cooling system issue requiring inspection to determine the cause.";
  }

  if (
    category === "Plumbing"
  ) {
    if (waterLeak) {
      return language === "fr"
        ? "Fuite d'eau potentielle signalée. Une inspection de la plomberie est nécessaire pour déterminer la source et l'étendue du problème."
        : "A possible water leak was reported. Plumbing inspection is required to determine the source and extent of the problem.";
    }

    return language === "fr"
      ? "Problème potentiel de plomberie nécessitant une inspection."
      : "Possible plumbing issue requiring inspection.";
  }

  if (
    category === "Appliance"
  ) {
    return language === "fr"
      ? "Dysfonctionnement potentiel d'un appareil nécessitant une inspection par un technicien spécialisé."
      : "Possible appliance malfunction requiring inspection by an appliance technician.";
  }

  if (
    category === "Structural"
  ) {
    return language === "fr"
      ? "Problème potentiel concernant le bâtiment ou un élément structurel nécessitant une inspection."
      : "Possible building or structural maintenance issue requiring inspection.";
  }

  if (
    category === "Pest"
  ) {
    return language === "fr"
      ? "Présence potentielle de nuisibles nécessitant une évaluation et un traitement approprié."
      : "Possible pest infestation requiring assessment and appropriate treatment.";
  }

  if (
    priority === "Critical"
  ) {
    return language === "fr"
      ? "Situation potentiellement urgente nécessitant une intervention immédiate. La cause exacte doit être confirmée sur place."
      : "Potential emergency condition requiring immediate attention. The exact cause must be confirmed on site.";
  }

  if (
    priority === "High"
  ) {
    return language === "fr"
      ? "Problème de maintenance présentant un risque accru pour la sécurité ou le bien immobilier. Une inspection rapide est recommandée."
      : "Maintenance issue with elevated safety or property-damage risk. Prompt inspection is recommended.";
  }

  return language === "fr"
    ? "Problème de maintenance signalé nécessitant une inspection afin d'en déterminer la cause."
    : "Maintenance issue reported requiring inspection to determine the cause.";
}

/* =========================================================
   RECOMMENDED ACTION
   ========================================================= */

function buildRecommendedAction(
  category: Category,
  priority: Priority,
  text: string,
  language: Language,
): string {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brule",
      "odeur de brûlé",
      "sent le brule",
      "sent le brûlé",
    ]);

  if (
    priority === "Critical"
  ) {
    return language === "fr"
      ? "Escalader immédiatement la demande et contacter les services d'urgence lorsque cela est nécessaire."
      : "Escalate the request immediately and contact emergency services when necessary.";
  }

  if (
    category === "Electrical" &&
    priority === "High"
  ) {
    return language === "fr"
      ? "Traiter la situation comme un problème électrique urgent et faire intervenir rapidement un électricien qualifié. En cas de fumée, de feu ou de choc électrique, procéder à une escalade immédiate."
      : "Treat this as an urgent electrical safety issue and dispatch a qualified electrician promptly. If there is smoke, fire, or electric shock, escalate immediately.";
  }

  if (
    category === "HVAC" &&
    priority === "High" &&
    burning
  ) {
    return language === "fr"
      ? "Éviter d'utiliser l'équipement HVAC si cela peut être fait sans danger et faire intervenir rapidement un technicien HVAC pour inspection."
      : "Avoid using the HVAC equipment if it can be done safely and dispatch an HVAC technician for urgent inspection.";
  }

  if (
    priority === "High"
  ) {
    return language === "fr"
      ? `Faire intervenir rapidement un ${technicianRoleFor(
          category,
        )} pour inspection et intervention corrective.`
      : `Assign a ${technicianRoleFor(
          category,
        )} for urgent inspection and corrective action.`;
  }

  switch (category) {
    case "HVAC":
      return language === "fr"
        ? "Faire intervenir un technicien HVAC pour inspecter le système de chauffage ou de climatisation."
        : "Assign an HVAC technician to inspect the heating or cooling system.";

    case "Plumbing":
      return language === "fr"
        ? "Faire intervenir un plombier qualifié pour inspecter le système et identifier la source du problème."
        : "Assign a licensed plumber to inspect the plumbing system and identify the source of the issue.";

    case "Electrical":
      return language === "fr"
        ? "Faire intervenir un électricien qualifié pour inspecter le système électrique."
        : "Assign a licensed electrician to inspect the electrical system.";

    case "Appliance":
      return language === "fr"
        ? "Faire intervenir un technicien électroménager pour inspecter l'appareil."
        : "Assign an appliance technician to inspect the appliance.";

    case "Structural":
      return language === "fr"
        ? "Faire intervenir un technicien de maintenance qualifié ou un professionnel compétent pour inspecter la zone concernée."
        : "Assign qualified maintenance personnel or a contractor to inspect the affected area.";

    case "Pest":
      return language === "fr"
        ? "Faire intervenir un technicien de lutte antiparasitaire pour inspecter la zone concernée."
        : "Assign a pest control technician to inspect the affected area.";

    default:
      return language === "fr"
        ? "Faire intervenir un technicien de maintenance générale pour inspecter le problème."
        : "Assign a general maintenance technician to inspect the reported issue.";
  }
}

/* =========================================================
   SAFETY ASSESSMENT
   ========================================================= */

function buildSafetyAssessment(
  priority: Priority,
  category: Category,
  text: string,
  language: Language,
): string {
  if (
    priority === "Critical"
  ) {
    return language === "fr"
      ? "Risque immédiat pour la sécurité détecté. Une escalade sans délai et l'application des procédures d'urgence sont recommandées."
      : "An immediate safety hazard is indicated. Escalate without delay and follow emergency procedures.";
  }

  if (
    priority === "High"
  ) {
    if (
      category === "Electrical"
    ) {
      return language === "fr"
        ? "Risque potentiel de sécurité électrique détecté. Une inspection urgente par un électricien qualifié est recommandée."
        : "Potential electrical safety hazard detected. Urgent inspection by a qualified electrician is recommended.";
    }

    if (
      has(text, [
        "burning smell",
        "smell of burning",
        "burning odor",
        "burning scent",
        "odeur de brule",
        "odeur de brûlé",
        "sent le brule",
        "sent le brûlé",
      ])
    ) {
      return language === "fr"
        ? "Un risque potentiel pour la sécurité est indiqué par l'odeur de brûlé. Une inspection professionnelle urgente est recommandée."
        : "A potential safety hazard is indicated by the reported burning smell. Urgent professional inspection is recommended.";
    }

    return language === "fr"
      ? "Un risque accru pour la sécurité ou le bien immobilier est indiqué. Une inspection rapide est recommandée."
      : "Elevated safety or property-damage risk is indicated. Prompt professional inspection is recommended.";
  }

  if (
    priority === "Low"
  ) {
    return language === "fr"
      ? "Aucun danger immédiat pour la sécurité n'est indiqué par les informations fournies."
      : "No immediate safety hazard is indicated by the information provided.";
  }

  return language === "fr"
    ? "Aucun danger immédiat pour la sécurité n'est indiqué par les informations fournies."
    : "No immediate safety hazard is indicated by the information provided.";
}

/* =========================================================
   FOLLOW-UP QUESTIONS
   ========================================================= */

function buildFollowUpQuestions(
  category: Category,
  text: string,
  language: Language,
): string[] {
  const burning =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brule",
      "odeur de brûlé",
      "sent le brule",
      "sent le brûlé",
    ]);

  if (
    category === "Electrical"
  ) {
    if (burning) {
      return language === "fr"
        ? [
            "La prise ou l'équipement concerné a-t-il été éteint ?",
            "Y a-t-il de la fumée ou des flammes visibles ?",
            "L'odeur de brûlé devient-elle plus forte ?",
          ]
        : [
            "Has the affected outlet or equipment been turned off?",
            "Is there any visible smoke or fire?",
            "Is the burning smell getting stronger?",
          ];
    }

    return language === "fr"
      ? [
          "Y a-t-il des étincelles ou de la fumée visible ?",
          "L'équipement concerné est-il toujours sous tension ?",
          "Le disjoncteur a-t-il sauté ?",
        ]
      : [
          "Are there sparks or visible smoke?",
          "Is the affected equipment still powered?",
          "Has the breaker tripped?",
        ];
  }

  if (
    category === "HVAC"
  ) {
    if (burning) {
      return language === "fr"
        ? [
            "Le système HVAC a-t-il été éteint ?",
            "Y a-t-il de la fumée ou des flammes visibles ?",
            "L'odeur de brûlé devient-elle plus forte ?",
          ]
        : [
            "Has the HVAC system been turned off?",
            "Is there any visible smoke or fire?",
            "Is the burning smell getting stronger?",
          ];
    }

    return language === "fr"
      ? [
          "Le système fonctionne-t-il toujours ?",
          "Y a-t-il une fuite d'eau ?",
          "Le système produit-il un bruit ou une odeur inhabituelle ?",
        ]
      : [
          "Is the system still running?",
          "Is there any water leaking?",
          "Is the system producing an unusual noise or smell?",
        ];
  }

  if (
    category === "Plumbing"
  ) {
    return language === "fr"
      ? [
          "La fuite d'eau est-elle toujours active ?",
          "Quelle est la quantité d'eau qui fuit ?",
          "L'arrivée d'eau peut-elle être coupée sans danger ?",
        ]
      : [
          "Is the water leak still active?",
          "How much water is leaking?",
          "Can the water supply be safely shut off?",
        ];
  }

  if (
    category === "Appliance"
  ) {
    return language === "fr"
      ? [
          "L'appareil fonctionne-t-il toujours ?",
          "Y a-t-il un bruit ou une odeur inhabituelle ?",
          "L'appareil est-il alimenté en électricité ?",
        ]
      : [
          "Is the appliance still running?",
          "Is there any unusual noise or smell?",
          "Does the appliance have power?",
        ];
  }

  if (
    category === "Structural"
  ) {
    return language === "fr"
      ? [
          "La zone concernée est-elle toujours utilisable ?",
          "Y a-t-il des dommages visibles, un mouvement ou des fissures ?",
          "Y a-t-il une infiltration d'eau ?",
        ]
      : [
          "Is the affected area still usable?",
          "Is there visible damage, movement, or cracking?",
          "Is there any water intrusion?",
        ];
  }

  if (
    category === "Pest"
  ) {
    return language === "fr"
      ? [
          "Où les nuisibles ont-ils été observés ?",
          "Combien en avez-vous vus ?",
          "Y a-t-il des signes d'une infestation active ?",
        ]
      : [
          "Where were the pests observed?",
          "How many were seen?",
          "Are there signs of an active infestation?",
        ];
  }

  return language === "fr"
    ? [
        "Le problème se produit-il toujours ?",
        "Quand le problème a-t-il commencé ?",
        "Une intervention a-t-elle déjà été effectuée ?",
      ]
    : [
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
  const language =
    detectLanguage(
      input.description,
    );

  const text =
    normalize(
      input.description,
    );

  const detected =
    detectCategory(text);

  /*
   * Manual category selection is respected
   * when explicitly supplied.
   *
   * Otherwise automatic classification wins.
   */
  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Priority is ALWAYS analyzed from
   * the actual description.
   */
  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  let priority: Priority;

  /*
   * Safety escalation cannot be downgraded.
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

  const riskLevel =
    priority;

  const problemSummary =
    buildProblemSummary(
      text,
      category,
      priority,
      language,
    );

  const recommendedAction =
    buildRecommendedAction(
      category,
      priority,
      text,
      language,
    );

  const technician =
    technicianRoleFor(
      category,
    );

  const followUpQuestions =
    buildFollowUpQuestions(
      category,
      text,
      language,
    );

  const safetyAssessment =
    buildSafetyAssessment(
      priority,
      category,
      text,
      language,
    );

  /*
   * =======================================================
   * CONFIDENCE
   * =======================================================
   */

  let confidence = 0.72;

  if (
    detected.category === category
  ) {
    confidence += 0.10;
  }

  if (
    detected.strength >= 20
  ) {
    confidence += 0.08;
  }

  if (
    detected.strength >= 40
  ) {
    confidence += 0.05;
  }

  /*
   * Other should never claim extremely
   * high confidence.
   */
  if (
    category === "Other"
  ) {
    confidence = Math.min(
      confidence,
      0.80,
    );
  }

  if (
    priority === "Critical"
  ) {
    confidence = Math.max(
      confidence,
      0.96,
    );
  } else if (
    priority === "High"
  ) {
    confidence = Math.max(
      confidence,
      0.92,
    );
  }

  confidence = Math.min(
    0.99,
    Number(
      confidence.toFixed(2),
    ),
  );

  return {
    language,
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

  const language =
    analysis.language;

  if (
    analysis.priority ===
    "Critical"
  ) {
    return language === "fr"
      ? `Bonjour ${tenant}, merci d'avoir signalé ce problème. Nous le traitons comme une situation urgente présentant un risque pour la sécurité et nous procédons immédiatement à son escalade. Évitez la zone ou l'équipement concerné s'il présente un danger et contactez les services d'urgence en cas de danger immédiat.`
      : `Hi ${tenant}, thank you for reporting this issue. We are treating it as an urgent safety matter and escalating it immediately. Please avoid the affected area or equipment if it is unsafe, and contact emergency services if there is an immediate danger.`;
  }

  if (
    analysis.priority ===
    "High"
  ) {
    return language === "fr"
      ? `Bonjour ${tenant}, merci d'avoir signalé ce problème. Nous l'avons identifié comme une demande de maintenance prioritaire et allons organiser rapidement une inspection par un ${analysis.technician}. Évitez d'utiliser l'équipement concerné si cela peut présenter un danger.`
      : `Hi ${tenant}, thank you for reporting this issue. We have identified it as a high-priority maintenance concern and will arrange an urgent inspection by a ${analysis.technician}. Please avoid using the affected equipment if doing so could be unsafe.`;
  }

  if (
    analysis.priority ===
    "Medium"
  ) {
    return language === "fr"
      ? `Bonjour ${tenant}, merci d'avoir signalé ce problème. Votre demande de maintenance a été enregistrée et nous allons organiser une inspection par un ${analysis.technician}. Nous vous tiendrons informé de la planification de l'intervention.`
      : `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to inspect it. We will provide an update once the inspection is scheduled.`;
  }

  return language === "fr"
    ? `Bonjour ${tenant}, merci d'avoir signalé ce problème. Votre demande de maintenance a été enregistrée et nous allons organiser son inspection par un ${analysis.technician}.`
    : `Hi ${tenant}, thank you for reporting this issue. We have logged your maintenance request and will arrange for a ${analysis.technician} to review it.`;
}
