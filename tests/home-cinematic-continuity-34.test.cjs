const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('assets/css/home-cinematic-continuity-34.css');
const cssFiles = [...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m => m[1]);
const chapters = [
  ['problemas', '01 / DESCOBERTA'],
  ['modelo', '02 / TRANSFORMAÇÃO'],
  ['produtos', '02 / SOLUÇÕES'],
  ['projetos', '03 / MATERIALIZAÇÃO'],
  ['sobre', '04 / AUTORIA'],
  ['conteudos', '04 / IDEIAS'],
  ['contato', '05 / CONEXÃO'],
];

test('3.4: canonical tokens remain last; home story is isolated to the Home', () => {
  assert.match(html, /<body class="home-page" data-c33-editorial data-home34-story>/);
  assert.equal(cssFiles.at(-1), 'assets/css/brand-palette.css');
  assert.equal(cssFiles.at(-2), 'assets/css/home-cinematic-continuity-34.css');
  assert.equal(cssFiles.filter(x => x.endsWith('home-cinematic-continuity-34.css')).length, 1);
  assert.match(css, /body\.home-page\[data-home34-story\]/);
  assert.doesNotMatch(css, /body\s*\{\s*background/);
});

test('3.4: all seven existing Home sections belong to the approved narrative', () => {
  assert.equal((html.match(/class="home34-boundary"/g) || []).length, 7);
  assert.equal((html.match(/class="home34-chapter"/g) || []).length, 7);
  for (const [id, chapter] of chapters) {
    assert.ok(html.includes('id="' + id + '"'), id + ' section');
    assert.ok(html.includes(chapter), chapter + ' chapter');
    assert.match(css, new RegExp('section#' + id + '(?:\\.section)?'));
  }
  assert.deepEqual([...html.matchAll(/section-eyebrow__number">(\d\d)</g)].map(m=>m[1]),
    ['01','02','03','04','05','06','07']);
});

test('3.4: original film, real simulators, cases, founder and contact are untouched', () => {
  const hero=html.split('id="apresentacao"')[1]?.split('id="problemas"')[0]||'';
  assert.ok(html.includes('id="cinema33-film"'));
  for (const name of ['vitrini','agenda','caderneta'])
    assert.ok(hero.includes('hero-projects__card--'+name),name);
  assert.doesNotMatch(hero,/hero-flower|hero-floral|hero-bloom|hero-petals|flower-petal|data-flower-petal/);
  assert.match(css,/\.hero-flower/);
  assert.ok(html.includes('daysi-cunha-editorial.jpg'));
  assert.equal((html.match(/class="project-card flagship-case/g)||[]).length,3);
  assert.match(html,/class="contact-form" id="contact-form" hidden/);
});

test('3.4: transitional backgrounds, fine light thread and responsive safety exist', () => {
  for (const token of ['#202532','#6B536D','#F3EFE8','#D8B6A5','#FF3D9A'])
    assert.ok(css.includes(token),token);
  assert.match(css,/\.home34-boundary::before/);
  assert.match(css,/\.home34-boundary::after/);
  assert.match(css,/@media \(max-width:760px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
});
