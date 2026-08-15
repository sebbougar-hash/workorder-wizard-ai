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
    "hvac",
    "air conditioner",
    "air conditioning",
    "a c",
    "ac unit",
    "furnace",
    "heater",
    "heating",
    "thermostat",
    "heat pump",
    "cooling system",
    "refrigerant",
    "condenser",
    "evaporator",
    "duct",
    "ductwork",
    "airflow",
    "air flow",
    "vent",
    "vents",
    "ventilation",
  ],

  Plumbing: [
    "plumbing",
    "plumber",
    "sink",
    "toilet",
    "faucet",
    "tap",
    "pipe",
    "pipes",
    "drain",
    "shower",
    "bathtub",
    "bath tub",
    "water pressure",
    "water leak",
    "water leakage",
    "leaking water",
    "water dripping",
    "dripping water",
    "sewage",
    "sewer",
    "clog",
    "clogged",
    "blocked drain",
    "blocked toilet",
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
    "panel",
    "wiring",
    "wire",
    "wires",
    "fuse",
    "fuse box",
    "short circuit",
    "power outage",
    "power",
    "electric shock",
    "electrical shock",
    "electrocution",
    "electrocuted",
    "sparking",
    "sparks",
    "spark",
    "live wire",
    "live wiring",
    "exposed wire",
    "exposed wiring",
    "light switch",
    "switch",
    "lights",
    "light",
  ],

  Appliance: [
    "refrigerator",
    "fridge",
    "freezer",
    "dishwasher",
    "washing machine",
    "washer",
    "dryer",
    "tumble dryer",
    "oven",
    "stove",
    "cooktop",
    "microwave",
    "garbage disposal",
    "disposal",
    "water heater",
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
    "stairs",
    "stair",
    "cabinet",
    "closet",
    "baseboard",
    "flooring",
    "crack",
    "broken door",
    "broken window",
  ],

  Pest: [
    "cockroach",
    "cockroaches",
    "roach",
    "roaches",
    "rat",
    "rats",
    "mouse",
    "mice",
    "rodent",
    "rodents",
    "bed bug",
    "bed bugs",
    "bedbug",
    "bedbugs",
    "termite",
    "termites",
    "ant",
    "ants",
    "insect",
    "insects",
    "pest",
    "pests",
    "infestation",
  ],
};

/* =========================================================
   NATURAL-LANGUAGE PATTERNS
   These are phrases a normal tenant is likely to use.
   ========================================================= */

const NATURAL_PATTERNS: Record<
  Exclude<Category, "Other">,
  { phrase: string; weight: number }[]
> = {
  HVAC: [
    {
      phrase: "apartment is getting hot",
      weight: 16,
    },
    {
      phrase: "apartment is too hot",
      weight: 16,
    },
    {
      phrase: "apartment is extremely hot",
      weight: 18,
    },
    {
      phrase: "apartment is very hot",
      weight: 16,
    },
    {
      phrase: "room is getting hot",
      weight: 16,
    },
    {
      phrase: "room is too hot",
      weight: 16,
    },
    {
      phrase: "room is extremely hot",
      weight: 18,
    },
    {
      phrase: "room is very hot",
      weight: 16,
    },
    {
      phrase: "house is getting hot",
      weight: 16,
    },
    {
      phrase: "house is too hot",
      weight: 16,
    },
    {
      phrase: "place is getting hot",
      weight: 15,
    },
    {
      phrase: "place is too hot",
      weight: 15,
    },
    {
      phrase: "too hot inside",
      weight: 14,
    },
    {
      phrase: "very hot inside",
      weight: 14,
    },
    {
      phrase: "extremely hot inside",
      weight: 16,
    },
    {
      phrase: "hot inside",
      weight: 12,
    },
    {
      phrase: "not cooling",
      weight: 12,
    },
    {
      phrase: "doesn't cool",
      weight: 12,
    },
    {
      phrase: "does not cool",
      weight: 12,
    },
    {
      phrase: "can't cool",
      weight: 14,
    },
    {
      phrase: "cannot cool",
      weight: 14,
    },
    {
      phrase: "can't cool the apartment",
      weight: 18,
    },
    {
      phrase: "cannot cool the apartment",
      weight: 18,
    },
    {
      phrase: "can't cool the room",
      weight: 18,
    },
    {
      phrase: "cannot cool the room",
      weight: 18,
    },
    {
      phrase: "air is not cold",
      weight: 14,
    },
    {
      phrase: "air isn't cold",
      weight: 14,
    },
    {
      phrase: "air does not feel cold",
      weight: 16,
    },
    {
      phrase: "air doesn't feel cold",
      weight: 16,
    },
    {
      phrase: "warm air from the vents",
      weight: 18,
    },
    {
      phrase: "warm air coming from the vents",
      weight: 20,
    },
    {
      phrase: "air coming out of the vents",
      weight: 10,
    },
    {
      phrase: "air from the vents",
      weight: 8,
    },
    {
      phrase: "vents are blowing",
      weight: 10,
    },
    {
      phrase: "vents are blowing warm air",
      weight: 18,
    },
    {
      phrase: "vents feel warm",
      weight: 16,
    },
    {
      phrase: "temperature doesn't change",
      weight: 14,
    },
    {
      phrase: "temperature does not change",
      weight: 14,
    },
    {
      phrase: "changing the temperature",
      weight: 8,
    },
    {
      phrase: "wall control",
      weight: 10,
    },
    {
      phrase: "sweating at night",
      weight: 10,
    },
    {
      phrase: "hot at night",
      weight: 10,
    },
    {
      phrase: "freezing inside",
      weight: 12,
    },
    {
      phrase: "too cold inside",
      weight: 12,
    },
    {
      phrase: "room won't warm up",
      weight: 16,
    },
    {
      phrase: "room will not warm up",
      weight: 16,
    },
    {
      phrase: "house won't warm up",
      weight: 16,
    },
    {
      phrase: "house will not warm up",
      weight: 16,
    },
  ],

  Plumbing: [
    {
      phrase: "water is leaking",
      weight: 14,
    },
    {
      phrase: "water is dripping",
      weight: 14,
    },
    {
      phrase: "water keeps dripping",
      weight: 16,
    },
    {
      phrase: "water is coming from",
      weight: 10,
    },
    {
      phrase: "water on the floor",
      weight: 16,
    },
    {
      phrase: "water on my floor",
      weight: 16,
    },
    {
      phrase: "floor is wet",
      weight: 12,
    },
    {
      phrase: "water under the sink",
      weight: 18,
    },
    {
      phrase: "water under my sink",
      weight: 18,
    },
    {
      phrase: "toilet is clogged",
      weight: 18,
    },
    {
      phrase: "toilet won't flush",
      weight: 18,
    },
    {
      phrase: "toilet will not flush",
      weight: 18,
    },
    {
      phrase: "sink won't drain",
      weight: 18,
    },
    {
      phrase: "sink will not drain",
      weight: 18,
    },
    {
      phrase: "shower has low pressure",
      weight: 16,
    },
    {
      phrase: "low water pressure",
      weight: 16,
    },
    {
      phrase: "no water pressure",
      weight: 16,
    },
    {
      phrase: "water pressure is low",
      weight: 16,
    },
    {
      phrase: "drain is clogged",
      weight: 18,
    },
    {
      phrase: "drain is blocked",
      weight: 18,
    },
    {
      phrase: "there is a leak",
      weight: 12,
    },
    {
      phrase: "there's a leak",
      weight: 12,
    },
  ],

  Electrical: [
    {
      phrase: "lights don't work",
      weight: 16,
    },
    {
      phrase: "lights do not work",
      weight: 16,
    },
    {
      phrase: "lights stopped working",
      weight: 18,
    },
    {
      phrase: "light stopped working",
      weight: 18,
    },
    {
      phrase: "no power",
      weight: 16,
    },
    {
      phrase: "power is out",
      weight: 18,
    },
    {
      phrase: "power went out",
      weight: 18,
    },
    {
      phrase: "electricity is out",
      weight: 18,
    },
    {
      phrase: "electricity went out",
      weight: 18,
    },
    {
      phrase: "outlet doesn't work",
      weight: 18,
    },
    {
      phrase: "outlet does not work",
      weight: 18,
    },
    {
      phrase: "socket doesn't work",
      weight: 18,
    },
    {
      phrase: "socket does not work",
      weight: 18,
    },
    {
      phrase: "breaker keeps tripping",
      weight: 22,
    },
    {
      phrase: "breaker keeps going off",
      weight: 20,
    },
    {
      phrase: "breaker keeps shutting off",
      weight: 20,
    },
    {
      phrase: "lights are flickering",
      weight: 18,
    },
    {
      phrase: "light is flickering",
      weight: 18,
    },
    {
      phrase: "I saw sparks",
      weight: 22,
    },
    {
      phrase: "there are sparks",
      weight: 22,
    },
    {
      phrase: "something sparked",
      weight: 20,
    },
    {
      phrase: "smell of burning near the outlet",
      weight: 24,
    },
    {
      phrase: "burning smell from the outlet",
      weight: 24,
    },
    {
      phrase: "wire is exposed",
      weight: 22,
    },
    {
      phrase: "wires are exposed",
      weight: 22,
    },
    {
      phrase: "got an electric shock",
      weight: 30,
    },
    {
      phrase: "got a shock from",
      weight: 28,
    },
  ],

  Appliance: [
    {
      phrase: "fridge is not cooling",
      weight: 22,
    },
    {
      phrase: "fridge isn't cooling",
      weight: 22,
    },
    {
      phrase: "refrigerator is not cooling",
      weight: 22,
    },
    {
      phrase: "refrigerator isn't cooling",
      weight: 22,
    },
    {
      phrase: "dishwasher won't drain",
      weight: 22,
    },
    {
      phrase: "dishwasher will not drain",
      weight: 22,
    },
    {
      phrase: "washing machine won't start",
      weight: 22,
    },
    {
      phrase: "washing machine will not start",
      weight: 22,
    },
    {
      phrase: "washer won't start",
      weight: 22,
    },
    {
      phrase: "dryer isn't heating",
      weight: 22,
    },
    {
      phrase: "dryer is not heating",
      weight: 22,
    },
    {
      phrase: "oven isn't heating",
      weight: 22,
    },
    {
      phrase: "oven is not heating",
      weight: 22,
    },
    {
      phrase: "appliance stopped working",
      weight: 18,
    },
    {
      phrase: "appliance isn't working",
      weight: 18,
    },
    {
      phrase: "appliance is not working",
      weight: 18,
    },
  ],

  Structural: [
    {
      phrase: "door won't close",
      weight: 20,
    },
    {
      phrase: "door will not close",
      weight: 20,
    },
    {
      phrase: "door won't lock",
      weight: 20,
    },
    {
      phrase: "door will not lock",
      weight: 20,
    },
    {
      phrase: "window won't close",
      weight: 20,
    },
    {
      phrase: "window will not close",
      weight: 20,
    },
    {
      phrase: "window is broken",
      weight: 18,
    },
    {
      phrase: "crack in the wall",
      weight: 20,
    },
    {
      phrase: "crack on the wall",
      weight: 20,
    },
    {
      phrase: "crack in the ceiling",
      weight: 20,
    },
    {
      phrase: "ceiling is damaged",
      weight: 18,
    },
    {
      phrase: "water stain on the ceiling",
      weight: 20,
    },
    {
      phrase: "water damage on the ceiling",
      weight: 22,
    },
    {
      phrase: "floor is damaged",
      weight: 18,
    },
    {
      phrase: "floor is broken",
      weight: 18,
    },
  ],

  Pest: [
    {
      phrase: "keep seeing bugs",
      weight: 18,
    },
    {
      phrase: "keep seeing insects",
      weight: 18,
    },
    {
      phrase: "bugs in the kitchen",
      weight: 20,
    },
    {
      phrase: "bugs in my kitchen",
      weight: 20,
    },
    {
      phrase: "bugs in the bedroom",
      weight: 20,
    },
    {
      phrase: "insects in the apartment",
      weight: 18,
    },
    {
      phrase: "mice in the apartment",
      weight: 24,
    },
    {
      phrase: "mouse in the apartment",
      weight: 24,
    },
    {
      phrase: "rat in the apartment",
      weight: 24,
    },
    {
      phrase: "droppings in the kitchen",
      weight: 22,
    },
    {
      phrase: "droppings in the bedroom",
      weight: 22,
    },
    {
      phrase: "bed bugs in the bedroom",
      weight: 26,
    },
    {
      phrase: "signs of termites",
      weight: 26,
    },
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
      weight: 22,
    },
    {
      terms: ["air conditioning", "not cooling"],
      weight: 22,
    },
    {
      terms: ["air conditioner", "burning smell"],
      weight: 25,
    },
    {
      terms: ["air conditioning", "burning smell"],
      weight: 25,
    },
    {
      terms: ["hvac", "burning smell"],
      weight: 25,
    },
    {
      terms: ["furnace", "burning smell"],
      weight: 25,
    },
    {
      terms: ["heater", "burning smell"],
      weight: 25,
    },
    {
      terms: ["cooling system", "burning smell"],
      weight: 25,
    },
    {
      terms: ["thermostat", "cooling"],
      weight: 15,
    },
    {
      terms: ["thermostat", "heating"],
      weight: 15,
    },
    {
      terms: ["thermostat", "temperature"],
      weight: 14,
    },
    {
      terms: ["furnace", "not heating"],
      weight: 18,
    },
    {
      terms: ["heater", "not heating"],
      weight: 18,
    },
    {
      terms: ["vents", "warm air"],
      weight: 20,
    },
    {
      terms: ["vents", "cold air"],
      weight: 16,
    },
  ],

  Plumbing: [
    {
      terms: ["pipe", "water leak"],
      weight: 20,
    },
    {
      terms: ["sink", "water leak"],
      weight: 20,
    },
    {
      terms: ["toilet", "water leak"],
      weight: 20,
    },
    {
      terms: ["faucet", "water leak"],
      weight: 20,
    },
    {
      terms: ["toilet", "not flushing"],
      weight: 20,
    },
    {
      terms: ["sink", "not draining"],
      weight: 20,
    },
    {
      terms: ["shower", "low water pressure"],
      weight: 20,
    },
    {
      terms: ["water", "floor"],
      weight: 8,
    },
  ],

  Electrical: [
    {
      terms: ["outlet", "sparks"],
      weight: 25,
    },
    {
      terms: ["outlet", "sparking"],
      weight: 25,
    },
    {
      terms: ["socket", "sparks"],
      weight: 25,
    },
    {
      terms: ["socket", "sparking"],
      weight: 25,
    },
    {
      terms: ["outlet", "no power"],
      weight: 22,
    },
    {
      terms: ["socket", "no power"],
      weight: 22,
    },
    {
      terms: ["breaker", "keeps tripping"],
      weight: 28,
    },
    {
      terms: ["breaker", "trips"],
      weight: 22,
    },
    {
      terms: ["burning smell", "outlet"],
      weight: 28,
    },
    {
      terms: ["burning smell", "socket"],
      weight: 28,
    },
    {
      terms: ["burning smell", "electrical"],
      weight: 28,
    },
    {
      terms: ["exposed wire", "electrical"],
      weight: 28,
    },
    {
      terms: ["exposed wiring", "electrical"],
      weight: 28,
    },
    {
      terms: ["live wire", "electrical"],
      weight: 28,
    },
    {
      terms: ["short circuit", "electrical"],
      weight: 28,
    },
    {
      terms: ["lights", "no power"],
      weight: 20,
    },
  ],

  Appliance: [
    {
      terms: ["refrigerator", "not cooling"],
      weight: 24,
    },
    {
      terms: ["fridge", "not cooling"],
      weight: 24,
    },
    {
      terms: ["dishwasher", "not draining"],
      weight: 24,
    },
    {
      terms: ["washing machine", "not starting"],
      weight: 24,
    },
    {
      terms: ["washer", "not starting"],
      weight: 24,
    },
    {
      terms: ["dryer", "not heating"],
      weight: 24,
    },
    {
      terms: ["oven", "not heating"],
      weight: 24,
    },
  ],

  Structural: [
    {
      terms: ["door", "lock"],
      weight: 18,
    },
    {
      terms: ["window", "frame"],
      weight: 18,
    },
    {
      terms: ["ceiling", "water"],
      weight: 18,
    },
    {
      terms: ["roof", "water"],
      weight: 18,
    },
    {
      terms: ["wall", "crack"],
      weight: 22,
    },
    {
      terms: ["floor", "damage"],
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
      weight: 24,
    },
    {
      terms: ["rat", "droppings"],
      weight: 24,
    },
    {
      terms: ["bed bugs", "bedroom"],
      weight: 24,
    },
    {
      terms: ["termite", "wood"],
      weight: 24,
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
    .replace(/[’]/g, "'")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/* =========================================================
   NEGATION ENGINE
   ========================================================= */

/*
 * Negation words/phrases.
 *
 * We intentionally include conversational English,
 * because tenants usually describe problems naturally.
 */

const NEGATION_PATTERNS = [
  "no",
  "not",
  "isn't",
  "isnt",
  "aren't",
  "arent",
  "wasn't",
  "wasnt",
  "weren't",
  "werent",
  "don't",
  "dont",
  "doesn't",
  "doesnt",
  "didn't",
  "didnt",
  "can't",
  "cant",
  "cannot",
  "couldn't",
  "couldnt",
  "won't",
  "wont",
  "wouldn't",
  "wouldnt",
  "without",
  "never",
  "nothing",
  "none",
  "neither",
];

/*
 * Checks whether a term occurrence is negated.
 *
 * Example:
 *
 * "there isn't any water leaking"
 *
 * => "water leaking" is NEGATED.
 *
 * But:
 *
 * "there isn't any water leaking, but the AC is broken"
 *
 * => the AC evidence remains valid.
 */

function isNegatedAt(
  text: string,
  index: number,
) {
  const before = text
    .slice(
      Math.max(0, index - 70),
      index,
    )
    .trim();

  if (!before) {
    return false;
  }

  /*
   * Strong direct constructions.
   */

  const strongNegation =
    /(?:^|\s)(?:there\s+(?:is|are|was|were)\s+(?:no|not)|there's\s+no|there're\s+no|there\s+isn't|there\s+aren't|there\s+wasn't|there\s+weren't)\s+(?:\w+\s+){0,4}$/i;

  if (
    strongNegation.test(before)
  ) {
    return true;
  }

  /*
   * Common "I don't have..." constructions.
   */

  const possessionNegation =
    /(?:^|\s)(?:i|we|they|he|she)\s+(?:do\s+not|don't|does\s+not|doesn't|did\s+not|didn't)\s+(?:have|see|hear|notice|smell|feel)\s+(?:\w+\s+){0,4}$/i;

  if (
    possessionNegation.test(before)
  ) {
    return true;
  }

  /*
   * Generic negation within a short local window.
   *
   * We stop at contrast words so that:
   *
   * "no leak, but the AC is broken"
   *
   * does not contaminate the HVAC evidence.
   */

  const words = before.split(/\s+/);

  const recentWords = words.slice(-8);

  for (
    let i = 0;
    i < recentWords.length;
    i++
  ) {
    const word =
      recentWords[i];

    if (
      NEGATION_PATTERNS.includes(
        word,
      )
    ) {
      return true;
    }

    /*
     * "not any water"
     */
    if (
      word === "not" &&
      recentWords[i + 1] ===
        "any"
    ) {
      return true;
    }
  }

  return false;
}

/*
 * Returns true if at least one NON-negated
 * occurrence of a term exists.
 */

function hasTerm(
  text: string,
  term: string,
) {
  let searchFrom = 0;

  while (true) {
    const index =
      text.indexOf(
        term,
        searchFrom,
      );

    if (index === -1) {
      return false;
    }

    if (
      !isNegatedAt(
        text,
        index,
      )
    ) {
      return true;
    }

    searchFrom =
      index + term.length;
  }
}

function has(
  text: string,
  terms: string[],
) {
  return terms.some(
    (term) =>
      hasTerm(text, term),
  );
}

function countMatches(
  text: string,
  terms: string[],
) {
  return terms.reduce(
    (count, term) =>
      count +
      (hasTerm(
        text,
        term,
      )
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
  "there's a fire",
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

/* =========================================================
   CATEGORY DETECTION
   ========================================================= */

function detectCategory(
  text: string,
): {
  category: Category | null;
  strength: number;
} {
  const categories =
    Object.keys(
      KEYWORDS,
    ) as Exclude<
      Category,
      "Other"
    >[];

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
   * ---------------------------------------------------------
   * STEP 1: Basic keyword evidence
   * ---------------------------------------------------------
   */

  for (
    const category of categories
  ) {
    scores[category] +=
      countMatches(
        text,
        KEYWORDS[
          category
        ],
      );
  }

  /*
   * ---------------------------------------------------------
   * STEP 2: Natural-language evidence
   * ---------------------------------------------------------
   */

  for (
    const category of categories
  ) {
    for (
      const pattern of NATURAL_PATTERNS[
        category
      ]
    ) {
      if (
        hasTerm(
          text,
          pattern.phrase,
        )
      ) {
        scores[category] +=
          pattern.weight;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * STEP 3: Combination evidence
   * ---------------------------------------------------------
   */

  for (
    const category of categories
  ) {
    for (
      const combination of CATEGORY_COMBINATIONS[
        category
      ]
    ) {
      const matched =
        combination.terms.every(
          (term) =>
            hasTerm(
              text,
              term,
            ),
        );

      if (matched) {
        scores[category] +=
          combination.weight;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * STEP 4: Appliance priority
   *
   * If a specific household appliance is mentioned,
   * classify as Appliance unless the user clearly describes
   * the building electrical infrastructure itself.
   * ---------------------------------------------------------
   */

  const applianceMentioned =
    has(text, [
      "refrigerator",
      "fridge",
      "freezer",
      "dishwasher",
      "washing machine",
      "washer",
      "dryer",
      "tumble dryer",
      "oven",
      "stove",
      "cooktop",
      "microwave",
      "garbage disposal",
    ]);

  const applianceElectricalInfrastructure =
    has(text, [
      "outlet",
      "socket",
      "breaker",
      "circuit breaker",
      "electrical panel",
      "fuse box",
      "wiring",
      "exposed wire",
      "live wire",
    ]);

  if (
    applianceMentioned &&
    !applianceElectricalInfrastructure
  ) {
    return {
      category: "Appliance",
      strength: Math.max(
        scores.Appliance,
        25,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 5: Strong HVAC contextual detection
   *
   * This is the important fix for descriptions such as:
   *
   * "My apartment is extremely hot."
   * "The vents are blowing but the air isn't cold."
   * "The thermostat doesn't seem to change anything."
   * ---------------------------------------------------------
   */

  const heatProblem =
    has(text, [
      "apartment is getting hot",
      "apartment is too hot",
      "apartment is extremely hot",
      "apartment is very hot",
      "room is getting hot",
      "room is too hot",
      "room is extremely hot",
      "room is very hot",
      "house is getting hot",
      "house is too hot",
      "place is getting hot",
      "place is too hot",
      "too hot inside",
      "very hot inside",
      "extremely hot inside",
      "hot inside",
    ]);

  const coolingProblem =
    has(text, [
      "not cooling",
      "doesn't cool",
      "does not cool",
      "can't cool",
      "cannot cool",
      "air is not cold",
      "air isn't cold",
      "air does not feel cold",
      "air doesn't feel cold",
      "warm air from the vents",
      "warm air coming from the vents",
      "vents feel warm",
    ]);

  const HVACControlEvidence =
    has(text, [
      "thermostat",
      "wall control",
      "changing the temperature",
      "temperature doesn't change",
      "temperature does not change",
    ]);

  const HVACVentEvidence =
    has(text, [
      "air coming out of the vents",
      "air from the vents",
      "vents are blowing",
      "vents are blowing warm air",
      "warm air from the vents",
      "warm air coming from the vents",
    ]);

  /*
   * Strong contextual combination:
   *
   * heat + thermostat
   * heat + vents
   * heat + cooling
   * cooling + vents
   */

  if (
    (heatProblem &&
      HVACControlEvidence) ||
    (heatProblem &&
      HVACVentEvidence) ||
    (heatProblem &&
      coolingProblem) ||
    (coolingProblem &&
      HVACVentEvidence) ||
    (coolingProblem &&
      HVACControlEvidence)
  ) {
    return {
      category: "HVAC",
      strength: Math.max(
        scores.HVAC,
        30,
      ),
    };
  }

  /*
   * Strong direct HVAC equipment evidence.
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
        20,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 6: Strong electrical evidence
   * ---------------------------------------------------------
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
      "fuse box",
      "short circuit",
      "electric shock",
      "electrical shock",
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
        22,
      ),
    };
  }

  /*
   * Natural electrical evidence:
   *
   * lights stopped working
   * power went out
   * etc.
   */

  if (
    has(text, [
      "lights don't work",
      "lights do not work",
      "lights stopped working",
      "light stopped working",
      "no power",
      "power is out",
      "power went out",
      "electricity is out",
      "electricity went out",
    ])
  ) {
    return {
      category: "Electrical",
      strength: Math.max(
        scores.Electrical,
        20,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 7: Plumbing
   * ---------------------------------------------------------
   */

  if (
    has(text, [
      "plumbing",
      "plumber",
      "toilet",
      "sink",
      "faucet",
      "tap",
      "pipe",
      "pipes",
      "drain",
      "shower",
      "bathtub",
      "water leak",
      "water leakage",
      "leaking water",
      "water is leaking",
      "water is dripping",
      "sewage",
      "sewer",
    ])
  ) {
    return {
      category: "Plumbing",
      strength: Math.max(
        scores.Plumbing,
        20,
      ),
    };
  }

  /*
   * Natural plumbing evidence.
   */

  if (
    has(text, [
      "water on the floor",
      "floor is wet",
      "water under the sink",
      "toilet is clogged",
      "toilet won't flush",
      "toilet will not flush",
      "sink won't drain",
      "sink will not drain",
      "low water pressure",
      "no water pressure",
      "drain is clogged",
      "drain is blocked",
    ])
  ) {
    return {
      category: "Plumbing",
      strength: Math.max(
        scores.Plumbing,
        20,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 8: Structural
   * ---------------------------------------------------------
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
      "stairs",
      "stair",
    ])
  ) {
    return {
      category: "Structural",
      strength: Math.max(
        scores.Structural,
        15,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 9: Pest
   * ---------------------------------------------------------
   */

  if (
    has(text, [
      "cockroach",
      "cockroaches",
      "roach",
      "roaches",
      "rat",
      "rats",
      "mouse",
      "mice",
      "rodent",
      "rodents",
      "bed bug",
      "bed bugs",
      "bedbug",
      "bedbugs",
      "termite",
      "termites",
      "ants",
      "insects",
      "pest",
      "pests",
      "infestation",
    ])
  ) {
    return {
      category: "Pest",
      strength: Math.max(
        scores.Pest,
        18,
      ),
    };
  }

  /*
   * ---------------------------------------------------------
   * STEP 10: Score-based fallback
   *
   * Only use a scored category if evidence is meaningful.
   * Otherwise return Other.
   * ---------------------------------------------------------
   */

  let bestCategory:
    | Exclude<Category, "Other">
    | null = null;

  let bestScore = 0;

  for (
    const category of categories
  ) {
    if (
      scores[category] >
      bestScore
    ) {
      bestScore =
        scores[category];

      bestCategory =
        category;
    }
  }

  /*
   * Require at least two points of meaningful evidence.
   */

  if (
    bestCategory &&
    bestScore >= 2
  ) {
    return {
      category:
        bestCategory,
      strength:
        bestScore,
    };
  }

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
   * CRITICAL always wins.
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
   * Burning smell is High.
   *
   * But only when the smell is actually present.
   *
   * "There is no burning smell"
   * will NOT trigger this.
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
   * Other high-risk symptoms.
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
   * Electrical escalation.
   */

  if (
    category === "Electrical" &&
    has(text, [
      "sparks",
      "sparking",
      "spark",
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
   * Appliance overheating/burning.
   */

  if (
    category === "Appliance" &&
    has(text, [
      "smoke",
      "sparks",
      "sparking",
      "burning smell",
      "burning odor",
      "burning scent",
    ])
  ) {
    return "High";
  }

  /*
   * LOW only when no higher-risk symptom exists.
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

  /*
   * Critical
   */

  if (
    priority === "Critical"
  ) {
    return "Reported immediate emergency condition. The exact cause cannot be confirmed without an on-site inspection.";
  }

  /*
   * HVAC + burning smell
   */

  if (
    category === "HVAC" &&
    burningSmell
  ) {
    return "Reported HVAC issue with a burning smell coming from or around the system. Treat as a high-priority safety concern; the exact cause requires professional inspection.";
  }

  /*
   * HVAC cooling
   */

  if (
    category === "HVAC" &&
    has(text, [
      "not cooling",
      "doesn't cool",
      "does not cool",
      "can't cool",
      "cannot cool",
      "apartment is getting hot",
      "apartment is too hot",
      "room is getting hot",
      "room is too hot",
      "too hot inside",
      "warm air from the vents",
      "warm air coming from the vents",
      "vents feel warm",
    ])
  ) {
    return "Reported indoor temperature or cooling-system problem. The exact cause cannot be confirmed without an on-site HVAC inspection.";
  }

  /*
   * HVAC heating
   */

  if (
    category === "HVAC" &&
    has(text, [
      "not heating",
      "doesn't heat",
      "does not heat",
      "can't heat",
      "cannot heat",
      "room won't warm up",
      "room will not warm up",
      "house won't warm up",
      "house will not warm up",
      "freezing inside",
      "too cold inside",
    ])
  ) {
    return "Reported heating-system problem resulting in inadequate indoor heating. The exact cause requires professional HVAC inspection.";
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
      burningSmell
    ) {
      return "Reported possible electrical overheating or burning odor. The exact source cannot be confirmed without an on-site inspection.";
    }

    if (
      has(text, [
        "lights stopped working",
        "lights don't work",
        "lights do not work",
        "power went out",
        "power is out",
        "no power",
      ])
    ) {
      return "Reported electrical power or lighting failure requiring inspection by a qualified electrician.";
    }

    return "Possible electrical system issue requiring inspection by a qualified electrician.";
  }

  /*
   * Plumbing
   */

  if (
    category === "Plumbing"
  ) {
    if (
      has(text, [
        "flooding",
        "flooded",
        "major flooding",
      ])
    ) {
      return "Reported significant water intrusion or flooding requiring prompt plumbing inspection.";
    }

    if (
      has(text, [
        "toilet won't flush",
        "toilet will not flush",
        "toilet is clogged",
      ])
    ) {
      return "Reported toilet blockage or flushing problem requiring plumbing inspection.";
    }

    if (
      has(text, [
        "sink won't drain",
        "sink will not drain",
        "drain is clogged",
        "drain is blocked",
      ])
    ) {
      return "Reported drainage problem requiring plumbing inspection.";
    }

    return "Possible plumbing issue requiring inspection to determine the source and extent of the problem.";
  }

  /*
   * Appliance
   */

  if (
    category === "Appliance"
  ) {
    if (
      burningSmell ||
      has(text, [
        "smoke",
        "sparks",
        "sparking",
      ])
    ) {
      return "Reported appliance problem accompanied by a possible overheating or electrical safety symptom. Urgent professional inspection is recommended.";
    }

    return "Possible appliance malfunction requiring inspection by an appliance technician.";
  }

  /*
   * Structural
   */

  if (
    category === "Structural"
  ) {
    return "Possible building or structural maintenance issue requiring inspection.";
  }

  /*
   * Pest
   */

  if (
    category === "Pest"
  ) {
    return "Possible pest infestation requiring assessment and appropriate pest-control treatment.";
  }

  /*
   * Other
   */

  if (
    priority === "High"
  ) {
    return "Reported maintenance issue with elevated safety or property-damage risk. The exact source cannot be confirmed without an on-site inspection.";
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

  /*
   * HVAC high-risk
   */

  if (
    priority === "High" &&
    category === "HVAC" &&
    burningSmell
  ) {
    return "Stop using the HVAC unit if it is safe to do so, keep occupants away from the equipment, and dispatch an HVAC technician for urgent inspection. Escalate to emergency services if smoke, fire, or another immediate hazard develops.";
  }

  /*
   * Electrical high-risk
   */

  if (
    priority === "High" &&
    category === "Electrical"
  ) {
    return "Treat as an urgent electrical safety issue and dispatch a qualified electrician for prompt inspection. If there is active smoke, fire, or electric shock, escalate immediately.";
  }

  /*
   * Appliance high-risk
   */

  if (
    priority === "High" &&
    category === "Appliance"
  ) {
    return "Stop using the affected appliance if it is safe to do so and dispatch an appliance technician for urgent inspection. Escalate immediately if there is active smoke, fire, or electric shock.";
  }

  /*
   * Other high-risk
   */

  if (
    priority === "High" &&
    category === "Other"
  ) {
    return "Treat as an urgent maintenance concern and dispatch a general maintenance technician for prompt inspection. Escalate immediately if smoke, fire, gas, or another immediate hazard develops.";
  }

  /*
   * Generic high-priority
   */

  if (
    priority === "High"
  ) {
    return `Assign a ${technicianRoleFor(
      category,
    )} for urgent inspection and corrective action.`;
  }

  /*
   * Normal category actions
   */

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
      return "Potential safety hazard indicated by the burning smell from the HVAC system. The equipment should be inspected urgently.";
    }

    if (
      category === "Electrical"
    ) {
      return "Potential electrical safety hazard indicated by the burning smell. Avoid unsafe contact and arrange urgent inspection by a qualified electrician.";
    }

    if (
      category === "Appliance"
    ) {
      return "Potential appliance overheating or electrical safety hazard indicated by the burning smell. Avoid using the appliance until it has been inspected.";
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

    if (
      has(text, [
        "not cooling",
        "doesn't cool",
        "does not cool",
        "can't cool",
        "cannot cool",
        "apartment is getting hot",
        "apartment is too hot",
        "room is getting hot",
        "room is too hot",
        "too hot inside",
      ])
    ) {
      return [
        "Is the HVAC system still running?",
        "Is the air coming from the vents warm, cool, or room temperature?",
        "Does changing the thermostat temperature have any effect?",
      ];
    }

    return [
      "Is the system still running?",
      "Is the system producing any unusual noise or smell?",
      "Does changing the thermostat affect the system?",
    ];
  }

  if (
    category === "Electrical"
  ) {
    return [
      "Are there sparks or visible smoke?",
      "Is the affected equipment or outlet still powered?",
      "Has the breaker tripped?",
    ];
  }

  if (
    category === "Plumbing"
  ) {
    return [
      "Is the water leak or plumbing problem still active?",
      "How much water is leaking or accumulating?",
      "Can the water supply be safely shut off?",
    ];
  }

  if (
    category === "Appliance"
  ) {
    return [
      "Is the appliance still running?",
      "Is there any unusual noise, heat, smoke, or smell?",
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
   * Automatic classification.
   */

  const detected =
    detectCategory(text);

  /*
   * Explicit category selected by the user
   * has priority over automatic classification.
   */

  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";

  /*
   * Determine priority from the actual description.
   */

  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  /*
   * Safety escalation wins.
   *
   * Critical cannot become High/Medium/Low.
   * High cannot become Medium/Low.
   *
   * But if the detected priority is Medium/Low,
   * the user's selected priority is respected.
   */

  let priority: Priority;

  if (
    detectedPriority ===
    "Critical"
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
   * =======================================================
   * CONFIDENCE
   * =======================================================
   *
   * Confidence represents classification evidence,
   * not certainty about the physical diagnosis.
   */

  let confidence = 0.72;

  if (
    detected.category ===
    category
  ) {
    confidence += 0.10;
  }

  if (
    detected.strength >= 10
  ) {
    confidence += 0.06;
  }

  if (
    detected.strength >= 20
  ) {
    confidence += 0.05;
  }

  if (
    detected.strength >= 30
  ) {
    confidence += 0.04;
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
