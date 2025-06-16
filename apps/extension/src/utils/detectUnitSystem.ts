import { UnitSystem } from '../types';

export const detectUnitSystem = (text: string): UnitSystem => {
    const imperialUnits = /\b(cup|cups|oz|ounce|ounces|lb|lbs|pound|pounds|tsp|tbsp|inch|inches|fahrenheit|f)\b/gi;
    const metricUnits = /\b(g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|cm|celsius|°c)\b/gi;

    const imperialMatches = text.match(imperialUnits)?.length || 0;
    const metricMatches = text.match(metricUnits)?.length || 0;

    if (imperialMatches > metricMatches * 1.5) return UnitSystem.Imperial;
    if (metricMatches > imperialMatches * 1.5) return UnitSystem.Metric;
    return UnitSystem.Mixed;
};
