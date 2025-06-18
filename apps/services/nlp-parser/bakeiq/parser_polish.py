from typing import Optional
from fractions import Fraction
import re

def parse_polish_ingredient(line: str) -> dict:
    input_line = line.strip().lower()
    quantity = None
    unit = None
    ingredient = None
    comment = None

    UNITS_PL = [
        "szklanka", "szklanki", "szklanek",
        "łyżka", "łyżki", "łyżek",
        "łyżeczka", "łyżeczki", "łyżeczek",
        "g", "gram", "gramy",
        "kg", "kilogram", "kilogramy",
        "ml", "mililitr", "mililitry",
        "l", "litr", "litry",
        "dag", "deko",
        "opakowanie", "opakowania", "opakowań",
        "sztuka", "sztuki", "sztuk"
    ]

    working = input_line

    # Handle fraction (e.g. 1 1/2)
    fraction_match = re.search(r"(\d+)\s+(\d+)/(\d+)", working)
    if fraction_match:
        whole, num, denom = map(int, fraction_match.groups())
        quantity = float(whole + Fraction(num, denom))
        working = working.replace(fraction_match.group(0), '')
    else:
        simple_fraction = re.search(r"(\d+)/(\d+)", working)
        if simple_fraction:
            num, denom = map(int, simple_fraction.groups())
            quantity = float(Fraction(num, denom))
            working = working.replace(simple_fraction.group(0), '')
        else:
            number_match = re.search(r"\d+[.,]?\d*", working)
            if number_match:
                quantity = float(number_match.group(0).replace(',', '.'))
                working = working.replace(number_match.group(0), '')

    # Extract unit
    for u in UNITS_PL:
        if re.search(rf"\b{u}\b", working):
            unit = u
            working = re.sub(rf"\b{u}\b", '', working, count=1)
            break

    # Split remaining string
    parts = [part.strip() for part in working.split(',')]
    ingredient = parts[0] if parts else None
    comment = parts[1] if len(parts) > 1 else None

    return {
        "input": line,
        "quantity": quantity,
        "unit": unit,
        "ingredient": ingredient,
        "comment": comment
    }