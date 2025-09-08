import type { FC } from 'react';
import type { ConvertedIngredient } from '../types';

export const ConvertedIngredients: FC<{ convertedIngredients?: ConvertedIngredient }> = ({ convertedIngredients }) => {
    return (
        <div className="flex flex-col gap-1 flex-1 self-stretch">
            {convertedIngredients
                ?.filter((c) => c.original?.ingredient)
                .map((ingredient) => (
                    <div className="flex capitalize font-light text-sm flex-1 items-center justify-between">
                        <span>{ingredient.converted?.ingredient}</span>
                        <span className="btn btn-outline">
                            {ingredient.converted?.value} {ingredient.converted?.unit}
                        </span>
                    </div>
                ))}
        </div>
    );
};
