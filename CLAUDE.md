# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Closer** is a single-device, in-person party game: a group (4–10 people) passes one phone around and answers escalating questions to climb a "Closeness" meter. It's a **pure static site** — no framework, no build step, no package.json, no tests. Everything is plain HTML/CSS/vanilla JS served from `public/`.

## Running & deploying

- **Run locally:** open `public/index.html` directly (`file://`) or serve it: `python3 -m http.server -d public`. There is nothing to build or compile — edit a file, reload the browser.
- **Deploy:** Cloudflare Pages with output dir `public/` (auto-deploys on push to `main`). Access is gated by a Cloudflare Access email-OTP policy configured entirely in the Cloudflare dashboard — **not in code**. See `docs/DEPLOY_PLAN.md` for the full setup.
- `.assetsignore` controls what Cloudflare uploads; it excludes `docs`, `*.md`, and tooling. Only the four files in `public/` ship.

## Architecture

Three files in `public/`, loaded in order by `index.html`:

1. **`questions.js`** — pure data, no logic. Global consts: `BANK` (questions in three tiers: `warm`/`deep`/`deepest`), `ZH` (Traditional-Chinese translations **keyed by the exact English string**), `DARES` (per-tier dare deck), `INTENSE_DEEPEST` (subset of deepest questions filtered out when "gentler prompts" is on).
2. **`script.js`** — all game logic (~1200 lines, organized by `/* ====== section ====== */` banners). Loaded with a plain `<script>` tag, so everything is global; relies on load order (questions.js first).
3. **`styles.css`** — theming driven by `document.body.dataset.tier` (`1`/`2`/`3`), set by `setTierTheme()` as play progresses.

### The settings/mode system (the core abstraction)

`DEFAULT_SETTINGS` is the **"Classic" ruleset**. Every other mode in `PRESETS` (gentle, party, deepdive, free, heroes) is a *partial override* merged over it via `mergeSettings`/`settingsForMode`. `MODE_LIST` drives the mode chips; `SETTINGS_SCHEMA` declaratively drives the entire settings drawer UI (each row → a control built by `buildControl`). Settings keys can be dotted paths (`"tiers.warm"`, `"draw.deep"`) resolved by `getKey`/`setKey`.

**When adding a setting:** add it to `DEFAULT_SETTINGS`, add a row to `SETTINGS_SCHEMA`, and read `settings.yourKey` where it takes effect. Live changes flow through `onSettingChange` → `applySettings`. Adding a *mode* is just a new `PRESETS` entry + `MODE_LIST` item.

### Game flow & state

Two state objects, deliberately separated:
- **`state`** — persisted (see Persistence). Holds `used` (questions seen across sessions, so sessions don't repeat), `sessions` count, `people`, and `settings`.
- **Module-level session vars** (`cards`, `pos`, `order`, `score`, `streak`, `passBudget`, etc.) — the *current* session only, **not persisted**; reset by `startSession`.

The four `<section class="stage">` views (`setup`, `play`, `seam`, `end`) are toggled by `show()`. `buildDeck` draws cards from each enabled tier; `advance()` steps through them, inserting tier-transition "seams" (`SEAMS`) and bonus cards at meter unlock levels. The pass/dare flow (`openDare` → choose group/app dare → `dareDid`/`dareFail`) is the most intricate part.

### Pass-budget mechanic

The signature rule: the whole circle **shares** a shrinking pass budget (`passBudgetSeq` default `[3,2,1,0]`). Passing keeps the meter climbing until the budget runs out; the next pass then **wipes the meter to zero** (`meterResetOnBudgetOut`), and the budget refills smaller each time. Logic lives in `initBudget`/`refillBudget`/`openDare`/`renderMeter`.

### Heroes & Chickens mode

`dualQuestion: true` shows two questions per card; the player picks one (`renderChoicePanel` / `#choicePanel`) instead of the normal single-question view.

### Persistence

`loadState`/`saveState` go through `window.storage` — a host-provided async API (`.get(k)` returns `{value}`, `.set(k,v)`). A **localStorage shim** (`script.js` ~line 253) supplies it when absent, so the site works standalone. Storage key is `closer-group-v2`; `loadState` migrates from the older `v1` shape. State is JSON-serialized; **keep it plain-serializable**.

### i18n note

Translations are keyed by the literal English question string (`ZH[q]`). **If you edit a question's English text, update its `ZH` key to match** or the translation silently breaks (falls back to "（暫無翻譯）").

### Conventions

- `const $ = (id) => document.getElementById(id)` is the DOM accessor used everywhere.
- DOM is built via `innerHTML` string templates; element IDs in `index.html` are the contract between markup and `script.js`.
- Settings are **locked during a session**: the gear button is disabled in `play`/`seam` views (`show()` at `script.js:423`).
