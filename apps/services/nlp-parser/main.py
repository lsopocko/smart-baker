from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from ingredient_parser import parse_ingredient
from fastapi.middleware.cors import CORSMiddleware
import re

UNITS = ["cup", "cups", "tbsp", "tablespoon", "tsp", "teaspoon", "oz", "ounce", "lb", "pound", "ml", "l", "g", "kg"]
FOODS = ["flour", "sugar", "butter", "milk", "egg", "cheese", "salt", "oil", "chicken", "garlic", "onion"]

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

@app.post("/parse")
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

    return results

@app.post("/extract-ingredients")
def extract_ingredients(data: RecipeText):
    lines = extract_ingredient_lines(data.text)
    return {"lines": lines}