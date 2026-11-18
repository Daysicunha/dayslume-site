const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

const html = read('index.html');
const filmCss = read('assets/css/cinematic-film-intro-33.css');
const motion = read('assets/js/cinematic-film-intro-33.js');

test('the five approved film scenes and the original 3D Hero remain in place', () => {
  assert.match(html, /id="cinema33-film"/);
  assert.equal((html.match(/data-c33-caption/g) || []).length, 5);
  assert.match(html, /id="apresentacao"[^>]*data-hero-master="true"|data-hero-master="true"[^>]*id="apresentacao"/);
  assert.match(html, /class="hero hero--cinematic hero--floating-panels hero--project-simulators"/);
});

test('handoff shares the existing passive scroll frame and no perpetual animation loop', () => {
  assert.match(motion, /function updateHandoff\(force = false\)/);
  assert.match(motion, /window\.addEventListener\('scroll',requestPaint,\{passive:true\}\)/);
  assert.match(motion, /requestAnimationFrame\(paint\)/);
  assert.match(motion, /updateHandoff\(\);/);
});

test('hero reveal is disabled with reduced motion, data saver, or paused animation', () => {
  assert.match(motion, /reduce\.matches \|\| saveData \|\|/);
  assert.match(motion, /classList\.contains\('motion-paused'\)/);
  assert.match(motion, /const panels = motionOff \? 1/);
  assert.match(motion, /const copy = motionOff \? 1/);
  assert.match(filmCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(filmCss, /#cinema33-film \.c33-pin::before \{ display: none; \}/);
});

test('hero remains visible without JS and already visible via direct anchor', () => {
  assert.match(motion, /if \(hero\) \{\s*updateHandoff\(true\);\s*document\.body\.classList\.add\('c33-handoff-ready'\)/);
  assert.match(filmCss, /body\.home-page\.c33-handoff-ready #apresentacao\.hero--cinematic \.hero-content/);
  assert.match(motion, /const entry = clamp\(\(vh - bounds\.bottom\)/);
  assert.match(filmCss, /--c33-handoff-copy, 1/);
});

test('one-pixel seam and Hero atmosphere use official mineral plum and peach', () => {
  assert.match(filmCss, /#cinema33-film \.c33-pin::before \{[^}]*height: 1px/s);
  assert.match(filmCss, /--c33-seam-opacity/);
  assert.match(filmCss, /--c33-seam-scale/);
  assert.match(filmCss, /--plum-mineral-rgb/);
  assert.match(filmCss, /--peach-rgb/);
  assert.match(motion, /seam \* \(1 - ease\(entry \/ \.26\)\)/);
});

test('final scene guides the visitor onward without adding a sixth scene', () => {
  assert.match(motion, /CONTINUE PARA CONHECER/);
  assert.match(motion, /ROLE PARA EXPLORAR/);
  assert.doesNotMatch(html, /id="cinema33-film-secondary"/);
});
