const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('3.3 hero uses genuine glass project screens and direct commercial links', () => {
  const html = read('index.html'), css = read('assets/css/hero-project-simulators-20261118.css');
  assert.match(html, /class="hero hero--cinematic hero--floating-panels hero--project-simulators"/);
  assert.match(html, /<h1 id="hero-title">Soluções digitais/);
  assert.match(html, /hero-projects__card--vitrini/);
  assert.match(html, /hero-projects__card--agenda/);
  assert.match(html, /hero-projects__card--caderneta/);
  assert.match(html, /EXPERIÊNCIA ILUSTRATIVA/);
  assert.doesNotMatch(html, /class="cinema-phone cinema-agenda-panel"/);
  assert.match(html, /href="#produtos">Conheça nossas soluções/);
  assert.match(html, /href="#projetos">Ver projetos em ação/);
  assert.match(html, /cinema33-ledger__link" href="#produtos"/);
  assert.match(css, /backdrop-filter:blur\(20px\)/);
  assert.match(css, /@media \(max-width:600px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(html, /class="film" id="film"/);
});

test('3.3 isolated styles precede the brand palette and do not replace approved layers', () => {
  const html = read('index.html');
  const css = read('assets/css/cinematic-experience-33.css');
  assert.ok(html.indexOf('cinematic-experience-33.css') < html.indexOf('brand-palette.css'));
  assert.match(html, /assets\/css\/hero-cinematic\.css/);
  assert.match(css, /\.hero--cinematic\[data-cinema33-home\]/);
  const refine = read('assets/css/cinematic-hero-refinement-20261113.css');
  const float = read('assets/css/cinematic-floating-panels-20261113.css');
  assert.match(html, /assets\/css\/cinematic-hero-refinement-20261113\.css/);
  assert.match(html, /assets\/css\/cinematic-floating-panels-20261113\.css/);
  assert.match(refine, /#apresentacao/);
  assert.match(float, /\.cinema-float--engreni/);
  assert.match(float, /\.cinema-agenda-panel/);
  assert.ok(html.indexOf('cinematic-floating-panels-20261113.css') < html.indexOf('brand-palette.css'));
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /height:\s*760svh|position:\s*sticky/);
});

test('3.3 offers keyboard-accessible showroom controls without hiding products', () => {
  const html = read('index.html');
  const js = read('assets/js/cinematic-experience-33.js');
  for (const key of ['all', 'vitrini', 'engreni']) {
    assert.match(html, new RegExp('data-cinema33-choice="' + key + '"'));
  }
  assert.match(html, /role="group" aria-label="Destacar família de produtos"/);
  assert.match(html, /data-cinema33-caption aria-live="polite"/);
  assert.match(js, /setAttribute\('aria-pressed'/);
  assert.match(js, /showroom\.hidden = false/);
  // Reduced-motion handling moved to the single hero pointer controller in Lote B.
  const heroMotion = read('assets/js/hero-cinematic.js');
  assert.match(heroMotion, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /\.hidden\s*=\s*true/);
});

test('approved cases, contents and mobile navigation remain in the page', () => {
  const html = read('index.html');
  for (const label of ['Tornearia Barbosa', 'New Rocket Play', 'Dayane Cunha Nails']) {
    assert.ok(html.includes(label));
  }
  assert.match(html, /id="conteudos"/);
  assert.match(html, /class="menu-toggle"/);
  // RITMO was intentionally moved from Home to the experimental product catalog.
  assert.doesNotMatch(html, /id="ritmo"/);
  assert.match(html, /href="solucoes\.html#ritmo-produto"/);
  assert.match(read('solucoes.html'), /id="ritmo-produto"/);
});

test('3.3 Home balances the dark technological showroom with human editorial sections', () => {
  const html = read('index.html');
  const css = read('assets/css/cinematic-editorial-33.css');
  assert.match(css, /section#produtos\.section/);
  assert.match(css, /--section-rule-soft:\s*rgba\(var\(--mist-blue-rgb\)/);
  assert.match(css, /section#produtos\.section[\s\S]*?background:\s*var\(--ink-deep\)/);
  assert.match(css, /section#produtos\.section[\s\S]*?\.cinema33-showroom__choices button\[aria-pressed="true"\]/);
  assert.match(css, /section#contato\.section[\s\S]*?\.contact-note a\.migration-link/);
  for (const anchor of ['problemas', 'modelo', 'produtos', 'projetos', 'sobre', 'conteudos', 'contato']) {
    assert.match(html, new RegExp('id="' + anchor + '"'));
  }
  assert.match(html, /href="#produtos">Conheça nossas soluções/);
});
