const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('Kiru story has one semantic hero title and six official petals', () => {
  const html=read('index.html');
  assert.match(html,/hero--interactive-flower hero--motion-lab hero--kiru-story/);
  assert.match(html,/id="hero-title" class="hero-kiru-title"/);
  assert.equal((html.match(/data-kiru-word\b/g)||[]).length,6);
  assert.equal((html.match(/data-kiru-keyword\b/g)||[]).length,3);
  assert.equal((html.match(/data-flower-petal\b/g)||[]).length,6);
  assert.match(html,/Pular animação/);
  assert.match(html,/href="#problemas"/);
  assert.match(html,/href="#projetos"/);
  assert.doesNotMatch(html,/data-hero-video|hero-video-loader\.js/);
});
test('scroll-tied kinetic motion is progressive, reversible and accessibility-aware',()=>{
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.match(css,/hero--kiru-ready \.hero-kiru-stage/);
  assert.match(css,/position: sticky/);
  assert.match(css,/hero--motion-lab \.hero__spotlight/);
  assert.match(css,/hero--motion-lab \.flower-prism-glint/);
  assert.match(css,/prefers-reduced-motion: reduce/);
  assert.match(css,/max-width:800px/);
  assert.match(js,/requestAnimationFrame/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/navigator\.connection && navigator\.connection\.saveData/);
  assert.match(js,/pointermove/);
  assert.match(js,/renderScroll/);
  assert.match(js,/reveal\.inert/);
  assert.match(js,/flower\.style\.transform/);
  assert.match(js,/phase\(p/);
});
