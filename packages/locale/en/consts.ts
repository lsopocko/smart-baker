import { VolumeUnitImperial, WeightUnitImperial } from './types';

export const VOLUME_CONVERSIONS_TO_ML: Record<VolumeUnitImperial, number> = {
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
    lb: 453.6,
    lbs: 453.6,
    ozs: 28.35,
    'ozs.': 28.35,
    ounce: 28.35
};

// Optional: ingredient-specific density overrides (grams per cup)
const INGREDIENT_DENSITIES: Record<string, number> = {
    flour: 125, // g per cup
    sugar: 200,
    butter: 227,
    milk: 240,
    water: 240
};

export const MetricUnits = [
  // Weight units
  'mg', 'g', 'gram', 'grams',
  'dag', 'dekagram', 'dekagrams',
  'kg', 'kilogram', 'kilograms',
  'tonne', 'tonnes',

  // Volume units
  'ml', 'milliliter', 'milliliters',
  'cl', 'centiliter', 'centiliters',
  'dl', 'deciliter', 'deciliters',
  'l', 'liter', 'liters',
  'hl', 'hectoliter', 'hectoliters',
];