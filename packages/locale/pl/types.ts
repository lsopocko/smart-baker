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
    | 'lbs'
    // Polish volume units
    | 'szklanka'
    | 'szklanki'
    | 'szklanek'
    | 'łyżka'
    | 'łyżki'
    | 'łyżek'
    | 'łyżeczka'
    | 'łyżeczki'
    | 'łyżeczek'
    | 'uncja płynna'
    | 'uncje płynne'
    | 'uncja'
    | 'uncje';

export type WeightUnitMetric =
  | 'mg'
  | 'g'
  | 'dag'
  | 'kg'
  | 'tonne';

export type VolumeUnitMetric =
  | 'ml'
  | 'cl'
  | 'dl'
  | 'l'
  | 'hl';

export type WeightUnitImperial = 
  | 'oz' 
  | 'lb' 
  | 'lbs' 
  | 'ozs' 
  | 'ozs.' 
  | 'ounce'
  // Polish weight units
  | 'uncja'
  | 'uncje'
  | 'funt'
  | 'funty';

export type WeightUnit = WeightUnitMetric | WeightUnitImperial;
export type VolumeUnit = VolumeUnitImperial | VolumeUnitMetric;
export type Unit = VolumeUnit | WeightUnit;

export type ConversionResult = {
    unit: Unit;
    value: number;
    ingredient?: string;
};