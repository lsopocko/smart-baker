import { extractIngredientLinesFromPage, extractRecipeName } from './utils/extractIngredients';
import { parseIngredientsFromAPI } from './utils/parseIngredientsFromAPI';
import { convertToMetric } from '@bakeiq/converter';
import { shouldShowBanner } from './utils/shouldShowBanner';
import { detectLanguage } from './utils/detectLanguage';
import { detectUnitSystem } from './utils/detectUnitSystem';
import { type ConvertedIngredient, UnitSystem, Language } from './types';
import type { BakeIQModule, BakeIQState } from './state/BakeIQ.module';
import { Banner, injectBanner } from './injectBanner';
import { defaultSettings } from './state/BakeIQ.module';

async function runSmartParsing(state: BakeIQModule): Promise<{ id: string; converted: ConvertedIngredient }> {
    const scored = extractIngredientLinesFromPage();

    if (scored.length === 0) {
        return {
            id: '',
            converted: []
        };
    }

    const topLines = scored.map((l) => l.line);

    const parsed = await parseIngredientsFromAPI(topLines, state.getState().recipeName);

    const converted: ConvertedIngredient = parsed.results.map((p) => {
        if (p.quantity && p.unit && p.ingredient) {
            return {
                input: p.input,
                original: {
                    quantity: p.quantity,
                    unit: p.unit,
                    ingredient: p.ingredient
                },
                converted: convertToMetric(p.quantity, p.unit, p.ingredient)
            };
        }
        return {
            input: p.input,
            original: {
                quantity: null,
                unit: null,
                ingredient: null
            },
            converted: null
        };
    });

    chrome.runtime.sendMessage({
        type: 'SMART_BAKER_CONVERSIONS',
        payload: {
            id: parsed.id,
            converted
        }
    });

    return {
        id: parsed.id,
        converted
    };
}

const init = async (state: BakeIQModule) => {
    const language = detectLanguage();
    const unitSystem = detectUnitSystem(document.body.innerText);

    state.addListener(() => {
        console.log('state updated', state.getState());
    });

    chrome.storage.sync.get('bakeiq_settings', (result) => {
        if (result.bakeiq_settings) {
            state.setState({
                userSettings: { ...defaultSettings, ...result.bakeiq_settings }
            });

            state.setState({
                activePan: result.bakeiq_settings.defaultPanSize
            });
        }
    });

    if (!shouldShowBanner(language, unitSystem)) {
        console.log('Banner should not be shown');
        return;
    }

    const recipeName = extractRecipeName();

    state.setState({
        recipeName,
        detectedPan: defaultSettings.defaultPanSize,
        activePan: state.getState().userSettings.defaultPanSize,
        userSettings: state.getState().userSettings || defaultSettings,
        scaleRatio: 1,
        siteUnitSystem: unitSystem,
        siteLanguage: language,
        qrCode: ''
    });

    const { id, converted } = await runSmartParsing(state);

    state.setState({
        convertedIngredients: converted,
        recipeId: id
    });

    if (converted.length === 0) {
        console.log('No converted ingredients');
        return;
    }

    const banner = injectBanner(state);

    console.log('banner', banner);
};

(() => {
    const BakeIQ: BakeIQModule = (() => {
        const listeners: ((state: BakeIQState) => void)[] = [];
        let state: BakeIQState = {
            detectedPan: null,
            activePan: null,
            userSettings: defaultSettings,
            convertedIngredients: [],
            scaleRatio: 1,
            siteUnitSystem: UnitSystem.Metric,
            siteLanguage: Language.English,
            qrCode: '',
            recipeId: '',
            recipeName: ''
        };

        function setState(partial: Partial<BakeIQState>): void {
            state = { ...state, ...partial };
            listeners.forEach((listener) => listener(state));
        }

        function getState(): BakeIQState {
            return state;
        }

        function addListener(listener: (state: BakeIQState) => void): void {
            listeners.push(listener);
        }

        return {
            getState,
            setState,
            addListener
        };
    })();

    (async (state) => {
        await init(state);
    })(BakeIQ);
})();
