const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('experimental hero preserves six official petals and all conversion links', () => {
  const html = read('index.html');
  assert.match(html, /hero--interactive-flower hero--motion-lab/);
  assert.equal((html.match(/data-flower-petal\b/g) || []).length, 6);
  assert.match(html, /href="#problemas"/);
  assert.match(html, /href="#projetos"/);
  assert.match(html, /hero-prism-scroll\.css/);
  assert.match(html, /hero-prism-scroll\.js/);
  assert.doesNotMatch(html, /data-hero-video|hero-video-loader\.js/);
});
test('animation is scoped, progressive and honors reduced motion and mobile', () => {
  const css = read('assets/css/hero-prism-scroll.css');
  const js = read('assets/js/hero-prism-scroll.js');
  assert.match(css, /\.hero--motion-lab \.hero__spotlight/);
  assert.match(css, /\.hero--motion-lab \.flower-prism-glint/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /max-width: 800px/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(js, /saveData/);
  assert.match(js, /pointermove/);
  assert.match(js, /scroll/);
});