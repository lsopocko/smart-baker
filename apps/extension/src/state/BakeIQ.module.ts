import type { BakeIQSettings, ConvertedIngredient, Language, PanSize } from '../types';
import { UnitSystem } from '../types';

export const defaultSettings: BakeIQSettings = {
    defaultUnit: UnitSystem.Metric,
    defaultPanSize: {
        width: 22,
        height: 33,
        unit: 'cm',
        name: '22×33 cm pan'
    },
    // Popular sheet pan and cake pan sizes
    panSizes: [
        { width: 6, height: 6, unit: 'inch', name: '6×6 inch square cake pan' },
        { width: 8, height: 8, unit: 'inch', name: '8×8 inch square cake pan' },
        { width: 9, height: 9, unit: 'inch', name: '9×9 inch square cake pan' },
        { width: 9, height: 13, unit: 'inch', name: '9×13 inch rectangular cake pan' },
        { width: 8, height: 2, unit: 'inch', name: '8 inch round cake pan' },
        { width: 9, height: 2, unit: 'inch', name: '9 inch round cake pan' },
        { width: 10, height: 2, unit: 'inch', name: '10 inch round cake pan' },

        // 🧁 Cake pans (cm)
        { width: 15, height: 15, unit: 'cm', name: '15×15 cm square cake pan' },
        { width: 20, height: 20, unit: 'cm', name: '20×20 cm square cake pan' },
        { width: 22, height: 22, unit: 'cm', name: '22×22 cm square cake pan' },
        { width: 23, height: 33, unit: 'cm', name: '23×33 cm rectangular cake pan' },
        { width: 20, height: 5, unit: 'cm', name: '20 cm round cake pan' },
        { width: 23, height: 5, unit: 'cm', name: '23 cm round cake pan' },
        { width: 25, height: 5, unit: 'cm', name: '25 cm round cake pan' },

        // 🍪 Sheet pans (inches)
        { width: 13, height: 18, unit: 'inch', name: 'Half sheet pan (13×18 inch)' },
        { width: 9.5, height: 13, unit: 'inch', name: 'Quarter sheet pan (9.5×13 inch)' },
        { width: 18, height: 26, unit: 'inch', name: 'Full sheet pan (18×26 inch)' },

        // 🍪 Sheet pans (cm)
        { width: 33, height: 45, unit: 'cm', name: 'Half sheet pan (33×45 cm)' },
        { width: 25, height: 35, unit: 'cm', name: 'Quarter sheet pan (25×35 cm)' },
        { width: 46, height: 66, unit: 'cm', name: 'Full sheet pan (46×66 cm)' }
    ],
    showBanner: true,
    autoConvert: true
};

export interface BakeIQModule {
    getState: () => BakeIQState;
    setState: (partial: Partial<BakeIQState>) => void;
    addListener: (listener: (state: BakeIQState) => void) => void;
}

export type BakeIQState = {
    detectedPan: PanSize | null;
    activePan: PanSize | null;
    userSettings: Partial<BakeIQSettings>;
    convertedIngredients: ConvertedIngredient;
    scaleRatio: number;
    siteUnitSystem: UnitSystem;
    siteLanguage: Language;
    qrCode?: string;
    recipeId?: string;
    recipeName?: string;
};
