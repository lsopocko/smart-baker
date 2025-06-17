import { convertToCm } from '@bakeiq/converter';
import type { ConvertedIngredient, PanSize } from '../types';

export const scaleIngredientsByRatio = (ingredients: ConvertedIngredient, ratio: number): ConvertedIngredient => {
    return ingredients.map((ing) => ({
        ...ing,
        converted: ing.converted
            ? {
                  ...ing.converted,
                  value: ing.converted.value ? Math.round(ing.converted.value * ratio * 10) / 10 : 0
              }
            : null
    }));
};

export const calculatePanScalingRatio = (from: PanSize, to: PanSize): number => {
    const fromWidth = convertToCm(from.width, from.unit);
    const fromHeight = convertToCm(from.height, from.unit);
    const toWidth = convertToCm(to.width, to.unit);
    const toHeight = convertToCm(to.height, to.unit);

    const fromArea = fromWidth * fromHeight;
    const toArea = toWidth * toHeight;

    return toArea / fromArea;
};
