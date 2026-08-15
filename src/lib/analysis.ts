function detectCategory(text: string): {
  category: Category | null;
  strength: number;
} {
  let bestCategory: Category | null = null;
  let bestScore = 0;

  /*
   * Calculate category scores from keyword matches.
   */
  for (const category of Object.keys(KEYWORDS) as Exclude<
    Category,
    "Other"
  >[]) {
    const keywordScore = countMatches(
      text,
      KEYWORDS[category],
    );

    let combinationScore = 0;

    for (const combination of CATEGORY_COMBINATIONS[
      category
    ]) {
      if (
        combination.terms.every(
          (term) =>
            text.includes(term) &&
            !negated(text, term),
        )
      ) {
        combinationScore += combination.weight;
      }
    }

    const totalScore =
      keywordScore + combinationScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestCategory = category;
    }
  }

  /*
   * Appliance + burning smell must remain Appliance.
   */
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

  if (
    applianceEvidence &&
    applianceBurningSmell
  ) {
    return {
      category: "Appliance",
      strength: Math.max(bestScore, 20),
    };
  }

  /*
   * HVAC + burning smell remains HVAC
   * unless an explicit electrical component
   * is mentioned.
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

  const explicitElectricalEquipment = has(
    text,
    [
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
    ],
  );

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

  /*
   * If no known category matches,
   * classify as Other.
   */
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
