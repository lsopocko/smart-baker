import { extractIngredientLinesFromPage, extractRecipeName } from './utils/extractIngredients';
import { parseIngredientsFromAPI } from './utils/parseIngredientsFromAPI';
import { convertToMetric, type ConversionResult } from './utils/convert';
import css from './banner.css?inline';
import { shouldShowBanner } from './utils/shouldShowBanner';
import { detectLanguage } from './utils/detectLanguage';
import { detectUnitSystem } from './utils/detectUnitSystem';
import QRCode from 'qrcode';

function html(strings: TemplateStringsArray, ...values: any[]): string {
    return strings.reduce((result, str, i) => result + str + (values[i] ?? ''), '');
}

type ConvertedIngredient = {
    input: string;
    original: {
        quantity: number | null;
        unit: string | null;
        ingredient: string | null;
    };
    converted: ConversionResult | null;
}[];

function scaleIngredientsByRatio(ingredients: ConvertedIngredient, ratio: number): ConvertedIngredient {
    return ingredients.map((ing) => ({
        ...ing,
        converted: ing.converted
            ? {
                  ...ing.converted,
                  value: ing.converted.value ? Math.round(ing.converted.value * ratio * 10) / 10 : 0
              }
            : null
    }));
}

function convertToCm(value: number, unit: 'cm' | 'inch'): number {
    return unit === 'inch' ? value * 2.54 : value;
}

type PanSize = {
    width: number;
    height: number;
    area?: number;
    unit: 'cm' | 'inch';
    name: string;
};

function calculatePanScalingRatio(from: PanSize, to: PanSize): number {
    const fromWidth = convertToCm(from.width, from.unit);
    const fromHeight = convertToCm(from.height, from.unit);
    const toWidth = convertToCm(to.width, to.unit);
    const toHeight = convertToCm(to.height, to.unit);

    const fromArea = fromWidth * fromHeight;
    const toArea = toWidth * toHeight;

    return toArea / fromArea;
}

const detectedPanSize: PanSize = {
    width: 8,
    height: 11,
    area: 8 * 11,
    unit: 'inch',
    name: '22×33 cm pan'
};

const userPanSizes: PanSize[] = [
    {
        width: 18,
        height: 18,
        area: 18 * 18,
        unit: 'cm',
        name: '18×18 cm sheet pan'
    },
    {
        width: 24,
        height: 24,
        area: 24 * 24,
        unit: 'cm',
        name: '24×24 cm pan'
    },
    {
        name: 'Ø 24 cm cake pan',
        width: 24,
        height: 24,
        unit: 'cm',
        area: Math.PI * 12 * 12
    },
    {
        name: 'Ø 28 cm cake pan',
        width: 28,
        height: 28,
        unit: 'cm',
        area: Math.PI * 14 * 14
    },
    {
        name: 'Ø 20 cm cake pan',
        width: 20,
        height: 20,
        unit: 'cm',
        area: Math.PI * 10 * 10
    }
];

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

function injectBanner(state: BakeIQModule) {
    if (document.getElementById('smart-baker-popup')) return;

    const container = document.createElement('div');
    container.id = 'smart-baker-popup';

    const shadow = container.attachShadow({ mode: 'open' });

    // Minimal CSS Reset + Custom Style
    const style = document.createElement('style');
    style.textContent = `${css}`;
    shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'sb-banner';

    const imageUrl = chrome.runtime.getURL('images/logo-2.png');
    const closeIcon = chrome.runtime.getURL('images/close.svg');
    const downArrowIcon = chrome.runtime.getURL('images/down-arrow.svg');

    wrapper.innerHTML = html`
        <button class="close-btn">
            <img src="${closeIcon}" alt="Close" />
        </button>
        <img src="${imageUrl}" alt="Smart Baker" class="logo" />
        <div class="convert-for">
            <span class="recipe-name">${state.getState().recipeName}</span>
            <span class="convert-for-label">Convert for:</span>
            <div class="show-recipe-btn">
                <span id="pan-name">22×33 cm pan</span>
                <span class="dropdown-arrow">
                    <img src="${downArrowIcon}" alt="Down Arrow" class="dropdown-arrow-icon" />
                </span>
                <div class="dropdown-content" id="pan-dropdown">
                    ${userPanSizes.map((pan) => `<span class="dropdown-item" value="${pan.area}">${pan.name}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="converted-ingredients">
            <img src="${chrome.runtime.getURL('images/bg.png')}" alt="Smart Baker" class="bg" />
            <div class="converted-ingredients-scroll">
                <ul>
                    ${state
                        .getState()
                        .convertedIngredients.filter((c) => c.original?.ingredient)
                        .map(
                            (c) =>
                                `<li><span class="ingredient-name">${c.original.ingredient}</span> <span class="converted-value">${c.converted?.value} ${c.converted?.unit}</span></li>`
                        )
                        .join('')}
                </ul>
            </div>
            <div class="converted-ingredients-footer">
                <button class="copy-all-btn" id="go-mobile">Go mobile</button>
                <button class="copy-all-btn" id="copy-all">Copy all</button>
            </div>
            <div class="qr-code-container">
                <img src="${state.getState().qrCode}" alt="QR Code" />
            </div>
        </div>
    `;

    wrapper.querySelector('.show-recipe-btn .dropdown-arrow')?.addEventListener('click', (event) => {
        event.stopPropagation();
        wrapper.querySelector('#pan-dropdown')?.classList.toggle('is-visible');
    });

    wrapper.querySelector('.show-recipe-btn')?.addEventListener('click', (event) => {
        event.stopPropagation();
        wrapper.querySelector('.converted-ingredients')?.classList.toggle('is-visible');
    });

    wrapper.querySelector('#go-mobile')?.addEventListener('click', async () => {
        const qrCode = await QRCode.toDataURL(`http://192.168.50.250:4321/recipe/${state.getState().recipeId}`);
        state.setState({
            qrCode
        });

        wrapper.querySelector('.qr-code-container')?.classList.add('is-visible');
        wrapper.querySelector('.qr-code-container img')?.setAttribute('src', qrCode);
    });

    wrapper.querySelectorAll('.dropdown-item')?.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const value = item.getAttribute('value');
            if (value) {
                const ratio = calculatePanScalingRatio(detectedPanSize, userPanSizes.find((pan) => pan.area === Number(value))!);
                const scaledIngredients = scaleIngredientsByRatio(state.getState().convertedIngredients, ratio);
                state.setState({
                    scaleRatio: ratio,
                    convertedIngredients: scaledIngredients
                });
                const convertedIngredients = wrapper.querySelector('.converted-ingredients ul');
                if (convertedIngredients?.innerHTML) {
                    convertedIngredients.innerHTML = scaledIngredients
                        .filter((c) => c.original?.ingredient)
                        .map(
                            (c, index) =>
                                `<li style="--i: ${index}"><span class="ingredient-name">${c.original.ingredient}</span> <span class="converted-value">${c.converted?.value} ${c.converted?.unit}</span></li>`
                        )
                        .join('');
                    wrapper.querySelector('.converted-ingredients')?.classList.add('is-visible');
                    wrapper.querySelector('#pan-dropdown')?.classList.remove('is-visible');
                    const panNameEl = wrapper.querySelector('#pan-name');
                    if (panNameEl) {
                        panNameEl.textContent = userPanSizes.find((pan) => pan.area === Number(value))?.name || '22×33 cm pan';
                    }
                }
            }
        });
    });

    wrapper.querySelector('.close-btn')?.addEventListener('click', () => {
        container.remove();
    });

    wrapper.querySelector('#copy-all')?.addEventListener('click', () => {
        const ingredients = state
            .getState()
            .convertedIngredients.filter((c) => c.converted?.ingredient)
            .map((c) => `${c.original.quantity} ${c.original.unit} ${c.original.ingredient} → ${c.converted?.value} ${c.converted?.unit}`)
            .join('\n');
        navigator.clipboard.writeText(ingredients);
    });

    shadow.appendChild(wrapper);
    document.body.appendChild(container);
}

interface BakeIQModule {
    getState: () => BakeIQState;
    setState: (partial: Partial<BakeIQState>) => void;
}

const init = async (state: BakeIQModule) => {
    const language = detectLanguage();
    const unitSystem = detectUnitSystem(document.body.innerText);

    if (!shouldShowBanner(language, unitSystem)) {
        console.log('Banner should not be shown');
        return;
    }

    const recipeName = extractRecipeName();

    state.setState({
        recipeName,
        detectedPan: detectedPanSize,
        activePan: userPanSizes[0],
        userSettings: {},
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

    injectBanner(state);
};

type BakeIQState = {
    detectedPan: PanSize | null;
    activePan: PanSize | null;
    userSettings: Record<string, any>;
    convertedIngredients: ConvertedIngredient;
    scaleRatio: number;
    siteUnitSystem: 'metric' | 'imperial' | 'mixed';
    siteLanguage: string;
    qrCode?: string;
    recipeId?: string;
    recipeName?: string;
};

(() => {
    const BakeIQ: BakeIQModule = (() => {
        let state: BakeIQState = {
            detectedPan: null,
            activePan: null,
            userSettings: {},
            convertedIngredients: [],
            scaleRatio: 1,
            siteUnitSystem: 'metric',
            siteLanguage: 'en',
            qrCode: '',
            recipeId: '',
            recipeName: ''
        };

        function setState(partial: Partial<BakeIQState>): void {
            state = { ...state, ...partial };
        }

        function getState(): BakeIQState {
            return state;
        }

        return {
            getState,
            setState
        };
    })();

    (async (state) => {
        await init(state);
    })(BakeIQ);
})();
