export const parseQuantity = (str: string): number => {
    // Matches "1 1/2", "3/4", "½"
    const unicodeFractions: Record<string, number> = {
        '¼': 0.25,
        '½': 0.5,
        '¾': 0.75,
        '⅐': 1 / 7,
        '⅑': 1 / 9,
        '⅒': 0.1,
        '⅓': 1 / 3,
        '⅔': 2 / 3,
        '⅕': 0.2,
        '⅖': 0.4,
        '⅗': 0.6,
        '⅘': 0.8,
        '⅙': 1 / 6,
        '⅚': 5 / 6,
        '⅛': 0.125,
        '⅜': 0.375,
        '⅝': 0.625,
        '⅞': 0.875
    };

    // Pure unicode fraction like "½"
    if (unicodeFractions[str]) return unicodeFractions[str];

    // "1 1/2" or "3/4"
    const match = str.match(/^(\d+)?\s*(\d+)\/(\d+)$/);
    if (match) {
        const whole = match[1] ? parseInt(match[1]) : 0;
        const num = parseInt(match[2]);
        const denom = parseInt(match[3]);
        return whole + num / denom;
    }

    return parseFloat(str); // fallback to decimal
};
