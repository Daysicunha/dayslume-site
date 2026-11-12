const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('Claude cinematic film appears before the existing 3D hero on first load', () => {
  const html=read('index.html');
  assert.match(html, /id="cinema33-film"/);
  assert.match(html, /data-c33-window/);
  assert.match(html, /data-c33-title/);
  assert.ok(html.indexOf('id="cinema33-film"') < html.indexOf('data-cinema33-home'));
  for (const label of ['VITRINI','ENGRENI','CENA 1 · ABERTURA','ROLE PARA ASSISTIR']) assert.ok(html.includes(label));
  assert.match(html, /href="#apresentacao">PULAR ABERTURA/);
});
test('film has exactly five captions, the split interface shapes and scene mapping',()=>{
  const html=read('index.html');
  const filmJS=read('assets/js/cinematic-film-intro-33.js');
  const section=html.slice(html.indexOf('id="cinema33-film"'),html.indexOf('data-cinema33-home'));
  assert.equal((section.match(/data-c33-caption/g)||[]).length,5);
  for(const name of ['ABERTURA','NECESSIDADE','PRESENÇA','OPERAÇÃO','CONTATO']) assert.ok(filmJS.includes(name));
  assert.match(filmJS,/const D = \[/);
  assert.match(filmJS,/c33-reveal/);
  assert.match(filmJS,/requestAnimationFrame/);
  assert.match(filmJS,/\.inert=/);
});
test('film uses scoped styles with reduced-motion and mobile variants',()=>{
 const html=read('index.html'),css=read('assets/css/cinematic-film-intro-33.css');
 assert.match(html,/cinematic-film-intro-33\.css/);
 assert.match(html,/cinematic-film-intro-33\.js/);
 assert.ok(html.indexOf('cinematic-film-intro-33.css')<html.indexOf('brand-palette.css'));
 assert.match(css,/#cinema33-film/);
 assert.match(css,/height:\s*760svh/);
 assert.match(css,/@media \(max-width: 820px\)/);
 assert.match(css,/prefers-reduced-motion: reduce/);
 assert.match(css,/position:\s*sticky/);
});

test('cinematic entrance hides the floating header while restoring it afterwards',()=>{
  const html=read('index.html');
  const js=read('assets/js/cinematic-film-intro-33.js');
  const css=read('assets/css/cinematic-film-intro-33.css');
  assert.match(html, /class="home-page c33-intro-active"/);
  assert.match(js, /function setFilmChrome\(isVisible\)/);
  assert.match(js, /header\.inert = isVisible/);
  assert.match(js, /setFilmChrome\(active\)/);
  assert.match(js, /floatingWhatsApp\.inert = isVisible/);
  assert.match(css, /c33-intro-active \.site-header/);
  assert.match(css, /c33-intro-active \.floating-whatsapp/);
});
test('luminous line applies at SECTION boundaries, never inside the intro', () => {
  const html=read('index.html'), css=read('assets/css/cinematic-film-intro-33.css'), js=read('assets/js/cinematic-film-intro-33.js');
  assert.doesNotMatch(html,/data-c33-scene-flash/);
  assert.doesNotMatch(js,/sceneFlash/);
  assert.doesNotMatch(css,/c33-scene-flash/);
  assert.match(js,/c33-section-line/);
  assert.match(css,/c33-section-line.is-lit/);
  assert.match(css,/@keyframes c33-section-shine/);
});
test('original functional footer is last — no extra cinematic credits', () => {
  const html=read('index.html'), css=read('assets/css/cinematic-film-intro-33.css');
  assert.doesNotMatch(html,/id="cinema33-credits"/);
  assert.doesNotMatch(css,/#cinema33-credits/);
  assert.match(html,/class="footer-nav"/);
  assert.match(html,/class="footer-socials"/);
  assert.match(html,/class="days-footer-support"/);
  assert.match(html,/class="days-back-top"/);
});
