import { Language, UnitSystem } from '../types';

const ENGLISH_RECIPE_KEYWORDS = ['ingredients', 'directions', 'preheat', 'oven'];
const ENGLISH_COOKING_UNITS = ['cup', 'g', 'ml', 'tsp', 'tablespoon', 'oz', 'pound', 'gram'];

const POLISH_RECIPE_KEYWORDS = ['składniki', 'przepis', 'piekarnik', 'piekarnik'];
const POLISH_COOKING_UNITS = ['szklanka', 'g', 'ml', 'łyżeczka', 'łyżka', 'filiżanka', 'kilogram', 'gram'];

const RECIPE_KEYWORDS = {
    [Language.English]: ENGLISH_RECIPE_KEYWORDS,
    [Language.Polish]: POLISH_RECIPE_KEYWORDS
};

const COOKING_UNITS = {
    [Language.English]: ENGLISH_COOKING_UNITS,
    [Language.Polish]: POLISH_COOKING_UNITS
};

export const pageHasRecipeSchema = (): boolean => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    return scripts.some((script) => {
        try {
            const data = JSON.parse(script.textContent || '{}');
            console.log('data', data);
            return data['@type'] === 'Recipe' || (Array.isArray(data) && data.some((item) => item['@type'] === 'Recipe'));
        } catch {
            return false;
        }
    });
};

export const shouldShowBanner = (language: Language, unitSystem: UnitSystem): boolean => {
    console.log('language', language);
    console.log('unitSystem', unitSystem);
    const hasSchema = pageHasRecipeSchema();
    const hasIngredientKeywords = document.body.innerText.match(new RegExp(`\\b(${RECIPE_KEYWORDS[language].join('|')})\\b`, 'i'));
    const hasCookingUnits = document.body.innerText.match(new RegExp(`\\b(${COOKING_UNITS[language].join('|')})\\b`, 'i'));

    return !!(hasSchema || (hasIngredientKeywords && hasCookingUnits && unitSystem !== UnitSystem.Mixed));
};
