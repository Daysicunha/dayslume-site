const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const home = read('index.html');
const editorial = read('assets/css/cinematic-editorial-33.css');
const floating = read('assets/css/cinematic-floating-panels-20261113.css');
const refinement = read('assets/css/cinematic-hero-refinement-20261113.css');
const film = read('assets/css/cinematic-film-intro-33.css');
const palette = read('assets/css/brand-palette.css');
const showroom = read('assets/js/cinematic-experience-33.js');

function token(name) {
  const m = palette.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})\\s*;'));
  assert.ok(m, 'Official brand token ' + name + ' must exist');
  return m[1];
}
function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(part => parseInt(part, 16) / 255);
  const linear = rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

test('Tech Editorial: official light/dark text pairs meet WCAG AA contrast', () => {
  const ink = token('ink-deep');
  const ivory = token('warm-ivory');
  const mist = token('mist-blue');
  const peach = token('peach');
  const plum = token('plum-mineral');
  for (const [fg,bg] of [[ivory,ink],[ink,ivory],[mist,ink],[peach,ink],[ink,mist],[ivory,plum]]) {
    assert.ok(contrast(fg,bg) >= 4.5, fg + ' / ' + bg + ' needs 4.5:1');
  }
});

test('Tech Editorial: approved 13/11 3D panels and newer conversion CTAs coexist', () => {
  assert.match(home, /class="hero hero--cinematic hero--floating-panels"/);
  for (const name of ['vitrini','engreni','service']) {
    assert.ok(home.includes('class="cinema-float cinema-float--' + name + '"'));
  }
  assert.match(home, /class="cinema-phone cinema-agenda-panel"/);
  assert.doesNotMatch(home, /class="cinema-phone-notch"/);
  assert.match(home, /href="#contato">Conversar sobre meu projeto/);
  assert.match(home, /href="#projetos">Ver projetos realizados/);
  assert.match(home, /class="hero-rotator"/);
  assert.match(home, /id="cinema33-film"/);
});

test('Tech Editorial: CSS order keeps official palette canonical and both 3D layers active', () => {
  const urls = [...home.matchAll(/href="(assets\\/css\\/[^"]+\\.css)"/g)].map(x=>x[1]);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.at(-1),'assets/css/brand-palette.css');
  for (const name of ['cinematic-hero-refinement-20261113.css','cinematic-floating-panels-20261113.css']) {
    const css = 'assets/css/' + name;
    assert.ok(urls.includes(css),css);
    assert.ok(urls.indexOf(css) < urls.indexOf('assets/css/brand-palette.css'));
  }
  assert.match(refinement, /#apresentacao/);
  assert.match(floating, /#apresentacao/);
});

test('Tech Editorial: responsive hero panels have dedicated tablet and small-phone layouts', () => {
  for (const bp of ['1180px','760px','600px','380px']) {
    assert.ok(floating.includes('@media (max-width: ' + bp + ')'), 'floating panels breakpoint: ' + bp);
  }
  for (const bp of ['560px','360px']) {
    assert.ok(refinement.includes('@media (max-width: ' + bp + ')'), 'headline/CTA breakpoint: ' + bp);
  }
  assert.match(floating, /\.cinema-float--engreni/);
  assert.match(floating, /\.cinema-float--service/);
  assert.match(floating, /\.cinema-cluster/);
});

test('Tech Editorial: reduced motion is supported for film, 3D panels and basic hero', () => {
  assert.match(film, /prefers-reduced-motion:\s*reduce/);
  assert.match(floating, /prefers-reduced-motion:\s*reduce/);
  assert.match(refinement, /prefers-reduced-motion:\s*reduce/);
  const js = read('assets/js/hero-cinematic.js');
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /reduced\.matches/);
});

test('Tech Editorial: showroom is readable, keyboard operable and never hides product links', () => {
  for (const key of ['all','vitrini','engreni']) {
    assert.ok(home.includes('data-cinema33-choice="' + key + '"'));
  }
  assert.match(home, /role="group" aria-label="Destacar família de produtos"/);
  assert.match(home, /data-cinema33-caption aria-live="polite"/);
  assert.match(showroom, /setAttribute\('aria-pressed'/);
  assert.match(showroom, /showroom\.hidden = false/);
  assert.doesNotMatch(showroom, /card\.hidden\s*=|\.remove\(\)/);
  assert.match(editorial, /\.cinema33-showroom__choices button:focus-visible/);
  assert.match(editorial, /\.cinema33-showroom__choices button\[aria-pressed="true"\]/);
  assert.match(editorial, /section#produtos\.section/);
  assert.match(editorial, /background:\s*var\(--ink-deep\)/);
  assert.match(home, /href="solucoes\.html#ritmo-produto"/);
});

test('Tech Editorial: contact stays navigable; disabled form is not activated by styling', () => {
  assert.match(home, /class="contact-form" id="contact-form" hidden/);
  assert.match(home, /<button class="btn btn-navy" type="button" disabled>/);
  assert.match(home, /class="contact-note"><a class="migration-link" href="https:\/\/wa\.me\//);
  assert.match(editorial, /\.contact-form button\.btn:not\(:disabled\)/);
});
