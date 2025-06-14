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

export const shouldShowBanner = (): boolean => {
    const hasSchema = pageHasRecipeSchema();
    const hasIngredientKeywords = document.body.innerText.match(/\b(ingredients?|directions?|preheat|oven)\b/i);
    const hasCookingUnits = document.body.innerText.match(/\b(cup|g|ml|tsp|tablespoon|oz|pound|gram)\b/i);

    return !!(hasSchema || (hasIngredientKeywords && hasCookingUnits));
};
