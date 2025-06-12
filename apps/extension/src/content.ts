import { extractIngredientLinesFromPage } from "./utils/extractIngredients"
import { parseIngredientsFromAPI } from "./utils/parseIngredientsFromAPI";
import { convertToMetric, type ConversionResult } from "./utils/convert";

type ConvertedIngredient = {
  original: string;
  converted: ConversionResult | null;
}[];

async function runSmartParsing() {
  const scored = extractIngredientLinesFromPage();

  const topLines = scored
    .map((l) => l.line);

  const parsed = await parseIngredientsFromAPI(topLines);

  const converted: ConvertedIngredient = parsed.map((p) => {
    if (p.quantity && p.unit && p.ingredient) {
      return {
        original: p.input,
        converted: convertToMetric(p.quantity, p.unit, p.ingredient),
      };
    }
    return {
      original: p.input,
      converted: null,
    };
  });

  chrome.runtime.sendMessage({
    type: "SMART_BAKER_CONVERSIONS",
    payload: converted,
  });

  return converted;
}

function injectBanner(converted: ConvertedIngredient) {
  if (document.getElementById("smart-baker-popup")) return;

  const container = document.createElement("div");
  container.id = "smart-baker-popup";
  container.style.position = "fixed";
  container.style.bottom = "16px";
  container.style.right = "16px";
  container.style.zIndex = "999999";

  const shadow = container.attachShadow({ mode: "open" });

  // Minimal CSS Reset + Custom Style
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
    }
      .sb-banner {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 999999;

  background-color: #FFF0D3; /* cupcake cream (base-100) */
  color: #3d2c29;            /* chocolate text */
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  font-family: 'Segoe UI', sans-serif;
  min-width: 280px;
  max-width: 400px;

  padding: 16px;
  font-size: 14px;
  line-height: 1.5;

  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.sb-banner h2 {
  font-size: 16px;
  font-weight: bold;
  color: #ec6b1a; /* primary orange */
  margin: 0;
}

.sb-banner ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.sb-banner li {
  background: #ffe5b4; /* light warm accent */
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 500;
  color: #3d2c29;
  box-shadow: inset 0 1px 0 #ffffff44;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sb-banner .close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #3d2c29;
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sb-banner .logo {
  width: 128px;
  height: 128px;
  margin-bottom: 8px;
}

.sb-banner .show-recipe-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #3d2c29;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 8px;
}

.sb-banner .converted-ingredients {
  display: none;
  max-height: 200px;
  overflow-y: scroll;
  padding-right: 16px;
}

.sb-banner .converted-ingredients .converted-value {
  font-size: 16px;
  color: #3d2c29;
  font-weight: normal;
  border-radius: 8px;
  background-color: #3d2c29;
  color: #FFF0D3;
  padding: 4px 8px;
  position: relative;
  top: -2px;
  bottom: -2px;
  margin-left: 8px;
}

.sb-banner .converted-ingredients.is-visible {
  display: block;
}
  `;
  shadow.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.className = "sb-banner";
  const imageUrl = chrome.runtime.getURL("images/logo.png");

  console.log('imageUrl', imageUrl);

  wrapper.innerHTML = `
  <button class="close-btn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
    </svg>
  </button>
    <img src="${imageUrl}" alt="Smart Baker"  class="logo"/>
    <button class="show-recipe-btn">Show converted ingredients</button>
    <div class="converted-ingredients">
      <ul>
        ${converted.map((c) => `<li>${c.original} <span class="converted-value">${c.converted?.value} ${c.converted?.unit}</span></li>`).join("")}
      </ul>
    </div>
  `;

  wrapper.querySelector(".show-recipe-btn")?.addEventListener("click", () => {
    wrapper.querySelector(".converted-ingredients")?.classList.add("is-visible"); 
  });

  wrapper.querySelector(".close-btn")?.addEventListener("click", () => {
    container.remove();
  });

  shadow.appendChild(wrapper);
  document.body.appendChild(container);
}

const init = async() => {
  const converted = await runSmartParsing();
  injectBanner(converted);
}

init();