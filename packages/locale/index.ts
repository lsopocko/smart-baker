// Import all locale-specific exports
import * as enConsts from './en/consts';
import * as enTypes from './en/types';
import * as plConsts from './pl/consts';
import * as plTypes from './pl/types';

// Re-export types for convenience
export type { 
  VolumeUnitImperial, 
  WeightUnitImperial, 
  WeightUnitMetric, 
  VolumeUnitMetric, 
  WeightUnit, 
  VolumeUnit, 
  Unit, 
  ConversionResult 
} from './en/types';

// Export locale-specific constants
export const en = {
  consts: enConsts,
  types: enTypes
};

export const pl = {
  consts: plConsts,
  types: plTypes
};

// Function to get locale-specific constants
export const getLocaleConstants = (locale: 'en' | 'pl') => {
  return locale === 'en' ? enConsts : plConsts;
};

// Default export for backward compatibility
export default {
  en,
  pl,
  getLocaleConstants
};
