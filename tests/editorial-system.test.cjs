const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const palette = fs.readFileSync(path.join(root, 'assets', 'css', 'brand-palette.css'), 'utf8');
const sharedMotion = fs.readFileSync(path.join(root, 'assets', 'js', 'dayslume-motion.js'), 'utf8');
const heroMotion = fs.readFileSync(path.join(root, 'assets', 'js', 'hero-flower.js'), 'utf8');

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '.git' ? [] : htmlFiles(target);
    return entry.name.endsWith('.html') ? [target] : [];
  });
}

test('home uses one ordered editorial eyebrow for each internal section', () => {
  const numbers = [...home.matchAll(/section-eyebrow__number["'][^>]*>(\d{2})</g)].map((match) => match[1]);
  assert.deepEqual(numbers, ['01', '02', '03', '04', '05', '06', '07', '08']);
});

test('home sections use distinct atmosphere variants', () => {
  for (const variant of ['manifest', 'structure', 'network', 'frame', 'path', 'editorial', 'about', 'contact']) {
    assert.match(home, new RegExp(`section-atmosphere--${variant}`));
    assert.match(palette, new RegExp(`section-atmosphere--${variant}`));
  }
});

test('shared system includes responsive and reduced-motion safeguards', () => {
  assert.match(palette, /--section-max:\s*1320px/);
  assert.match(palette, /overflow:\s*clip/);
  assert.match(palette, /env\(safe-area-inset-bottom\)/);
  assert.match(palette, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.equal((home.match(/editorial-divider/g) || []).length, 3);
});

test('floating contact control uses the DAYSLUME text treatment', () => {
  assert.match(palette, /content:\s*"Fale com a gente"/);
  assert.match(palette, /\.floating-whatsapp:hover[\s\S]*background:\s*var\(--plum-mineral\)/);
  assert.doesNotMatch(palette, /\.floating-whatsapp[^}]*#25d366/i);

  for (const page of htmlFiles(root)) {
    const source = fs.readFileSync(page, 'utf8');
    assert.equal((source.match(/class=["']floating-whatsapp["']/g) || []).length, 1, path.relative(root, page));
  }
});

test('floating contact control retracts near contact and footer content on every page', () => {
  assert.match(sharedMotion, /#contato, #solicitar, \.contact-form/);
  assert.match(sharedMotion, /\.site-footer, \.footer/);
  assert.match(sharedMotion, /is-context-hidden/);
  assert.match(palette, /\.floating-whatsapp\.is-context-hidden/);
  assert.match(palette, /@media\s*\(max-width:\s*620px\)[\s\S]*\.floating-whatsapp::after\s*\{\s*display:\s*none/);
});

test('hero video keeps autoplay while retaining the compressed fallback', () => {
  assert.match(home, /<video\b[^>]*\sautoplay(?:\s|>)/i);
  assert.match(home, /<video\b[^>]*preload=["']auto["']/i);
  assert.match(home, /poster=["']assets\/images\/dayslume-hero-atmosphere\.webp["']/i);
  assert.match(heroMotion, /navigator\.connection\?\.saveData/);
});
