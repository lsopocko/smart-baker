import type { FC } from 'react';
import type { ConvertedIngredient } from '../types';

export const ConvertedIngredients: FC<{ convertedIngredients?: ConvertedIngredient }> = ({ convertedIngredients }) => {
    return (
        <div className="flex flex-col gap-1 flex-1 self-stretch">
            {convertedIngredients?.map((ingredient) => (
                <div className="flex capitalize font-light text-sm flex-1 items-center">{ingredient.converted?.ingredient}</div>
            ))}
        </div>
    );
};
