import type { FC } from 'react';
import type { ConvertedIngredient } from '../types';

export const ConvertedIngredients: FC<{ convertedIngredients?: ConvertedIngredient }> = ({ convertedIngredients }) => {
    return (
        <div className="flex flex-col gap-1 flex-1 self-stretch">
            {convertedIngredients
                ?.filter((c) => c.original?.ingredient)
                .map((ingredient) => (
                    <div className="flex  font-light text-sm flex-1 items-center justify-between">
                        <span className="capitalize">{ingredient.converted?.ingredient}</span>
                        <span className="bordr pl-2 pr-2 pt-1 pb-1 text-primary text-[11px] rounded-lg border-2 border-primary">
                            {ingredient.converted?.value} {ingredient.converted?.unit}
                        </span>
                    </div>
                ))}
        </div>
    );
};
