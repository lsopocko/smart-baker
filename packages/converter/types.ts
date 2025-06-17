export type VolumeUnitImperial =
    | 'cup'
    | 'cups'
    | 'tbsp'
    | 'tsp'
    | 'fl oz'
    | 'teaspoon'
    | 'teaspoons'
    | 'tablespoon'
    | 'tablespoons'
    | 'pound'
    | 'pounds'
    | 'lb'
    | 'lbs';

export type WeightUnitMetric = 'g' | 'kg';
export type VolumeUnitMetric = 'ml' | 'l';
export type WeightUnitImperial = 'oz' | 'lb' | 'lbs' | 'ozs' | 'ozs.' | 'ounce';
export type WeightUnit = WeightUnitMetric | WeightUnitImperial;
export type VolumeUnit = VolumeUnitImperial | VolumeUnitMetric;
export type Unit = VolumeUnit | WeightUnit;

export type ConversionResult = {
    unit: 'ml' | 'g';
    value: number;
    ingredient?: string;
};