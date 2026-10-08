const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
test('scroll hero places original text left and six original petals right',()=>{
  const html=read('index.html');
  assert.match(html,/hero--interactive-flower hero--motion-lab hero--scroll-invasion/);
  assert.match(html,/data-scroll-hero/);
  assert.match(html,/<div class="container hero-grid">[\s\S]*<div class="hero-content">[\s\S]*<h1 id="hero-title">Faça o digital/);
  assert.match(html,/<div class="hero-visual-composition"/);
  assert.equal((html.match(/data-flower-petal\b/g)||[]).length,6);
  assert.match(html,/href="#problemas"/);
  assert.match(html,/href="#projetos"/);
  assert.doesNotMatch(html,/data-kiru-word|hero-kiru-keyword|data-hero-video/);
});
test('Kiru rolling cards are limited to the two commercial paths',()=>{
  const html=read('index.html');
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.match(html,/data-kiru-cards id="modelo"/);
  assert.equal((html.match(/data-kiru-card\b/g)||[]).length,2);
  assert.match(css,/\.home-page #modelo\[data-kiru-cards\]/);
  assert.match(js,/scrollCards/);
  assert.match(js,/kiru-cards-ready/);
});
test('pin and invasion use scroll progress, disable on small screens and reduced motion',()=>{
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.match(css,/\.hero--scroll-invasion\.hero-scroll-ready \.hero-scroll-stage/);
  assert.match(css,/position: sticky/);
  assert.match(css,/\.hero--scroll-invasion \.hero__spotlight/);
  assert.match(css,/\.hero--scroll-invasion \.flower-prism-glint/);
  assert.match(css,/max-width: 800px/);
  assert.match(css,/prefers-reduced-motion: reduce/);
  assert.match(js,/requestAnimationFrame/);
  assert.match(js,/invasion=range/);
  assert.match(js,/copy\.style\.opacity/);
  assert.match(js,/flower\.style\.transform/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/saveData/);
  assert.match(js,/\.inert/);
});


test('Kiru recording inspired motion uses three layered microcards and scroll-tied sweeps',()=>{
  const html=read('index.html');
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.equal((html.match(/data-kiru-panel\b/g)||[]).length,3);
  assert.equal((html.match(/data-kiru-sweep\b/g)||[]).length,3);
  assert.equal((html.match(/data-kiru-card\b/g)||[]).length,2);
  assert.match(css,/\.kiru-motion-panels/);
  assert.match(css,/\.kiru-motion-panel__bars/);
  assert.match(js,/gridRect=cardGrid\.getBoundingClientRect/);
  assert.match(js,/panels\.forEach/);
  assert.match(js,/sweeps\.forEach/);
  assert.match(js,/Math\.min\(innerWidth\*\.33,390\)/);
});
