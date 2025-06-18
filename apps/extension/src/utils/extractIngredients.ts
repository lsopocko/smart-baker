import { getUnits, getFoods, getCookingVerbs } from '../lang';

type ScoredLine = {
    line: string;
    score: number;
    index: number;
};

const FRACTIONS = /[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/;

function truncateByIndexGap(lines: ScoredLine[], maxGap = 6): ScoredLine[] {
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

function getLineScore(line: string, language: 'en' | 'pl'): number {
    const lower = line.toLowerCase();
    const cleaned = lower.replace(/[.,:;!?]+/g, '');
    let score = 0;

    const UNITS = getUnits(language);
    const FOODS = getFoods(language);
    const COOKING_VERBS = getCookingVerbs(language);

    if (/\d/.test(cleaned) || FRACTIONS.test(cleaned)) score += 1;
    if (UNITS.some((unit) => new RegExp(`\\b${unit}\\b`).test(cleaned))) score += 1;
    if (FOODS.some((food) => cleaned.includes(food))) score += 0.5;
    if (!COOKING_VERBS.some((verb) => cleaned.includes(verb))) score += 0.5;
    if (startsWithNumber(cleaned)) score += 1; // boost if number is first
    const wordCount = cleaned.trim().split(/\s+/).length;
    const length = cleaned.length;
    if (length > 120) score -= 5;
    if (wordCount > 10) score -= 0.5;
    if (wordCount > 15) score -= 1;
    if (wordCount > 20) score -= 1.5;
    if (wordCount > 25) score -= 2;
    if (wordCount > 30) score -= 2.5;

    return score;
}

export function extractIngredientsHeuristically(lines: string[], language: 'en' | 'pl'): ScoredLine[] {
    const mappedLines = lines.map((line, index) => ({ line: line.trim(), index })).filter((l) => l.line.length >= 5 && l.line.length <= 200);

    const scored: ScoredLine[] = [];

    const UNITS = getUnits(language);
    const FOODS = getFoods(language);
    const COOKING_VERBS = getCookingVerbs(language);

    for (const { line, index } of mappedLines) {
        const lower = line.toLowerCase();
        const cleaned = lower.replace(/[.,:;!?]+/g, '');
        let score = 0;

        if (/\d/.test(cleaned) || FRACTIONS.test(cleaned)) score += 1;
        if (UNITS.some((unit) => new RegExp(`\\b${unit}\\b`).test(cleaned))) score += 1;
        if (FOODS.some((food) => cleaned.includes(food))) score += 0.5;
        if (!COOKING_VERBS.some((verb) => cleaned.includes(verb))) score += 0.5;
        if (startsWithNumber(cleaned)) score += 1; // boost if number is first
        // reduce score if no letters
        if (!/[a-zA-Z]/.test(cleaned)) score -= 1;
        const wordCount = cleaned.trim().split(/\s+/).length;
        if (wordCount > 10) score -= 0.5;
        if (wordCount > 15) score -= 1;
        if (wordCount > 20) score -= 1.5;
        if (wordCount > 25) score -= 2;
        if (wordCount > 30) score -= 2.5;

        scored.push({ line, score, index });
    }

    console.log('scored before clustering', scored);

    // Now apply block-based boost
    const clustered = boostByBlockDensity(scored);

    console.log('clustered', clustered);

    const filtered = clustered.filter((l) => l.score >= 3);

    console.log('filtered', filtered);

    const final = truncateByIndexGap(filtered);

    console.log('final', final);

    return final;
}

function findLCA(elements: HTMLElement[]): HTMLElement | null {
    if (elements.length === 0) return null;
    if (elements.length === 1) return elements[0];

    const paths = elements.map((el) => {
        const path: HTMLElement[] = [];
        let current: HTMLElement | null = el;
        while (current) {
            path.unshift(current);
            current = current.parentElement;
        }
        return path;
    });

    let lca: HTMLElement | null = null;
    for (let i = 0; i < paths[0].length; i++) {
        const node = paths[0][i];
        if (paths.every((path) => path[i] === node)) {
            lca = node;
        } else {
            break;
        }
    }

    return lca;
}

export const extractIngredientLinesFromDOM = (language: 'en' | 'pl'): string[] => {
    const lines: { text: string; node: HTMLElement; score: number }[] = [];

    const garbageTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'IFRAME', 'HEAD', 'META', 'LINK']);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
            if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_REJECT;
            if (garbageTags.has(node.tagName)) return NodeFilter.FILTER_REJECT;
            if (node.offsetParent === null) return NodeFilter.FILTER_SKIP; // hidden

            return NodeFilter.FILTER_ACCEPT;
        }
    });

    while (walker.nextNode()) {
        const el = walker.currentNode as HTMLElement;
        if (!el.textContent || el.textContent.trim().length < 2) continue;

        // Handle <br>-separated ingredients
        if (el.innerHTML.includes('<br')) {
            const parts = el.innerHTML
                .split(/<br\s*\/?>/i)
                .map((part) => part.replace(/<\/?[^>]+(>|$)/g, '').trim())
                .filter(Boolean);

            for (const part of parts) {
                if (getLineScore(part, language) >= 2) {
                    lines.push({ text: part, node: el, score: getLineScore(part, language) });
                }
            }
        } else {
            const text = el.textContent.trim();
            if (getLineScore(text, language) >= 2) {
                lines.push({ text, node: el, score: getLineScore(text, language) });
            }
        }
    }

    if (lines.length === 0) return [];

    const lca = findLCA(lines.map((line) => line.node));
    if (!lca) return [];

    const extracted: string[] = [];
    for (const el of Array.from(lca.querySelectorAll('*'))) {
        if (!(el instanceof HTMLElement)) continue;
        if (garbageTags.has(el.tagName)) continue;
        if (el.offsetParent === null) continue;

        if (el.innerHTML.includes('<br')) {
            const parts = el.innerHTML
                .split(/<br\s*\/?>/i)
                .map((part) => part.replace(/<\/?[^>]+(>|$)/g, '').trim())
                .filter(Boolean);
            extracted.push(...parts);
        } else {
            const txt = el.textContent?.trim();
            if (txt && txt.length > 2) extracted.push(txt);
        }
    }

    console.log('extracted', extracted);

    return extracted;
};

export function extractIngredientLinesFromPage(language: 'en' | 'pl'): ScoredLine[] {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

    for (const script of scripts) {
        try {
            const json = JSON.parse(script.textContent || '');

            // Some sites wrap Recipe in an array or graph
            const recipes = Array.isArray(json) ? json : json['@graph'] || [json];

            console.log('recipes', recipes);

            for (const item of recipes) {
                if (item['@type'].includes('Recipe') && Array.isArray(item.recipeIngredient)) {
                    console.log('[BakeIQ] Found structured recipe data!');
                    return item.recipeIngredient.map((ingredient: string) => ({ line: ingredient, score: 10, index: 0 }));
                }
            }
        } catch (err) {
            console.warn('[BakeIQ] Failed to parse JSON-LD', err);
        }
    }

    const candidates = extractIngredientLinesFromDOM(language);

    // 🔁 Fallback: use text-based heuristics if no JSON found
    return extractIngredientsHeuristically(candidates, language);
}

function getRecipeNameFromHeadings(): string | null {
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent && h1.textContent.length < 100) return h1.textContent.trim();

    const possibleHeadings = Array.from(document.querySelectorAll('h1, h2')).filter((el) => el.textContent && el.textContent.length < 100);

    return possibleHeadings.length > 0 ? possibleHeadings[0].textContent!.trim() : null;
}

function getRecipeNameFromTitle(): string | null {
    const title = document.title;
    if (title) {
        // Strip branding
        return title.split('|')[0].split('-')[0].trim();
    }
    return null;
}

export const getRecipeNameFromLDJson = (): string | null => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

    for (const script of scripts) {
        try {
            const json = JSON.parse(script.textContent || '');
            const recipe = Array.isArray(json)
                ? json.find((j) => j['@type'] === 'Recipe')
                : json['@type'] === 'Recipe'
                  ? json
                  : json['@graph']?.find((j: any) => j['@type'] === 'Recipe');
            if (recipe?.name) return recipe.name;
        } catch (e) {
            // ignore malformed JSON
        }
    }

    return null;
};

export const extractRecipeName = (): string => {
    return getRecipeNameFromLDJson() || getRecipeNameFromHeadings() || getRecipeNameFromTitle() || 'Unknown Recipe';
};
