import { extractIngredientLinesFromPage } from "./utils/extractIngredients"
import { parseIngredientsFromAPI } from "./utils/parseIngredientsFromAPI";


async function runSmartParsing() {
  const scored = extractIngredientLinesFromPage();

  console.log("Scored lines:", scored);

  const topLines = scored
    .map((l) => l.line);

  const parsed = await parseIngredientsFromAPI(topLines);

  console.log("Parsed ingredients:", parsed);
}

function scrollToRecipe() {
  const keywords = ["ingredients", "instructions", "directions", "recipe"];
  const selectors = ["h1", "h2", "h3", "section", "div", "article"];

  for (const sel of selectors) {
    const elements = Array.from(document.querySelectorAll(sel));
    for (const el of elements) {
      const text = el.textContent?.trim().toLowerCase() ?? "";
      if (
        keywords.some((kw) => text.includes(kw)) &&
        el.getBoundingClientRect().top > 100 // avoid headers
      ) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
  }

  // Fallback: try Schema.org
  const recipeRoot = document.querySelector('[itemtype*="schema.org/Recipe"]');
  if (recipeRoot) {
    recipeRoot.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function injectBanner() {
  if (document.getElementById("sb-root")) return;

  const container = document.createElement("div");
  container.id = "sb-root";
  container.style.position = "fixed";
  container.style.top = "16px";
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
      background: #fff8f2;
      color: #3d3d3d;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-family: system-ui, sans-serif;
      padding: 12px;
      width: 280px;
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .sb-header {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .sb-description {
      font-size: 12px;
      opacity: 0.75;
      margin-bottom: 8px;
    }
    .sb-btn {
      background-color: #f472b6;
      color: white;
      padding: 4px 10px;
      font-size: 13px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .sb-btn:hover {
      background-color: #ec4899;
    }
  `;
  shadow.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.className = "sb-banner";

  wrapper.innerHTML = `
    <div class="sb-header">🧁 Imperial units detected</div>
    <button class="sb-btn" id="sb-jump-btn">Jump to recipe</button>
  `;

  wrapper.querySelector("#sb-jump-btn")?.addEventListener("click", () => {
    scrollToRecipe();
  });

  shadow.appendChild(wrapper);
  document.body.appendChild(container);
}

injectBanner();
runSmartParsing();