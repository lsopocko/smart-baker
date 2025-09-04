import type { FC } from 'react';
import type { ConvertedIngredient } from '../types';

export const ConvertedIngredients: FC<{ convertedIngredients: ConvertedIngredient }> = ({ convertedIngredients }) => {
    return (
        <div>
            {convertedIngredients.map((ingredient) => (
                <span>{ingredient.converted?.ingredient}</span>
            ))}
        </div>
    );
};
