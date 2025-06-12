const UNITS = [
    // volume
    "teaspoon", "teaspoons", "tsp", "tsps",
    "tablespoon", "tablespoons", "tbsp", "tbsps",
    "cup", "cups",
    "fluid ounce", "fluid ounces", "fl oz", "floz",
    "pint", "pints", "pt", "pts",
    "quart", "quarts", "qt", "qts",
    "gallon", "gallons", "gal", "gals",
  
    // weight
    "ounce", "ounces", "oz",
    "pound", "pounds", "lb", "lbs",
    "gram", "grams", "g",
    "kilogram", "kilograms", "kg", "kgs",
  
    // volume (metric)
    "milliliter", "milliliters", "ml", "mls",
    "liter", "liters", "l", "ls"
  ];
  
  const FOODS = [
    "flour", "sugar", "butter", "milk", "egg", "salt", "oil",
    "cheese", "water", "onion", "garlic", "chocolate", "cream", "chicken", "eggs"
  ];
  
  const COOKING_VERBS = [
    "bake", "stir", "cook", "grill", "heat", "fry", "simmer", "roast", "mix", "add", "cream", "whip", "place", "combine", "pour"
  ];

  
  type ScoredLine = {
    line: string;
    score: number;
    index: number;
  };

  const FRACTIONS = /[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/;


  function truncateByIndexGap(lines: ScoredLine[], maxGap = 2): ScoredLine[] {
    if (lines.length === 0) return [];
  
    const sorted = [...lines].sort((a, b) => a.index - b.index);
    const result: ScoredLine[] = [sorted[0]];
  
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
  
      const gap = curr.index - prev.index;
  
      if (gap > maxGap) {
        // large gap → assume ingredient section ended
        break;
      }
  
      result.push(curr);
    }
  
    return result;
  }

function startsWithNumber(line: string): boolean {
    const firstWord = line.trim().split(/\s+/)[0];
    return /^\d+([\/\d\s]*)?$/.test(firstWord) || FRACTIONS.test(firstWord);
  }
  
  function boostByBlockDensity(lines: ScoredLine[]): ScoredLine[] {
    const clustered: ScoredLine[] = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let neighbors = 0;
  
      // count neighbors within ±3 lines that also have non-zero score
      for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
        if (j === i) continue;
        if (lines[j].score >= 2) neighbors++;
      }
  
      // if surrounded by ingredients → boost
      if (neighbors >= 2) {
        clustered.push({ ...line, score: line.score + 0.5 });
      } else {
        clustered.push(line);
      }
    }
  
    return clustered;
  }


  export function extractIngredientLinesFromPage(): ScoredLine[] {
    const fullText = document.body.textContent || "";
    const lines = fullText
      .split(/\n+/)
      .map((line, index) => ({ line: line.trim(), index }))
      .filter(l => l.line.length >= 5 && l.line.length <= 200);
  
    const scored: ScoredLine[] = [];
  
    for (const { line, index } of lines) {
      const lower = line.toLowerCase();
      const cleaned = lower.replace(/[.,:;!?]+/g, "");
      let score = 0;
  
      if (/\d/.test(cleaned) || FRACTIONS.test(cleaned)) score += 1;
      if (UNITS.some(unit => new RegExp(`\\b${unit}\\b`).test(cleaned))) score += 1;
      if (FOODS.some(food => cleaned.includes(food))) score += 0.5;
      if (!COOKING_VERBS.some(verb => cleaned.includes(verb))) score += 0.5;
      if (startsWithNumber(cleaned)) score += 1; // boost if number is first
  
      scored.push({ line, score, index });
    }
  
    // Now apply block-based boost
    const clustered = boostByBlockDensity(scored);
    const filtered = clustered.filter(l => l.score >= 2);
    const final = truncateByIndexGap(filtered);
    return final;
  }