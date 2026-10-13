# CLAUDE.md — Guidance for LLM assistants working on this repo

This is the **lovelace-babybuddy** repository: a set of custom Home Assistant
Lovelace cards that visualize data from the [BabyBuddy](https://github.com/babybuddy/babybuddy)
REST API (weight/height/head growth, feedings, diapers, sleep, notes).

## Repository layout

- `dist/` — the **shipped** card sources. These are plain ES modules (browser `type: module`)
  that extend `HTMLElement` and register a custom element. **This folder is committed on purpose**
  because HACS serves these files directly; do not delete or gitignore it.
- `dist/lovelace-babybuddy.js` — a barrel module that imports every card; this is the only file
  HA needs to load.
- `dist/babybuddy-translations.js` — a global `BabyBuddyTranslations` object (en, nl, de, fr, es, sv)
  consumed by the cards via `window.BabyBuddyTranslations`.
- `config/`, `babybuddy-config/` — example Home Assistant / BabyBuddy configuration.
- `docs/` — images and documentation assets.
- `scripts/` — local helpers only (`release.sh`, `deploy_to_k3s.sh`, `start_ha.sh`). Not run in CI.
- `.github/workflows/` — `release-please.yml` (releases) and `ci.yml` (tests).

## Card conventions (follow these when editing/adding cards)

- Each card is a single class `extends HTMLElement` defined in its own `dist/babybuddy-<name>-card.js`.
- At the bottom of the file call `customElements.define('babybuddy-<name>-card', Class)` and push a
  descriptor into `window.customCards` so it shows up in the HA editor.
- Implement `setConfig(config)` to validate and normalize the config (throw on a missing config for
  data cards; default safely for form cards). Do **not** render directly inside `setConfig` — store
  `this.config` and render from the `set hass(hass)` setter / `connectedCallback`.
- Use `this._t('some.path')` for all user-facing strings and keep translations in
  `babybuddy-translations.js` (add the key for all six languages). Do not hardcode English strings
  in the cards.
- Charts use ApexCharts, loaded from CDN (with a documented local fallback). Do not bundle it.
- Keep cards dependency-free and framework-free; no build step exists.

## Commits & releases (important)

- Use **Conventional Commits** (semantic commits): `feat:`, `fix:`, `docs:`, `refactor:`,
  `perf:`, `test:`, `chore:`. Use `!` or a `BREAKING CHANGE:` footer for breaking changes.
- Releases are fully automated by **release-please** from the commit history — never bump versions,
  edit `CHANGELOG.md`, `version.txt`, or `.release-please-manifest.json` by hand.
- When adding a feature or fix, write the commit so the generated changelog reads well.

## Testing

- Run `npm test` (Node, no browser). It loads each card with mocked `HTMLElement`/`customElements`/
  `window` globals, asserts every card registers its element, that `setConfig` behaves, and that
  translations cover all languages.
- Adding a new card requires no new test wiring beyond the `CARD_FILES` list in
  `tests/cards.test.mjs` (and a null-guard entry if `setConfig` throws on missing config).
- There is no bundler/linter config; keep the code readable and consistent with the existing cards.

## Other guidance

- Prefer editing existing cards over creating new files.
- Keep `dist/` changes minimal and focused; large refactors should be their own PR.
- Document new card options in `README.md` and add example YAML.
