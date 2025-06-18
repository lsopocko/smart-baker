import { UNITS, FOODS, COOKING_VERBS } from './en';
import { UNITS as UNITS_PL, FOODS as FOODS_PL, COOKING_VERBS as COOKING_VERBS_PL } from './pl';

export const getUnits = (language: 'en' | 'pl') => {
    return language === 'en' ? UNITS : UNITS_PL;
};

export const getFoods = (language: 'en' | 'pl') => {
    return language === 'en' ? FOODS : FOODS_PL;
};

export const getCookingVerbs = (language: 'en' | 'pl') => {
    return language === 'en' ? COOKING_VERBS : COOKING_VERBS_PL;
};
