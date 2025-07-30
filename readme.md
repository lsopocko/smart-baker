# 🧁 BakeIQ — Smart Baking Assistant for the Web

**BakeIQ** is a Chrome extension and companion web app that intelligently parses and converts recipe ingredient lists across the web. It helps you quickly convert imperial units to metric (and vice versa), resize ingredients based on different pan sizes, and even sync your shopping list to your phone.

## 🚧 Work In Progress

> ⚠️ **This project is a work in progress.**  
> Please **use it with caution** and **always double-check** the original and converted ingredient list to ensure all values make sense and nothing is missing. We're actively improving the parser and UI.

## Features

- 🧠 AI-powered ingredient parser (English only)
- 📐 Unit conversion (Imperial ↔ Metric)
- 🍰 Pan size adjustments
- 📱 Sync with mobile via QR code
- 🔌 Chrome extension for seamless integration on recipe websites
- 🧪 Local NLP API (FastAPI) for full control


---

## 🛠️ Tech Stack

| Component        | Tech                                         |
|------------------|----------------------------------------------|
| Extension UI     | Vanilla JS / TS + TailwindCSS                |
| Extension Popup  | React + TypeScript                           |
| Recipe Parsing   | Python (FastAPI + Ingredient Parser / Heuristics) |
| Web Companion    | Astro + TailwindCSS                          |
| Shared State     | Chrome Storage + Message Passing             |
| Localization     | Custom Unit Registry per Locale              |

---

## 🚀 Quick Start (Dev)

To start website

```bash
pnpm install
pnpm dev:web
```

To start python NLP ingredient parser api:

```bash
pnpm dev:nlp
```

To start the extension: 

```bash
pnpm dev:extension
```

