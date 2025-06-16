import { convertToMetric } from './convert';
import { parseQuantity } from './parseQuantity';

const UNITS = ['cups', 'cup', 'teaspoons', 'tablespoons', 'tbsp', 'tsp', 'oz', 'lb', 'fl oz'];
// 1, 1.5, 1/2, 1 1/2, or ½
const quantityPattern = `((?:\\d+\\s+)?\\d+(?:\\/\\d+)?|[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])`;

const UNIT_PATTERN = new RegExp(`${quantityPattern}\\s+(${UNITS.join('|')})(?:\\s+([a-zA-Z\\s]+?))?(?=[.,;\\n]|$)`, 'gi');

function isTextNode(node: Node): node is Text {
    return node.nodeType === Node.TEXT_NODE;
}

function walkAndReplace(node: Node) {
    if (isTextNode(node)) {
        const original = node.textContent;
        if (!original || !UNIT_PATTERN.test(original)) return;

        const updated = original.replace(UNIT_PATTERN, (match, qty, unit, ingredient) => {
            try {
                const quantity = parseQuantity(qty); // instead of parseFloat
                const result = convertToMetric(quantity, unit.toLowerCase() as any, ingredient);
                console.log('result', result);
                const suffix = result.unit === 'g' ? `${result.value} g` : `${result.value} ml`;
                return `${qty} ${unit}${ingredient ? ' ' + ingredient : ''} (${suffix})`;
            } catch (e) {
                console.log('error', match, e);
                return match; // fallback
            }
        });

        if (updated !== original) {
            node.textContent = updated;
        }
    } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes((node as Element).tagName)) {
        for (const child of Array.from(node.childNodes)) {
            walkAndReplace(child);
        }
    }
}

export function scanAndConvertUnits() {
    walkAndReplace(document.body);
}
