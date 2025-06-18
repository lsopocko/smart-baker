from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from ingredient_parser import parse_ingredient
from fastapi.middleware.cors import CORSMiddleware
import re
import uuid
from bakeiq.parser_polish import parse_polish_ingredient

UNITS = ["cup", "cups", "tbsp", "tablespoon", "tsp", "teaspoon", "oz", "ounce", "lb", "pound", "ml", "l", "g", "kg"]
FOODS = ["flour", "sugar", "butter", "milk", "egg", "cheese", "salt", "oil", "chicken", "garlic", "onion"]

# Store parsed ingredients keyed by UUID
ingredient_db = {}

class ParsedIngredients(BaseModel):
    id: str
    results: list[dict]

def is_probable_ingredient(line: str) -> bool:
    if not re.search(r"\d", line): return False  # must have a number
    if not any(unit in line.lower() for unit in UNITS): return False
    if not any(food in line.lower() for food in FOODS): return False
    if re.search(r"\b(mix|stir|bake|heat|cook|set aside)\b", line.lower()): return False
    return True

def extract_ingredient_lines(text: str) -> list[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return [line for line in lines if is_probable_ingredient(line)]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins — safe for local dev, not production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeText(BaseModel):
    text: str

class IngredientLines(BaseModel):
    lines: List[str]
    name: str

@app.post("/parse/en", response_model=ParsedIngredients)
def parse_lines(data: IngredientLines):
    results = []

    for line in data.lines:
        result = parse_ingredient(line)

        quantity = float(result.amount[0].quantity) if result.amount else None
        unit = str(result.amount[0].unit).lower() if result.amount and result.amount[0].unit else None
        ingredient = result.name[0].text if result.name else None
        comment = getattr(result, 'comment', None)

        results.append({
            "input": line,
            "quantity": quantity,
            "unit": unit,
            "ingredient": ingredient,
            "comment": comment
        })

    parsed_id = str(uuid.uuid4())
    ingredient_db[parsed_id] = {
        "name": data.name,
        "results": results
    }

    return { "id": parsed_id, "results": results }

@app.post("/parse/pl", response_model=ParsedIngredients)
def parse_polish(lines: IngredientLines):
    results = [parse_polish_ingredient(line) for line in lines.lines]

    parsed_id = str(uuid.uuid4())
    ingredient_db[parsed_id] = {
        "name": lines.name,
        "results": results
    }

    return { "id": parsed_id, "results": results }

@app.get("/ingredients/{parsed_id}")
def get_ingredients(parsed_id: str):
    if parsed_id in ingredient_db:
        return ingredient_db[parsed_id]
    return {"error": "Not found"}, 404

@app.post("/extract-ingredients")
def extract_ingredients(data: RecipeText):
    lines = extract_ingredient_lines(data.text)
    return {"lines": lines}