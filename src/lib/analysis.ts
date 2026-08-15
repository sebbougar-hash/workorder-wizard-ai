/* =========================================================
   maintenanceAnalysis.ts

   Bilingual maintenance analysis engine
   Languages:
   - English
   - Français

   Architecture:
   1. Normalize text
   2. Detect language
   3. Detect safety conditions
   4. Detect category using contextual scoring
   5. Detect priority
   6. Generate structured analysis
   7. Optional AI-ready merge layer

   IMPORTANT:
   This file does NOT call an AI API.
   It is designed so an AI layer can be added later.
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

export type Language =
  | "en"
  | "fr";

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


/* =========================================================
   ANALYSIS INTERFACE
   ========================================================= */

export interface Analysis {
  category: Category;
  priority: Priority;
  riskLevel: RiskLevel;

  language: Language;

  problemSummary: string;
  recommendedAction: string;
  technician: string;

  followUpQuestions: string[];

  safetyAssessment: string;

  confidence: number;
}


/* =========================================================
   INTERNAL SCORE TYPES
   ========================================================= */

type DetectResult = {
  category: Category | null;
  strength: number;
  scores: Record<Category, number>;
};

type SafetyResult = {
  priority: Priority;
  reasons: string[];
};


/* =========================================================
   CATEGORY KEYWORDS
   ========================================================= */

const KEYWORDS: Record<
  Exclude<Category, "Other">,
  string[]
> = {
  HVAC: [
    // English
    "air conditioner",
    "air conditioning",
    "ac unit",
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
    "not cooling",
    "not heating",
    "stopped cooling",
    "stopped heating",

    // Français
    "climatisation",
    "climatiseur",
    "climatiseur",
    "pompe à chaleur",
    "chauffage",
    "chaudière",
    "radiateur",
    "thermostat",
    "système de chauffage",
    "système de climatisation",
    "ventilation",
    "réfrigérant",
    "compresseur",
    "condenseur",
    "évaporateur",
    "conduit",
    "débit d'air",
    "ne refroidit plus",
    "ne chauffe plus",
    "ne refroidit pas",
    "ne chauffe pas",
  ],

  Plumbing: [
    // English
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
    "bath",
    "water pressure",
    "water leak",
    "water leakage",
    "leaking water",
    "sewage",
    "sewer",
    "blocked drain",
    "clogged drain",
    "dripping",

    // Français
    "plomberie",
    "plombier",
    "évier",
    "lavabo",
    "toilettes",
    "toilette",
    "robinet",
    "tuyau",
    "tuyaux",
    "canalisation",
    "canalisations",
    "évacuation",
    "vidange",
    "douche",
    "baignoire",
    "pression d'eau",
    "fuite d'eau",
    "fuite",
    "eau qui fuit",
    "eaux usées",
    "égout",
    "canalisation bouchée",
    "évier bouché",
    "tuyau qui fuit",
    "robinet qui fuit",
  ],

  Electrical: [
    // English
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
    "panel box",
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
    "sparking",
    "sparks",
    "spark",
    "exposed wiring",
    "exposed wire",
    "live wire",
    "live wiring",
    "power outage",
    "no power",
    "power keeps going out",

    // Français
    "électricité",
    "électrique",
    "électricien",
    "prise",
    "prises",
    "prise électrique",
    "disjoncteur",
    "disjoncteurs",
    "tableau électrique",
    "tableau électrique",
    "câblage",
    "câble",
    "câbles",
    "fil électrique",
    "fils électriques",
    "fusible",
    "boîte à fusibles",
    "court-circuit",
    "choc électrique",
    "électrocution",
    "étincelle",
    "étincelles",
    "étincelle électrique",
    "fil dénudé",
    "fils dénudés",
    "fil sous tension",
    "fils sous tension",
    "panne de courant",
    "plus de courant",
    "courant coupé",
    "courant se coupe",
  ],

  Appliance: [
    // English
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
    "coffee machine",
    "coffee maker",
    "water heater",
    "appliance",

    // Français
    "réfrigérateur",
    "frigo",
    "congélateur",
    "lave-vaisselle",
    "machine à laver",
    "lave-linge",
    "sèche-linge",
    "four",
    "cuisinière",
    "plaque de cuisson",
    "micro-ondes",
    "machine à café",
    "chauffe-eau",
    "appareil",
    "électroménager",
  ],

  Structural: [
    // English
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
    "cracked wall",
    "broken door",
    "broken window",
    "water damage",

    // Français
    "structure",
    "structural",
    "toit",
    "plafond",
    "mur",
    "sol",
    "porte",
    "fenêtre",
    "cadre",
    "serrure",
    "fissure",
    "mur fissuré",
    "porte cassée",
    "fenêtre cassée",
    "dégât des eaux",
    "dommage structurel",
  ],

  Pest: [
    // English
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

    // Français
    "cafard",
    "cafards",
    "blatte",
    "blattes",
    "rat",
    "rats",
    "souris",
    "rongeur",
    "rongeurs",
    "punaises de lit",
    "punaise de lit",
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
   CONTEXTUAL COMBINATIONS
   ========================================================= */

const CATEGORY_COMBINATIONS: Record<
  Exclude<Category, "Other">,
  {
    terms: string[];
    weight: number;
  }[]
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
      terms: ["climatiseur", "odeur de brûlé"],
      weight: 25,
    },
    {
      terms: ["climatisation", "odeur de brûlé"],
      weight: 25,
    },
    {
      terms: ["chauffage", "odeur de brûlé"],
      weight: 25,
    },
    {
      terms: ["thermostat", "cooling"],
      weight: 12,
    },
    {
      terms: ["thermostat", "heating"],
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
    {
      terms: ["furnace", "not heating"],
      weight: 15,
    },
    {
      terms: ["heater", "not heating"],
      weight: 15,
    },
    {
      terms: ["climatiseur", "ne refroidit plus"],
      weight: 20,
    },
    {
      terms: ["chauffage", "ne chauffe plus"],
      weight: 20,
    },
  ],

  Plumbing: [
    {
      terms: ["pipe", "water leak"],
      weight: 15,
    },
    {
      terms: ["sink", "water leak"],
      weight: 15,
    },
    {
      terms: ["toilet", "water leak"],
      weight: 15,
    },
    {
      terms: ["faucet", "water leak"],
      weight: 15,
    },
    {
      terms: ["toilet", "not flushing"],
      weight: 15,
    },
    {
      terms: ["sink", "not draining"],
      weight: 15,
    },
    {
      terms: ["shower", "low water pressure"],
      weight: 15,
    },
    {
      terms: ["évier", "fuite"],
      weight: 15,
    },
    {
      terms: ["toilette", "fuite"],
      weight: 15,
    },
    {
      terms: ["robinet", "fuite"],
      weight: 15,
    },
    {
      terms: ["tuyau", "fuite"],
      weight: 15,
    },
    {
      terms: ["évier", "bouché"],
      weight: 15,
    },
    {
      terms: ["canalisation", "bouchée"],
      weight: 15,
    },
  ],

  Electrical: [
    {
      terms: ["outlet", "sparks"],
      weight: 30,
    },
    {
      terms: ["outlet", "sparking"],
      weight: 30,
    },
    {
      terms: ["socket", "sparks"],
      weight: 30,
    },
    {
      terms: ["socket", "sparking"],
      weight: 30,
    },
    {
      terms: ["outlet", "burning smell"],
      weight: 35,
    },
    {
      terms: ["socket", "burning smell"],
      weight: 35,
    },
    {
      terms: ["outlet", "smells like burning"],
      weight: 35,
    },
    {
      terms: ["socket", "smells like burning"],
      weight: 35,
    },
    {
      terms: ["breaker", "keeps tripping"],
      weight: 25,
    },
    {
      terms: ["breaker", "trips"],
      weight: 20,
    },
    {
      terms: ["breaker", "no power"],
      weight: 20,
    },
    {
      terms: ["short circuit", "electrical"],
      weight: 30,
    },
    {
      terms: ["exposed wire", "electrical"],
      weight: 30,
    },
    {
      terms: ["live wire", "electrical"],
      weight: 30,
    },
    {
      terms: ["prise", "odeur de brûlé"],
      weight: 35,
    },
    {
      terms: ["prise", "étincelle"],
      weight: 35,
    },
    {
      terms: ["disjoncteur", "saute"],
      weight: 25,
    },
    {
      terms: ["disjoncteur", "coupe"],
      weight: 20,
    },
    {
      terms: ["fil dénudé", "électrique"],
      weight: 30,
    },
    {
      terms: ["court-circuit", "électricité"],
      weight: 30,
    },
  ],

  Appliance: [
    {
      terms: ["refrigerator", "not cooling"],
      weight: 25,
    },
    {
      terms: ["fridge", "not cooling"],
      weight: 25,
    },
    {
      terms: ["dishwasher", "not draining"],
      weight: 25,
    },
    {
      terms: ["washing machine", "not starting"],
      weight: 25,
    },
    {
      terms: ["washer", "not starting"],
      weight: 25,
    },
    {
      terms: ["dryer", "not heating"],
      weight: 25,
    },
    {
      terms: ["oven", "not heating"],
      weight: 25,
    },
    {
      terms: ["réfrigérateur", "ne refroidit plus"],
      weight: 25,
    },
    {
      terms: ["frigo", "ne refroidit plus"],
      weight: 25,
    },
    {
      terms: ["lave-vaisselle", "ne vidange plus"],
      weight: 25,
    },
    {
      terms: ["machine à laver", "ne démarre plus"],
      weight: 25,
    },
    {
      terms: ["four", "ne chauffe plus"],
      weight: 25,
    },
  ],

  Structural: [
    {
      terms: ["door", "lock"],
      weight: 20,
    },
    {
      terms: ["window", "frame"],
      weight: 20,
    },
    {
      terms: ["ceiling", "water"],
      weight: 20,
    },
    {
      terms: ["roof", "water"],
      weight: 20,
    },
    {
      terms: ["wall", "crack"],
      weight: 25,
    },
    {
      terms: ["floor", "damage"],
      weight: 20,
    },
    {
      terms: ["mur", "fissure"],
      weight: 25,
    },
    {
      terms: ["plafond", "eau"],
      weight: 20,
    },
    {
      terms: ["porte", "serrure"],
      weight: 20,
    },
    {
      terms: ["fenêtre", "cadre"],
      weight: 20,
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
      terms: ["termite", "wood"],
      weight: 25,
    },
    {
      terms: ["cafards", "cuisine"],
      weight: 20,
    },
    {
      terms: ["souris", "excréments"],
      weight: 25,
    },
    {
      terms: ["rats", "excréments"],
      weight: 25,
    },
    {
      terms: ["punaises de lit", "chambre"],
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

const TECHNICIAN_BY_CATEGORY_FR: Record<
  Category,
  string
> = {
  HVAC: "Technicien HVAC / climatisation",
  Plumbing: "Plombier qualifié",
  Electrical: "Électricien qualifié",
  Appliance: "Technicien électroménager",
  Structural:
    "Technicien de maintenance / entrepreneur qualifié",
  Pest: "Technicien de lutte antiparasitaire",
  Other: "Technicien de maintenance générale",
};

export function technicianRoleFor(
  category: Category,
  language: Language = "en",
) {
  return language === "fr"
    ? TECHNICIAN_BY_CATEGORY_FR[category]
    : TECHNICIAN_BY_CATEGORY[category];
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


/*
 * Keep original accents separately for some French
 * output/context checks if needed.
 */
function normalizeForSearch(
  text: string,
): string {
  return normalize(text);
}


/* =========================================================
   LANGUAGE DETECTION
   ========================================================= */

const FRENCH_MARKERS = [
  " le ",
  " la ",
  " les ",
  " un ",
  " une ",
  " des ",
  " du ",
  " de ",
  " dans ",
  " avec ",
  " pour ",
  " mon ",
  " ma ",
  " mes ",
  " est ",
  " sont ",
  " pas ",
  " plus ",
  " probleme ",
  " problème ",
  " fuite ",
  " prise ",
  " mur ",
  " plafond ",
  " chauffage ",
  " climatisation ",
  " plomberie ",
  " electricien ",
  " électricien ",
  " odeur ",
  " eau ",
  " courant ",
  " porte ",
  " fenetre ",
  " fenêtre ",
];

const ENGLISH_MARKERS = [
  " the ",
  " a ",
  " an ",
  " is ",
  " are ",
  " was ",
  " were ",
  " with ",
  " from ",
  " this ",
  " that ",
  " my ",
  " problem ",
  " issue ",
  " leak ",
  " outlet ",
  " wall ",
  " ceiling ",
  " heating ",
  " cooling ",
  " plumbing ",
  " electrician ",
  " smell ",
  " water ",
  " door ",
  " window ",
];

export function detectLanguage(
  input: string,
): Language {
  const text = ` ${input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()} `;

  let frenchScore = 0;
  let englishScore = 0;

  for (const marker of FRENCH_MARKERS) {
    if (text.includes(marker)) {
      frenchScore++;
    }
  }

  for (const marker of ENGLISH_MARKERS) {
    if (text.includes(marker)) {
      englishScore++;
    }
  }

  /*
   * French-specific characters.
   */
  if (
    /[àâçéèêëîïôùûüÿœæ]/i.test(input)
  ) {
    frenchScore += 2;
  }

  /*
   * If French clearly wins, use French.
   */
  if (frenchScore > englishScore) {
    return "fr";
  }

  return "en";
}


/* =========================================================
   NEGATION
   ========================================================= */

/*
 * Negation is contextual.

 Examples:

 EN:
 "no leak"
 "there is no leak"
 "not leaking"
 "doesn't leak"
 "without any leak"
 "I don't smell burning"

 FR:
 "pas de fuite"
 "aucune fuite"
 "sans fuite"
 "ne fuit pas"
 "ça ne fuit pas"
 "aucune odeur de brûlé"
 "je ne sens pas de brûlé"

 The function checks the text immediately before
 AND immediately after the term.
 */

const NEGATION_WORDS_EN = [
  "no",
  "not",
  "without",
  "never",
  "isn't",
  "isnt",
  "aren't",
  "arent",
  "doesn't",
  "doesnt",
  "don't",
  "dont",
  "didn't",
  "didnt",
  "nothing",
];

const NEGATION_WORDS_FR = [
  "pas",
  "aucun",
  "aucune",
  "sans",
  "jamais",
  "ne",
  "n",
  "ni",
];


function isNegatedOccurrence(
  text: string,
  term: string,
  occurrenceIndex: number,
): boolean {
  const before = text.slice(
    Math.max(
      0,
      occurrenceIndex - 80,
    ),
    occurrenceIndex,
  );

  const after = text.slice(
    occurrenceIndex + term.length,
    occurrenceIndex +
      term.length +
      40,
  );

  /*
   * English patterns.
   */

  const englishBefore =
    new RegExp(
      `(?:^|\\s)(?:${NEGATION_WORDS_EN.join(
        "|",
      )})\\s+(?:[\\w'-]+\\s+){0,3}$`,
      "i",
    ).test(before);

  if (englishBefore) {
    return true;
  }

  /*
   * "does not leak"
   * "is not leaking"
   */
  const englishVerbNegation =
    /\b(?:does|do|did|is|are|was|were|has|have|had)\s+not\s+(?:\w+\s+){0,3}$/i.test(
      before,
    );

  if (englishVerbNegation) {
    return true;
  }

  /*
   * "I don't smell burning"
   */
  if (
    /\b(?:don't|dont|do not|doesn't|doesnt|does not|didn't|didnt|did not)\s+(?:\w+\s+){0,4}$/i.test(
      before,
    )
  ) {
    return true;
  }

  /*
   * French:
   *
   * "pas de fuite"
   * "aucune fuite"
   * "sans fuite"
   */

  const frenchBefore =
    new RegExp(
      `(?:^|\\s)(?:${NEGATION_WORDS_FR.join(
        "|",
      )})\\s+(?:[\\w'-]+\\s+){0,3}$`,
      "i",
    ).test(before);

  if (frenchBefore) {
    return true;
  }

  /*
   * "ne fuit pas"
   * "ne coule pas"
   * "ne fonctionne pas"
   *
   * If "pas" appears very shortly after
   * the term, consider it negated.
   */
  if (
    /\b(?:pas|point)\b/i.test(
      after,
    )
  ) {
    return true;
  }

  /*
   * "aucune odeur de brûlé"
   * "aucun problème de fuite"
   */
  if (
    /\b(?:aucun|aucune|sans|pas de|pas d')\b/i.test(
      before,
    )
  ) {
    return true;
  }

  return false;
}


function has(
  text: string,
  terms: string[],
): boolean {
  for (const term of terms) {
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
        !isNegatedOccurrence(
          text,
          term,
          index,
        )
      ) {
        return true;
      }

      start =
        index + term.length;
    }
  }

  return false;
}


function countMatches(
  text: string,
  terms: string[],
): number {
  let count = 0;

  for (const term of terms) {
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
        !isNegatedOccurrence(
          text,
          term,
          index,
        )
      ) {
        count++;
      }

      start =
        index + term.length;
    }
  }

  return count;
}


/* =========================================================
   SAFETY TERMS
   ========================================================= */

const CRITICAL_TERMS = [
  // English
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

  // Français
  "feu",
  "incendie",
  "en feu",
  "flammes",
  "fuite de gaz",
  "odeur de gaz",
  "gaz",
  "explosion",
  "risque d'explosion",
  "choc électrique",
  "électrocution",
  "électrocuté",
  "quelqu'un a reçu une décharge",
  "monoxyde de carbone",
  "alarme de monoxyde de carbone",
];

const HIGH_TERMS = [
  // English
  "burning smell",
  "smell of burning",
  "burning odor",
  "burning scent",
  "smells like burning",
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
  "keeps tripping",

  // Français
  "odeur de brûlé",
  "odeur de brule",
  "odeur de brûlure",
  "ça sent le brûlé",
  "sent le brûlé",
  "fumée",
  "étincelles",
  "étincelle",
  "fil dénudé",
  "fils dénudés",
  "fil sous tension",
  "fils sous tension",
  "inondation",
  "inondé",
  "inondée",
  "refoulement d'égout",
  "égout refoule",
  "disjoncteur saute",
  "disjoncteur qui saute",
  "disjoncteur se déclenche",
];

const LOW_TERMS = [
  // English
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

  // Français
  "cosmétique",
  "peinture",
  "rayure",
  "égratignure",
  "tache",
  "tâche",
  "petite tache",
  "poignée desserrée",
  "mineur",
  "mineure",
  "esthétique",
];


/* =========================================================
   SAFETY DETECTION
   ========================================================= */

function detectSafety(
  text: string,
): SafetyResult {
  const reasons: string[] = [];

  /*
   * CRITICAL
   */

  if (
    has(text, CRITICAL_TERMS)
  ) {
    reasons.push(
      "Immediate emergency/safety condition detected.",
    );

    return {
      priority: "Critical",
      reasons,
    };
  }

  /*
   * HIGH
   */

  if (
    has(text, HIGH_TERMS)
  ) {
    reasons.push(
      "Elevated safety or property-damage risk detected.",
    );

    return {
      priority: "High",
      reasons,
    };
  }

  /*
   * LOW
   */

  if (
    has(text, LOW_TERMS)
  ) {
    return {
      priority: "Low",
      reasons,
    };
  }

  return {
    priority: "Medium",
    reasons,
  };
}


/* =========================================================
   CATEGORY DETECTION
   ========================================================= */

function detectCategory(
  text: string,
): DetectResult {
  const scores: Record<
    Category,
    number
  > = {
    HVAC: 0,
    Plumbing: 0,
    Electrical: 0,
    Appliance: 0,
    Structural: 0,
    Pest: 0,
    Other: 0,
  };


  /* -------------------------------------------------------
     1. Keyword scoring
     ------------------------------------------------------- */

  for (
    const category of Object.keys(
      KEYWORDS,
    ) as Exclude<Category, "Other">[]
  ) {
    scores[category] +=
      countMatches(
        text,
        KEYWORDS[category],
      );
  }


  /* -------------------------------------------------------
     2. Contextual combination scoring
     ------------------------------------------------------- */

  for (
    const category of Object.keys(
      CATEGORY_COMBINATIONS,
    ) as Exclude<Category, "Other">[]
  ) {
    for (
      const combination of
        CATEGORY_COMBINATIONS[
          category
        ]
    ) {
      const matched =
        combination.terms.every(
          (term) =>
            has(text, [term]),
        );

      if (matched) {
        scores[category] +=
          combination.weight;
      }
    }
  }


  /* -------------------------------------------------------
     3. Safety context
     ------------------------------------------------------- */

  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brûlé",
      "odeur de brule",
      "odeur de brûlure",
      "sent le brûlé",
      "ça sent le brûlé",
    ]);


  /* -------------------------------------------------------
     4. Appliance context
     ------------------------------------------------------- */

  const applianceEvidence =
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
      "coffee machine",
      "coffee maker",
      "water heater",

      "réfrigérateur",
      "frigo",
      "congélateur",
      "lave-vaisselle",
      "machine à laver",
      "lave-linge",
      "sèche-linge",
      "four",
      "cuisinière",
      "micro-ondes",
      "machine à café",
      "chauffe-eau",
    ]);


  /*
   * If a real appliance is explicitly mentioned,
   * Appliance should normally win.
   *
   * Example:
   *
   * "The washing machine smells like burning."
   *
   * => Appliance / High
   *
   * NOT HVAC.
   */

  if (
    applianceEvidence
  ) {
    scores.Appliance += 40;

    /*
     * Burning smell strengthens appliance
     * when an appliance is explicitly named.
     */
    if (burningSmell) {
      scores.Appliance += 20;
    }
  }


  /* -------------------------------------------------------
     5. HVAC context
     ------------------------------------------------------- */

  const hvacEvidence =
    has(text, [
      "air conditioner",
      "air conditioning",
      "ac unit",
      "hvac",
      "furnace",
      "heater",
      "heating",
      "thermostat",
      "cooling system",
      "heat pump",

      "climatiseur",
      "climatisation",
      "chauffage",
      "chaudière",
      "radiateur",
      "thermostat",
      "pompe à chaleur",
    ]);

  if (
    hvacEvidence
  ) {
    scores.HVAC += 25;

    if (burningSmell) {
      scores.HVAC += 20;
    }
  }


  /* -------------------------------------------------------
     6. Electrical context
     ------------------------------------------------------- */

  const electricalEquipment =
    has(text, [
      "outlet",
      "outlets",
      "socket",
      "sockets",
      "breaker",
      "breakers",
      "circuit breaker",
      "electrical panel",
      "panel box",
      "wiring",
      "wire",
      "wires",
      "fuse",
      "fuse box",
      "short circuit",
      "sparking",
      "sparks",
      "spark",
      "exposed wire",
      "exposed wiring",
      "live wire",
      "live wiring",

      "prise",
      "prises",
      "prise électrique",
      "disjoncteur",
      "tableau électrique",
      "câblage",
      "fil électrique",
      "fils électriques",
      "fusible",
      "court-circuit",
      "étincelle",
      "étincelles",
      "fil dénudé",
      "fils dénudés",
      "fil sous tension",
      "fils sous tension",
    ]);

  if (
    electricalEquipment
  ) {
    scores.Electrical += 35;

    if (burningSmell) {
      scores.Electrical += 30;
    }
  }


  /* -------------------------------------------------------
     7. IMPORTANT CONTEXT RULE
     -------------------------------------------------------

     "The outlet smells like burning."

     Outlet + burning smell
     => Electrical

     "The washing machine smells like burning."

     Washing machine + burning smell
     => Appliance

     "The air conditioner smells like burning."

     Air conditioner + burning smell
     => HVAC
  */

  if (
    burningSmell &&
    electricalEquipment
  ) {
    scores.Electrical += 35;
  }

  if (
    burningSmell &&
    applianceEvidence
  ) {
    scores.Appliance += 30;
  }

  if (
    burningSmell &&
    hvacEvidence &&
    !electricalEquipment &&
    !applianceEvidence
  ) {
    scores.HVAC += 30;
  }


  /* -------------------------------------------------------
     8. Find winner
     ------------------------------------------------------- */

  const categories =
    Object.keys(scores) as Category[];

  let bestCategory:
    Category | null = null;

  let bestScore = 0;

  for (
    const category of categories
  ) {
    if (
      category === "Other"
    ) {
      continue;
    }

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


  /* -------------------------------------------------------
     9. Close-score contextual protection
     -------------------------------------------------------

     If two categories are close,
     use the most explicit equipment.
     ------------------------------------------------------- */

  if (
    bestCategory !== null
  ) {
    const sorted =
      categories
        .filter(
          (c) =>
            c !== "Other",
        )
        .sort(
          (a, b) =>
            scores[b] -
            scores[a],
        );

    const first =
      sorted[0];

    const second =
      sorted[1];

    if (
      first &&
      second &&
      scores[first] -
        scores[second] <=
        10
    ) {
      /*
       * Explicit appliance wins.
       */
      if (
        applianceEvidence
      ) {
        bestCategory =
          "Appliance";
      }

      /*
       * Explicit electrical component
       * wins over generic HVAC language.
       */
      else if (
        electricalEquipment
      ) {
        bestCategory =
          "Electrical";
      }

      /*
       * HVAC equipment wins when there
       * is no competing explicit equipment.
       */
      else if (
        hvacEvidence
      ) {
        bestCategory =
          "HVAC";
      }
    }
  }


  if (
    bestCategory === null ||
    bestScore < 1
  ) {
    return {
      category: null,
      strength: 0,
      scores,
    };
  }

  return {
    category: bestCategory,
    strength: bestScore,
    scores,
  };
}


/* =========================================================
   PRIORITY DETECTION
   ========================================================= */

function detectPriority(
  text: string,
  category: Category,
): Priority {
  const safety =
    detectSafety(text);

  /*
   * Critical always wins.
   */
  if (
    safety.priority ===
    "Critical"
  ) {
    return "Critical";
  }

  /*
   * High safety conditions always win.
   */
  if (
    safety.priority ===
    "High"
  ) {
    return "High";
  }


  /*
   * Electrical-specific dangerous
   * conditions.
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
      "short circuit",
      "breaker keeps tripping",

      "étincelle",
      "étincelles",
      "fil dénudé",
      "fils dénudés",
      "fil sous tension",
      "court-circuit",
      "disjoncteur saute",
    ])
  ) {
    return "High";
  }


  /*
   * Plumbing dangerous conditions.
   */
  if (
    category === "Plumbing" &&
    has(text, [
      "major flooding",
      "flooding",
      "flooded",
      "sewage backup",

      "inondation",
      "inondé",
      "inondée",
      "refoulement d'égout",
    ])
  ) {
    return "High";
  }


  /*
   * Otherwise Medium.
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
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brûlé",
      "odeur de brule",
      "odeur de brûlure",
      "sent le brûlé",
      "ça sent le brûlé",
    ]);


  /* -------------------------------------------------------
     FRENCH
     ------------------------------------------------------- */

  if (
    language === "fr"
  ) {
    if (
      category === "Electrical" &&
      burningSmell
    ) {
      return "Une odeur de brûlé provenant d'un élément électrique a été signalée. Cela peut indiquer une surchauffe ou un problème électrique et nécessite une inspection professionnelle urgente.";
    }

    if (
      category === "Appliance" &&
      burningSmell
    ) {
      return "Une odeur de brûlé provenant d'un appareil électroménager a été signalée. Une inspection urgente de l'appareil est recommandée.";
    }

    if (
      category === "HVAC" &&
      burningSmell
    ) {
      return "Un problème de chauffage ou de climatisation accompagné d'une odeur de brûlé a été signalé. Une inspection urgente du système HVAC est recommandée.";
    }

    if (
      category === "HVAC"
    ) {
      return "Un problème potentiel du système de chauffage ou de climatisation a été signalé. Une inspection est nécessaire pour confirmer la cause.";
    }

    if (
      category === "Plumbing"
    ) {
      return "Un problème potentiel de plomberie a été signalé. Une inspection est nécessaire pour déterminer la source et l'étendue du problème.";
    }

    if (
      category === "Electrical"
    ) {
      return "Un problème potentiel du système électrique a été signalé. Une inspection par un électricien qualifié est nécessaire.";
    }

    if (
      category === "Appliance"
    ) {
      return "Un dysfonctionnement potentiel d'un appareil électroménager a été signalé. Une inspection est recommandée.";
    }

    if (
      category === "Structural"
    ) {
      return "Un problème potentiel concernant le bâtiment ou un élément structurel a été signalé. Une inspection est nécessaire.";
    }

    if (
      category === "Pest"
    ) {
      return "Une infestation potentielle de nuisibles a été signalée. Une évaluation par un professionnel est recommandée.";
    }

    if (
      priority === "Critical"
    ) {
      return "Une situation d'urgence potentielle a été signalée. La cause exacte doit être confirmée sur place.";
    }

    return "Un problème de maintenance a été signalé. La cause exacte ne peut pas être confirmée sans inspection sur place.";
  }


  /* -------------------------------------------------------
     ENGLISH
     ------------------------------------------------------- */

  if (
    category === "Electrical" &&
    burningSmell
  ) {
    return "A burning smell from an electrical component has been reported. This may indicate overheating or an electrical fault and requires urgent professional inspection.";
  }

  if (
    category === "Appliance" &&
    burningSmell
  ) {
    return "A burning smell from an appliance has been reported. Urgent inspection of the appliance is recommended.";
  }

  if (
    category === "HVAC" &&
    burningSmell
  ) {
    return "An HVAC heating or cooling issue accompanied by a burning smell has been reported. Urgent inspection of the HVAC system is recommended.";
  }

  if (
    category === "HVAC"
  ) {
    return "A possible heating or cooling system issue has been reported. Inspection is required to confirm the cause.";
  }

  if (
    category === "Plumbing"
  ) {
    return "A possible plumbing issue has been reported. Inspection is required to determine the source and extent of the problem.";
  }

  if (
    category === "Electrical"
  ) {
    return "A possible electrical system issue has been reported. Inspection by a qualified electrician is required.";
  }

  if (
    category === "Appliance"
  ) {
    return "A possible appliance malfunction has been reported. Inspection is recommended.";
  }

  if (
    category === "Structural"
  ) {
    return "A possible building or structural maintenance issue has been reported. Inspection is required.";
  }

  if (
    category === "Pest"
  ) {
    return "A possible pest infestation has been reported. Professional assessment is recommended.";
  }

  if (
    priority === "Critical"
  ) {
    return "A potential emergency condition has been reported. The exact cause must be confirmed on site.";
  }

  return "A maintenance issue has been reported. The exact cause cannot be confirmed without an on-site inspection.";
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
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brûlé",
      "odeur de brule",
      "sent le brûlé",
      "ça sent le brûlé",
    ]);


  /* -------------------------------------------------------
     FRENCH
     ------------------------------------------------------- */

  if (
    language === "fr"
  ) {
    if (
      priority === "Critical"
    ) {
      return "Escalader immédiatement la demande et contacter les services d'urgence lorsque la situation le nécessite.";
    }

    if (
      priority === "High" &&
      category === "Electrical"
    ) {
      return "Traiter la situation comme un problème électrique urgent et faire intervenir rapidement un électricien qualifié. En cas de fumée, d'incendie ou de choc électrique, procéder immédiatement à une escalade d'urgence.";
    }

    if (
      priority === "High" &&
      category === "HVAC" &&
      burningSmell
    ) {
      return "Éviter d'utiliser le système HVAC si cela peut être fait sans danger, éloigner les occupants de l'équipement et faire intervenir rapidement un technicien HVAC. En cas de fumée ou d'incendie, contacter immédiatement les services d'urgence.";
    }

    if (
      priority === "High" &&
      category === "Appliance"
    ) {
      return "Éviter d'utiliser l'appareil si cela peut présenter un danger et faire intervenir rapidement un technicien électroménager pour une inspection.";
    }

    if (
      priority === "High"
    ) {
      return `Faire intervenir rapidement un ${technicianRoleFor(
        category,
        "fr",
      )} pour inspection et intervention corrective.`;
    }

    return `Faire intervenir un ${technicianRoleFor(
      category,
      "fr",
    )} pour inspecter le problème signalé.`;
  }


  /* -------------------------------------------------------
     ENGLISH
     ------------------------------------------------------- */

  if (
    priority === "Critical"
  ) {
    return "Escalate immediately and contact appropriate emergency services when necessary.";
  }

  if (
    priority === "High" &&
    category === "Electrical"
  ) {
    return "Treat this as an urgent electrical safety issue and dispatch a qualified electrician for prompt inspection. If there is active smoke, fire, or electric shock, escalate immediately.";
  }

  if (
    priority === "High" &&
    category === "HVAC" &&
    burningSmell
  ) {
    return "Avoid using the HVAC system if it is safe to do so, keep occupants away from the equipment, and dispatch an HVAC technician for urgent inspection. If smoke or fire develops, contact emergency services immediately.";
  }

  if (
    priority === "High" &&
    category === "Appliance"
  ) {
    return "Avoid using the appliance if doing so could be unsafe and dispatch an appliance technician for urgent inspection.";
  }

  if (
    priority === "High"
  ) {
    return `Assign a ${technicianRoleFor(
      category,
      "en",
    )} for urgent inspection and corrective action.`;
  }

  return `Assign a ${technicianRoleFor(
    category,
    "en",
  )} to inspect the reported issue.`;
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
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brûlé",
      "odeur de brule",
      "odeur de brûlure",
      "sent le brûlé",
      "ça sent le brûlé",
    ]);


  if (
    language === "fr"
  ) {
    if (
      priority === "Critical"
    ) {
      return "Un danger immédiat pour la sécurité est indiqué. Escaladez sans délai et appliquez les procédures d'urgence appropriées.";
    }

    if (
      priority === "High" &&
      category === "Electrical" &&
      burningSmell
    ) {
      return "Une odeur de brûlé provenant d'un élément électrique peut indiquer un risque de surchauffe ou d'incendie. Une inspection électrique urgente est recommandée.";
    }

    if (
      priority === "High" &&
      burningSmell
    ) {
      return "Une odeur de brûlé indique un risque potentiel pour la sécurité. Une inspection professionnelle urgente est recommandée.";
    }

    if (
      priority === "High"
    ) {
      return "Un risque élevé pour la sécurité ou les biens est indiqué. Une intervention professionnelle rapide est recommandée.";
    }

    if (
      priority === "Low"
    ) {
      return "Aucun danger immédiat pour la sécurité n'est indiqué par les informations fournies.";
    }

    return "Aucun danger immédiat pour la sécurité n'est indiqué par les informations fournies.";
  }


  /* -------------------------------------------------------
     ENGLISH
     ------------------------------------------------------- */

  if (
    priority === "Critical"
  ) {
    return "An immediate safety hazard is indicated. Escalate without delay and follow appropriate emergency procedures.";
  }

  if (
    priority === "High" &&
    category === "Electrical" &&
    burningSmell
  ) {
    return "A burning smell from an electrical component may indicate overheating or fire risk. Urgent electrical inspection is recommended.";
  }

  if (
    priority === "High" &&
    burningSmell
  ) {
    return "A burning smell indicates a potential safety hazard. Urgent professional inspection is recommended.";
  }

  if (
    priority === "High"
  ) {
    return "Elevated safety or property-damage risk is indicated. Prompt professional intervention is recommended.";
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
  language: Language,
): string[] {
  const burningSmell =
    has(text, [
      "burning smell",
      "smell of burning",
      "burning odor",
      "burning scent",
      "smells like burning",
      "odeur de brûlé",
      "odeur de brule",
      "odeur de brûlure",
      "sent le brûlé",
      "ça sent le brûlé",
    ]);


  /* -------------------------------------------------------
     FRENCH
     ------------------------------------------------------- */

  if (
    language === "fr"
  ) {
    if (
      category === "HVAC"
    ) {
      if (burningSmell) {
        return [
          "Le système HVAC a-t-il été éteint ?",
          "Y a-t-il de la fumée ou des flammes visibles ?",
          "L'odeur de brûlé devient-elle plus forte ?",
        ];
      }

      return [
        "Le système fonctionne-t-il toujours ?",
        "Y a-t-il une fuite d'eau ?",
        "Le système produit-il un bruit ou une odeur inhabituelle ?",
      ];
    }

    if (
      category === "Electrical"
    ) {
      return [
        "Y a-t-il des étincelles ou de la fumée visible ?",
        "L'équipement concerné est-il toujours sous tension ?",
        "Le disjoncteur a-t-il sauté ?",
      ];
    }

    if (
      category === "Plumbing"
    ) {
      return [
        "La fuite d'eau est-elle toujours active ?",
        "Quelle est l'importance de la fuite ?",
        "L'arrivée d'eau peut-elle être coupée sans danger ?",
      ];
    }

    if (
      category === "Appliance"
    ) {
      return [
        "L'appareil fonctionne-t-il toujours ?",
        "Y a-t-il un bruit ou une odeur inhabituelle ?",
        "L'appareil est-il alimenté en électricité ?",
      ];
    }

    if (
      category === "Structural"
    ) {
      return [
        "La zone concernée est-elle toujours utilisable ?",
        "Y a-t-il des dommages, des mouvements ou des fissures visibles ?",
        "Y a-t-il une infiltration d'eau ?",
      ];
    }

    if (
      category === "Pest"
    ) {
      return [
        "Où les nuisibles ont-ils été observés ?",
        "Combien de nuisibles ont été vus ?",
        "Y a-t-il des signes d'une infestation active ?",
      ];
    }

    return [
      "Le problème se produit-il toujours ?",
      "Quand le problème a-t-il commencé ?",
      "Une tentative de réparation a-t-elle déjà été effectuée ?",
    ];
  }


  /* -------------------------------------------------------
     ENGLISH
     ------------------------------------------------------- */

  if (
    category === "HVAC"
  ) {
    if (burningSmell) {
      return [
        "Has the HVAC system been turned off?",
        "Is there any visible smoke or fire?",
        "Is the burning smell getting stronger?",
      ];
    }

    return [
      "Is the system still running?",
      "Is there any water leaking?",
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
    language?: Language;
  },
): Analysis {
  const description =
    input.description || "";

  const text =
    normalizeForSearch(
      description,
    );

  /*
   * Detect language automatically.
   *
   * If the UI explicitly passes language,
   * use it.
   */
  const language =
    input.language ||
    detectLanguage(
      description,
    );


  /* -------------------------------------------------------
     CATEGORY
     ------------------------------------------------------- */

  const detected =
    detectCategory(text);

  /*
   * Explicit manual category wins.
   *
   * Otherwise automatic category.
   */
  const category: Category =
    input.selectedCategory ||
    detected.category ||
    "Other";


  /* -------------------------------------------------------
     PRIORITY
     ------------------------------------------------------- */

  const detectedPriority =
    detectPriority(
      text,
      category,
    );

  let priority: Priority;

  /*
   * CRITICAL and HIGH can NEVER be
   * downgraded by user selection.
   */
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


  /* -------------------------------------------------------
     BUILD ANALYSIS
     ------------------------------------------------------- */

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
      language,
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


  /* -------------------------------------------------------
     CONFIDENCE
     ------------------------------------------------------- */

  let confidence = 0.75;

  if (
    detected.category ===
    category
  ) {
    confidence += 0.10;
  }

  if (
    detected.strength >= 10
  ) {
    confidence += 0.05;
  }

  if (
    detected.strength >= 25
  ) {
    confidence += 0.05;
  }

  if (
    category === "Other"
  ) {
    confidence =
      Math.min(
        confidence,
        0.82,
      );
  }

  if (
    priority === "High"
  ) {
    confidence =
      Math.max(
        confidence,
        0.91,
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
  }

  confidence =
    Math.min(
      0.99,
      Number(
        confidence.toFixed(2),
      ),
    );


  return {
    category,
    priority,
    riskLevel,

    language,

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

  const language =
    analysis.language;


  /* -------------------------------------------------------
     FRENCH
     ------------------------------------------------------- */

  if (
    language === "fr"
  ) {
    if (
      analysis.priority ===
      "Critical"
    ) {
      return `Bonjour ${tenant}, merci d'avoir signalé ce problème. Nous le traitons comme une situation urgente pour la sécurité et procédons immédiatement à son escalade. Veuillez éviter la zone ou l'équipement concerné si son accès présente un danger et contactez les services d'urgence en cas de danger immédiat.`;
    }

    if (
      analysis.priority ===
      "High"
    ) {
      return `Bonjour ${tenant}, merci d'avoir signalé ce problème. Nous l'avons identifié comme une demande de maintenance prioritaire et allons organiser rapidement une inspection par un ${analysis.technician}. Veuillez éviter d'utiliser l'équipement concerné si cela peut présenter un danger.`;
    }

    if (
      analysis.priority ===
      "Medium"
    ) {
      return `Bonjour ${tenant}, merci d'avoir signalé ce problème. Votre demande de maintenance a bien été enregistrée. Nous allons organiser une inspection par un ${analysis.technician} et vous informerons lorsque l'intervention sera planifiée.`;
    }

    return `Bonjour ${tenant}, merci d'avoir signalé ce problème. Votre demande de maintenance a bien été enregistrée. Nous allons organiser une vérification par un ${analysis.technician}.`;
  }


  /* -------------------------------------------------------
     ENGLISH
     ------------------------------------------------------- */

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
   AI-READY ARCHITECTURE
   ========================================================= */

/*
 * This interface describes what an external AI model
 * should return.

 * Example future AI response:

 {
   category: "Electrical",
   priority: "High",
   confidence: 0.97
 }

 * The deterministic engine remains the safety layer.
 */

export interface AIAnalysisSuggestion {
  category?: Category;
  priority?: Priority;

  problemSummary?: string;
  recommendedAction?: string;
  technician?: string;

  followUpQuestions?: string[];

  safetyAssessment?: string;

  confidence?: number;
}


/* =========================================================
   AI RESULT MERGING
   ========================================================= */

/*
 * IMPORTANT SAFETY PRINCIPLE:
 *
 * AI is allowed to improve classification,
 * but it is NOT allowed to downgrade a
 * deterministic safety condition.
 *
 * Example:
 *
 * Rule engine:
 * Electrical / High
 *
 * AI:
 * Appliance / Medium
 *
 * Final:
 * Electrical / High
 *
 * This prevents an AI hallucination from
 * hiding a dangerous condition.
 */

export function mergeAIAnalysis(
  base: Analysis,
  ai: AIAnalysisSuggestion,
): Analysis {
  let finalCategory =
    ai.category ||
    base.category;

  let finalPriority =
    ai.priority ||
    base.priority;


  /* -------------------------------------------------------
     Safety lock
     ------------------------------------------------------- */

  const priorityRank: Record<
    Priority,
    number
  > = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };


  /*
   * Deterministic engine always wins
   * when it has detected a higher risk.
   */
  if (
    priorityRank[
      base.priority
    ] >
    priorityRank[
      finalPriority
    ]
  ) {
    finalPriority =
      base.priority;
  }


  /*
   * If deterministic engine detected
   * an explicit dangerous category,
   * don't blindly replace it with AI.
   *
   * AI can only replace Other automatically.
   */
  if (
    base.category !==
      "Other" &&
    ai.category &&
    base.confidence >= 0.90
  ) {
    finalCategory =
      base.category;
  }


  const finalConfidence =
    typeof ai.confidence ===
    "number"
      ? Math.max(
          base.confidence,
          Math.min(
            0.99,
            ai.confidence,
          ),
        )
      : base.confidence;


  return {
    ...base,

    category:
      finalCategory,

    priority:
      finalPriority,

    riskLevel:
      finalPriority,

    problemSummary:
      ai.problemSummary ||
      base.problemSummary,

    recommendedAction:
      ai.recommendedAction ||
      base.recommendedAction,

    technician:
      ai.technician ||
      base.technician,

    followUpQuestions:
      ai.followUpQuestions &&
      ai.followUpQuestions.length
        ? ai.followUpQuestions
        : base.followUpQuestions,

    safetyAssessment:
      ai.safetyAssessment ||
      base.safetyAssessment,

    confidence:
      Number(
        finalConfidence.toFixed(2),
      ),
  };
}


/* =========================================================
   AI PROMPT BUILDER
   ========================================================= */

/*
 * This function does NOT call OpenAI.
 *
 * It simply prepares a structured prompt
 * that can later be sent to an AI API.
 */

export function buildAIAnalysisPrompt(
  description: string,
  language?: Language,
): string {
  const detectedLanguage =
    language ||
    detectLanguage(
      description,
    );

  return `
You are a professional property maintenance triage assistant.

Analyze the tenant's maintenance request.

Supported categories:
- HVAC
- Plumbing
- Electrical
- Appliance
- Structural
- Pest
- Other

Supported priorities:
- Low
- Medium
- High
- Critical

Language:
${detectedLanguage === "fr" ? "French" : "English"}

IMPORTANT SAFETY RULES:

1. Fire, flames, gas leak, explosion,
   electrocution, or carbon monoxide emergency
   should be Critical.

2. Burning smell, smoke, sparks,
   exposed live wiring, major flooding,
   sewage backup, or repeated breaker trips
   should normally be High.

3. Never downgrade a clear safety hazard.

4. Identify the actual equipment involved.

Examples:

"The outlet smells like burning."
=> Electrical / High

"The washing machine smells like burning."
=> Appliance / High

"The air conditioner smells like burning."
=> HVAC / High

"The AC is not cooling."
=> HVAC / Medium

"The sink is leaking."
=> Plumbing / Medium

"The wall has a large crack."
=> Structural / Medium

"There are cockroaches in the kitchen."
=> Pest / Medium

Return JSON only:

{
  "category": "HVAC | Plumbing | Electrical | Appliance | Structural | Pest | Other",
  "priority": "Low | Medium | High | Critical",
  "confidence": 0.00,
  "problemSummary": "...",
  "recommendedAction": "...",
  "technician": "...",
  "followUpQuestions": ["...", "...", "..."],
  "safetyAssessment": "..."
}

Tenant request:

${description}
`.trim();
}


/* =========================================================
   END OF FILE
   ========================================================= */
