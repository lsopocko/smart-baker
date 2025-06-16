export type VolumeUnitImperial =
    | 'cup'
    | 'cups'
    | 'tbsp'
    | 'tsp'
    | 'fl oz'
    | 'teaspoon'
    | 'teaspoons'
    | 'tablespoon'
    | 'tablespoons'
    | 'pound'
    | 'pounds'
    | 'lb'
    | 'lbs';

export type WeightUnitMetric = 'g' | 'kg';
export type VolumeUnitMetric = 'ml' | 'l';
export type WeightUnitImperial = 'oz' | 'lb';
export type WeightUnit = WeightUnitMetric | WeightUnitImperial;
export type VolumeUnit = VolumeUnitImperial | VolumeUnitMetric;
export type Unit = VolumeUnit | WeightUnit;

export type ConversionResult = {
    unit: 'ml' | 'g';
    value: number;
    ingredient?: string;
};

const VOLUME_CONVERSIONS_TO_ML: Record<VolumeUnitImperial, number> = {
    cup: 240,
    cups: 240,
    teaspoons: 4.93,
    teaspoon: 4.93,
    tablespoons: 14.8,
    tablespoon: 14.8,
    tbsp: 14.8,
    tsp: 4.93,
    pound: 453.6,
    pounds: 453.6,
    lb: 453.6,
    lbs: 453.6,
    'fl oz': 29.57
};

const WEIGHT_CONVERSIONS_TO_G: Record<WeightUnitImperial, number> = {
    oz: 28.35,
    lb: 453.6
};

// Optional: ingredient-specific density overrides (grams per cup)
const INGREDIENT_DENSITIES: Record<string, number> = {
    flour: 125, // g per cup
    sugar: 200,
    butter: 227,
    milk: 240,
    water: 240
};

export function normalizeIngredient(phrase: string): string | undefined {
    const lowered = phrase.toLowerCase().trim();

    // Try matching a known ingredient at the end of the phrase
    for (const key of Object.keys(INGREDIENT_DENSITIES)) {
        if (lowered.endsWith(key)) {
            return key;
        }
    }

    // Fallback: loose includes() check
    for (const key of Object.keys(INGREDIENT_DENSITIES)) {
        if (lowered.includes(key)) {
            return key;
        }
    }

    return undefined;
}

export function isImperialUnit(unit: Unit): boolean {
    return unit === 'cup' || unit === 'cups' || unit === 'tbsp' || unit === 'tsp' || unit === 'fl oz';
}

export function isMetricUnit(unit: Unit): boolean {
    return unit === 'ml' || unit === 'g';
}

export function convertToMetric(amount: number, unit: Unit, ingredient?: string): ConversionResult {
    if (unit in VOLUME_CONVERSIONS_TO_ML) {
        const ml = amount * VOLUME_CONVERSIONS_TO_ML[unit as VolumeUnitImperial];

        // Try to convert to grams if density is known
        const normalized = ingredient ? normalizeIngredient(ingredient) : undefined;
        if (normalized && INGREDIENT_DENSITIES[normalized]) {
            const gramsPerMl = INGREDIENT_DENSITIES[normalized] / 240; // g per cup → g per ml
            return {
                value: Math.round(ml * gramsPerMl),
                unit: 'g',
                ingredient: ingredient
            };
        }

        return { value: Math.round(ml), unit: 'ml', ingredient };
    }

    if (unit in WEIGHT_CONVERSIONS_TO_G) {
        return {
            value: Math.round(amount * WEIGHT_CONVERSIONS_TO_G[unit as WeightUnitImperial]),
            unit: 'g',
            ingredient
        };
    }

    throw new Error(`Unknown unit: ${unit}`);
}
