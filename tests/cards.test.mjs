import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// --- Minimal browser environment mock (must exist before importing cards) ---
// Cards are plain ES modules that extend HTMLElement, register via
// customElements.define and push into window.customCards at import time.
class MockHTMLElement {}
globalThis.HTMLElement = MockHTMLElement;
globalThis.window = globalThis;

const registered = new Map();
globalThis.customElements = {
  define(tag, cls) {
    registered.set(tag, cls);
  },
};

const DIST = path.resolve('dist');

const CARD_FILES = [
  'babybuddy-add-diaper-card.js',
  'babybuddy-add-feeding-card.js',
  'babybuddy-add-growth-card.js',
  'babybuddy-add-note-card.js',
  'babybuddy-add-sleep-card.js',
  'babybuddy-feedings-card.js',
  'babybuddy-growth-card.js',
  'babybuddy-overview-card.js',
  'babybuddy-sleep-timeline-card.js',
  'babybuddy-timeline-card.js',
];

// Cards whose setConfig explicitly throws when given a falsy config.
const NULL_GUARDED = new Set([
  'babybuddy-feedings-card.js',
  'babybuddy-growth-card.js',
]);

// Import every card so it registers its custom element (side effect).
for (const file of CARD_FILES) {
  await import(pathToFileURL(path.join(DIST, file)).href);
}

// Translations are needed for the translation-helper tests below.
await import(pathToFileURL(path.join(DIST, 'babybuddy-translations.js')).href);

test('every card registers exactly one custom element', () => {
  for (const file of CARD_FILES) {
    const tag = file.replace(/\.js$/, '');
    assert.ok(registered.has(tag), `expected <${tag}> to be registered by ${file}`);
  }
});

for (const file of CARD_FILES) {
  const tag = file.replace(/\.js$/, '');
  const Cls = registered.get(tag);

  test(`${tag}: setConfig accepts an empty config and stores it`, () => {
    const inst = new Cls();
    assert.doesNotThrow(() => inst.setConfig({}));
    assert.ok(inst.config, `${tag} should populate this.config`);
  });

  if (NULL_GUARDED.has(file)) {
    test(`${tag}: setConfig rejects a falsy config`, () => {
      const inst = new Cls();
      assert.throws(() => inst.setConfig(null));
      assert.throws(() => inst.setConfig(undefined));
    });
  } else {
    test(`${tag}: setConfig accepts a missing (undefined) config`, () => {
      const inst = new Cls();
      assert.doesNotThrow(() => inst.setConfig(undefined));
      assert.ok(inst.config, `${tag} should populate this.config from defaults`);
    });
  }
}

test('translations cover all supported languages', () => {
  const langs = ['en', 'nl', 'de', 'fr', 'es', 'sv'];
  for (const l of langs) {
    assert.ok(window.BabyBuddyTranslations?.[l], `missing translations for ${l}`);
  }
});

test('feedings card resolves language and translations', () => {
  const Cls = registered.get('babybuddy-feedings-card');
  const inst = new Cls();
  inst._hass = { language: 'sv' };
  assert.equal(inst._getLanguage(), 'sv');
  const title = inst._t('feedings.title');
  assert.ok(typeof title === 'string' && title.length > 0, 'expected a translation string');
});

test('feedings card pluralizes correctly', () => {
  const Cls = registered.get('babybuddy-feedings-card');
  const inst = new Cls();
  assert.equal(inst._plural(1, 'feeding', 'feedings'), 'feeding');
  assert.equal(inst._plural(2, 'feeding', 'feedings'), 'feedings');
});
