# GitHub Copilot instructions

This repository is **lovelace-babybuddy**: custom Home Assistant Lovelace cards (plain ES modules
in `dist/`) that visualize BabyBuddy REST data. HACS serves `dist/` directly, so it is committed on
purpose.

## How to work here

- **Commits:** follow [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`,
  `docs:`, `refactor:`, `perf:`, `test:`, `chore:`. Breaking changes use `!` or a `BREAKING CHANGE:`
  footer. Releases are automated by **release-please**; never hand-edit `CHANGELOG.md`, `version.txt`,
  or `.release-please-manifest.json`.
- **Cards:** each is a `class extends HTMLElement` in `dist/babybuddy-<name>-card.js`, ending with
  `customElements.define('babybuddy-<name>-card', Class)` and a `window.customCards` descriptor.
  Normalize config in `setConfig` (do not render there) and render from the `set hass` setter /
  `connectedCallback`. Use `this._t('path')` for all strings and keep `babybuddy-translations.js`
  (en, nl, de, fr, es, sv) in sync. No build step, no dependencies, no framework.
- **Tests:** run `npm test` (Node, mocked browser globals). It checks each card registers its element
  and that `setConfig`/`_t` behave. No browser needed.

See `CLAUDE.md` for full guidance.
