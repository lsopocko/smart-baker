type ParsedIngredient = {
    input: string;
    quantity: number | null;
    unit: string | null;
    ingredient: string | null;
    comment: string | null;
  };
  
  export async function parseIngredientsFromAPI(lines: string[]): Promise<ParsedIngredient[]> {
    const res = await fetch("http://localhost:8001/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lines })
    });
  
    if (!res.ok) {
      throw new Error(`Failed to parse ingredients. Status ${res.status}`);
    }
  
    const result = await res.json();
    return result as ParsedIngredient[];
  }