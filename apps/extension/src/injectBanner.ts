import type { BakeIQModule } from './state/BakeIQ.module';
import css from './banner.css?inline';
import { calculatePanScalingRatio, scaleIngredientsByRatio } from './utils/scale';
import { html } from './utils/html';
import QRCode from 'qrcode';

export const Banner = (state: BakeIQModule) => {
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
                <span id="pan-name">${state.getState().activePan?.name}</span>
                <span class="dropdown-arrow">
                    <img src="${downArrowIcon}" alt="Down Arrow" class="dropdown-arrow-icon" />
                </span>
                <div class="dropdown-content" id="pan-dropdown">
                    ${state
                        .getState()
                        .userSettings.panSizes!.map((pan) => `<span class="dropdown-item" value="${pan.name}">${pan.name}</span>`)
                        .join('')}
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
                const ratio = calculatePanScalingRatio(state.getState().detectedPan!, state.getState().activePan!);
                const scaledIngredients = scaleIngredientsByRatio(state.getState().convertedIngredients, ratio);
                state.setState({
                    scaleRatio: ratio,
                    activePan: state.getState().userSettings.panSizes?.find((p) => p.name === value),
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
                        panNameEl.textContent = state.getState().activePan?.name || 'No pan selected';
                    }
                }
            }
        });
    });

    wrapper.querySelector('.close-btn')?.addEventListener('click', () => {
        wrapper.remove();
    });

    wrapper.querySelector('#copy-all')?.addEventListener('click', () => {
        const ingredients = state
            .getState()
            .convertedIngredients.filter((c) => c.converted?.ingredient)
            .map((c) => `${c.original.quantity} ${c.original.unit} ${c.original.ingredient} → ${c.converted?.value} ${c.converted?.unit}`)
            .join('\n');
        navigator.clipboard.writeText(ingredients);
    });

    return wrapper;
};

export const injectBanner = (state: BakeIQModule) => {
    if (document.getElementById('smart-baker-popup')) return;

    const container = document.createElement('div');
    container.id = 'smart-baker-popup';

    const shadow = container.attachShadow({ mode: 'open' });

    // Minimal CSS Reset + Custom Style
    const style = document.createElement('style');
    style.textContent = `${css}`;
    shadow.appendChild(style);

    shadow.appendChild(Banner(state));
    document.body.appendChild(container);

    return shadow;
};
