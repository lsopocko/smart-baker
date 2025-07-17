import { VolumeUnitImperial, WeightUnitImperial } from './types';

export const VOLUME_CONVERSIONS_TO_ML: Record<VolumeUnitImperial, number> = {
    // English units (kept for compatibility)
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
    'fl oz': 29.57,
    
    // Polish units
    szklanka: 240,
    szklanki: 240,
    szklanek: 240,
    łyżka: 14.8,
    łyżki: 14.8,
    łyżek: 14.8,
    łyżeczka: 4.93,
    łyżeczki: 4.93,
    łyżeczek: 4.93,
    uncja: 28.35,
    uncje: 28.35,
    funt: 453.6,
    funty: 453.6,
    'uncja płynna': 29.57,
    'uncje płynne': 29.57
};

const WEIGHT_CONVERSIONS_TO_G: Record<WeightUnitImperial, number> = {
    // English units (kept for compatibility)
    oz: 28.35,
    lb: 453.6,
    lbs: 453.6,
    ozs: 28.35,
    'ozs.': 28.35,
    ounce: 28.35,
    
    // Polish units
    uncja: 28.35,
    uncje: 28.35,
    funt: 453.6,
    funty: 453.6
};

// Optional: ingredient-specific density overrides (grams per cup)
const INGREDIENT_DENSITIES: Record<string, number> = {
    // English ingredients
    flour: 125, // g per cup
    sugar: 200,
    butter: 227,
    milk: 240,
    water: 240,
    
    // Polish ingredients
    mąka: 125, // g per szklanka
    cukier: 200,
    masło: 227,
    mleko: 240,
    woda: 240,
    śmietana: 240,
    olej: 218,
    ser: 113
};

export const MetricUnits = [
  // Weight units (English)
  'mg', 'g', 'gram', 'grams',
  'dag', 'dekagram', 'dekagrams',
  'kg', 'kilogram', 'kilograms',
  'tonne', 'tonnes',

  // Volume units (English)
  'ml', 'milliliter', 'milliliters',
  'cl', 'centiliter', 'centiliters',
  'dl', 'deciliter', 'deciliters',
  'l', 'liter', 'liters',
  'hl', 'hectoliter', 'hectoliters',
  
  // Polish weight units
  'miligram', 'miligramy', 'miligramów',
  'gram', 'gramy', 'gramów',
  'dekagram', 'dekagramy', 'dekagramów',
  'kilogram', 'kilogramy', 'kilogramów',
  'tona', 'tony', 'ton',
  
  // Polish volume units
  'mililitr', 'mililitry', 'mililitrów',
  'centylitr', 'centylitry', 'centylitrów',
  'decylitr', 'decylitry', 'decylitrów',
  'litr', 'litry', 'litrów',
  'hektolitr', 'hektolitry', 'hektolitrów',
  
  // Common Polish abbreviations
  'deko', 'dek', 'kg', 'g', 'ml', 'l', 'cl', 'dl', 'hl'
];