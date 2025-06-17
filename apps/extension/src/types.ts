import type { ConversionResult } from '@bakeiq/converter/types';

export enum Language {
    English = 'en',
    Polish = 'pl'
}

export enum UnitSystem {
    Metric = 'metric',
    Imperial = 'imperial',
    Mixed = 'mixed'
}

export type PanSize = {
    width: number;
    height: number;
    area?: number;
    unit: 'cm' | 'inch';
    name: string;
};

export type ConvertedIngredient = {
    input: string;
    original: {
        quantity: number | null;
        unit: string | null;
        ingredient: string | null;
    };
    converted: ConversionResult | null;
}[];

export type BakeIQSettings = {
    defaultUnit: UnitSystem;
    defaultPanSize: PanSize;
    panSizes: PanSize[];
    showBanner: boolean;
    autoConvert: boolean;
};
