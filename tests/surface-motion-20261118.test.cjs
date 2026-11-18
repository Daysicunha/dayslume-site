/* DAYSLUME — selective Claude prototype adoption (18 Nov 2026).
 * Guards approved effects while leaving Hero and opening animation unchanged.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const read = file => readFileSync(join(__dirname, '..', file), 'utf8');

test('glass reflections stay subtle, decorative, and inside the existing sections', () => {
  const css = read('assets/css/cinematic-editorial-33.css');
  assert.match(css, /#problemas\.section \.manifest-item::after/);
  assert.match(css, /#produtos\.section \.solutions-grid > \.solution-card::after/);
  assert.match(css, /pointer-events:none;/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);
});

test('premium microinteractions use a 3px rise and official peach token', () => {
  const css = read('assets/css/cinematic-editorial-33.css');
  assert.match(css, /#projetos\.section \.projects-grid--launch \.project-card\.flagship-case:is\(:hover,:focus-within\) \{\s*transform:translateY\(-3px\)/);
  assert.match(css, /#produtos\.section \.solutions-grid > \.solution-card:is\(:hover,:focus-within\) \{\s*transform:translateY\(-3px\)/);
  assert.match(css, /border: 1px solid rgba\(var\(--peach-rgb\),\.6\)/);
});

test('editorial stagger reuses the original one-shot observer', () => {
  const js = read('assets/js/home-premium.js');
  assert.match(js, /new IntersectionObserver\(/);
  assert.match(js, /reveal\('\.manifest-item', 90, 240\)/);
  assert.doesNotMatch(js, /setInterval\(/);
});

test('existing performance modules remain responsible for ambient motion', () => {
  for (const module of [
    'assets/js/modelo-motion.js',
    'assets/js/products-showroom-motion.js',
    'assets/js/cases-showroom-motion.js',
    'assets/js/founder-cinematic-motion.js',
    'assets/js/contents-cinematic-motion.js',
    'assets/js/contact-cinematic-motion.js'
  ]) {
    const js = read(module);
    assert.match(js, /IntersectionObserver/);
    assert.match(js, /prefers-reduced-motion/);
  }
  const hero = read('assets/js/hero-cinematic.js');
  assert.match(hero, /requestAnimationFrame\(paint\)/);
});
