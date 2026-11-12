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
 assert.match(css,/height:\s*600svh/);
 assert.match(css,/@media \(max-width: 820px\)/);
 assert.match(css,/prefers-reduced-motion: reduce/);
 assert.match(css,/position:\s*sticky/);
});

test('cinematic entrance hides the floating header while restoring it afterwards',()=>{
  const html=read('index.html');
  const js=read('assets/js/cinematic-film-intro-33.js');
  const css=read('assets/css/cinematic-film-intro-33.css');
  assert.match(html, /<body class="home-page"(?:\s[^>]*)?>/);
  assert.doesNotMatch(html, /<body class="home-page c33-intro-active">/);
  assert.match(js, /document\.documentElement\.classList\.add\(\x27c33-film-ready\x27\)/);
  assert.match(js, /function setFilmChrome\(isVisible\)/);
  assert.match(js, /header\.inert = isVisible/);
  assert.match(js, /setFilmChrome\(isFilmInForeground\(\)\)/);
  assert.match(js, /helpStrip\.inert = isVisible/);
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

test('LOTE A starts the film at page top and never reserves an invisible sticky header',()=>{
  const html=read('index.html');
  const css=read('assets/css/cinematic-film-intro-33.css');
  assert.match(css,/body\.home-page > \.site-header\s*\{\s*position:\s*fixed/);
  assert.match(css,/body\.home-page > \.days-help-strip\s*\{\s*position:\s*fixed/);
  assert.match(css,/html:not\(\.c33-film-ready\) #cinema33-film/);
  assert.match(css,/height:\s*100svh/);
  assert.match(html,/class="skip" href="#apresentacao"/);
  assert.match(html,/id="apresentacao" aria-labelledby="hero-title" tabindex="-1"/);
});
test('LOTE A keeps film captions inert until their scene and does not alter first-child layout',()=>{
  const html=read('index.html'), js=read('assets/js/cinematic-film-intro-33.js');
  assert.equal((html.match(/data-c33-caption inert/g)||[]).length,4);
  assert.match(js,/line\.inert=!show/);
  assert.match(js,/section\.append\(line\)/);
  assert.doesNotMatch(js,/section\.prepend\(line\)/);
  assert.match(js,/section\.querySelector\(':scope > \.c33-section-line'\)/);
});

test('Lote D keeps film and dividers working without IntersectionObserver',()=>{
 const js=read('assets/js/cinematic-film-intro-33.js');
 assert.match(js,/const supportsObserver=typeof IntersectionObserver === 'function'/);
 assert.match(js,/observer\?\.observe\(film\)/);
 assert.match(js,/if \(typeof IntersectionObserver !== 'function'\)/);
 assert.match(js,/if \(reduce\.matches \|\| !cutObserver\)/);
});
test('Lote D keeps the fixed home header below the actual help strip height',()=>{
 const js=read('assets/js/cinematic-film-intro-33.js');
 const css=read('assets/css/cinematic-film-intro-33.css');
 assert.match(js,/function syncHelpOffset\(\)/);
 assert.match(js,/Math\.ceil\(helpStrip\.getBoundingClientRect\(\)\.height\)/);
 assert.match(js,/new ResizeObserver\(syncHelpOffset\)/);
 assert.match(css,/top: var\(--c33-help-height, 38px\)/);
 assert.match(css,/scroll-margin-top: calc\(var\(--c33-help-height, 38px\) \+ 108px\)/);
});
