const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');

test('LOTE B: cinematic film repaints only on scroll/pointer/resize events',()=>{
  const script=read('assets/js/cinematic-film-intro-33.js');
  assert.match(script,/function requestPaint\(\)/);
  assert.match(script,/window\.addEventListener\('scroll',requestPaint/);
  assert.match(script,/film\.addEventListener\('pointermove'/);
  assert.match(script,/lastProgress/);
  assert.match(script,/Math\.sin\(p\*12\+i\*1\.7\)/);
  assert.doesNotMatch(script,/raf\s*=\s*requestAnimationFrame\(loop\)/);
  assert.doesNotMatch(script,/function loop\(/);
  assert.match(script,/document\.addEventListener\('dayslume:motion'/);
  assert.match(script,/document\.hidden/);
});
test('LOTE B: reduced motion remains static, and the five scenes are untouched',()=>{
  const script=read('assets/js/cinematic-film-intro-33.js');
  const css=read('assets/css/cinematic-film-intro-33.css');
  const html=read('index.html');
  assert.match(script,/if \(reduce\.matches\)/);
  assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css,/height:\s*600svh/);
  assert.match(css,/height:\s*390svh/);
  assert.equal((html.match(/data-c33-caption/g)||[]).length,5);
  assert.match(html,/href="#apresentacao">PULAR ABERTURA/);
  assert.match(html,/id="cinema33-film"/);
  assert.match(html,/data-cinema33-home/);
});
test('LOTE B: one pointer controller drives hero depth and atmosphere',()=>{
  const threeD=read('assets/js/hero-cinematic.js');
  const showroom=read('assets/js/cinematic-experience-33.js');
  assert.match(threeD,/--cinema-shift-x/);
  assert.match(threeD,/--cinema-shift-y/);
  assert.match(threeD,/--cinema33-pointer-x/);
  assert.match(threeD,/--cinema33-pointer-y/);
  assert.match(threeD,/requestAnimationFrame\(paint\)/);
  assert.doesNotMatch(showroom,/addEventListener\('pointermove'/);
  assert.match(showroom,/data-cinema33-choice/);
  assert.match(showroom,/aria-pressed/);
});
test('LOTE B: existing editorial scroll does not render under full-screen film',()=>{
  const code=read('assets/js/hero-prism-scroll.js');
  assert.match(code,/const openingFilm = cinematic/);
  assert.match(code,/openingFilm\.getBoundingClientRect\(\)\.bottom > innerHeight/);
  assert.match(code,/scrollCards\(\)/);
  assert.match(code,/scrollProcess\(\)/);
});
