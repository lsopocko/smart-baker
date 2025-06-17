import type { Unit } from '@bakeiq/converter/types';

type ParsedIngredient = {
    input: string;
    quantity: number | null;
    unit: Unit | null;
    ingredient: string | null;
    comment: string | null;
};

export async function parseIngredientsFromAPI(lines: string[], name?: string): Promise<{ id: string; results: ParsedIngredient[] }> {
    const res = await fetch('http://localhost:8001/parse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lines, name })
    });

    if (!res.ok) {
        throw new Error(`Failed to parse ingredients. Status ${res.status}`);
    }

    const result = await res.json();

    return result as { id: string; results: ParsedIngredient[] };
}
