const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const home = read('index.html');
const editorial = read('assets/css/cinematic-editorial-33.css');
const motion = read('assets/js/products-showroom-motion.js');
const selection = read('assets/js/cinematic-experience-33.js');
const section = home.slice(home.indexOf('id="produtos"'), home.indexOf('id="projetos"'));
const patch = editorial.split('DAYSLUME 3.3 — ATO IV / showroom compacto ilustrado')[1] || '';

test('Ato IV keeps semantic titles and two actual ecosystem cards, links and status notes', () => {
  for (const item of [
    'VITRINI apresenta.', 'ENGRENI organiza.',
    'SHOWROOM / EXPLORE OS ECOSSISTEMAS',
    'Catálogos, links e descoberta regional',
    'Sistemas para atendimentos, agendas',
    'VITRINI Local: plataforma regional.',
    'Agenda em uso-piloto. Nauta em validação.'
  ]) assert.ok(section.includes(item),item);
  assert.match(section, /class="products-heading-visual" aria-hidden="true"/);
  assert.equal((section.match(/class="products-heading-tile /g)||[]).length,2);
  assert.equal((section.match(/<article class="solution-card solution-/g)||[]).length,2);
  assert.equal((section.match(/class="ecosystem-logo" aria-hidden="true"/g)||[]).length,2);
  for (const href of ['vitrini.html','vitrini-link.html','solucoes.html#vitrini-local','solucoes.html#engreni-agenda','solucoes.html#engreni-nauta','solucoes.html#ritmo-produto']) {
    assert.ok(section.includes('href="'+href+'"'),href);
  }
});

test('Ato IV retains accessible showroom controls, pointer-free filtering and genuine microscreens', () => {
  for (const choice of ['all','vitrini','engreni']) {
    assert.ok(section.includes('data-cinema33-choice="'+choice+'"'));
  }
  assert.match(section,/role="group" aria-label="Destacar família de produtos"/);
  assert.match(section,/aria-live="polite"/);
  assert.match(section,/class="vitrini-ui"/);
  assert.match(section,/class="engreni-ui"/);
  assert.match(selection,/setAttribute\('aria-pressed'/);
  assert.match(selection,/showroom\.hidden = false/);
  assert.doesNotMatch(selection,/card\.hidden\s*=|\.remove\(\)/);
});

test('Ato IV compact styling overrides old card min-height and keeps horizontal layout without affecting hero', () => {
  assert.ok(patch);
  assert.match(patch,/section#produtos\.section/);
  assert.match(patch,/grid-template-columns: repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(patch,/min-height: 366px/);
  assert.match(patch,/\.solution-card \.solution-graphic\.product-interface/);
  assert.match(patch,/\.products-editorial-heading/);
  assert.match(patch,/@media \(max-width:1100px\)/);
  assert.match(patch,/@media \(max-width:700px\)/);
  assert.match(patch,/@media \(max-width:360px\)/);
  assert.match(patch,/@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(patch,/#apresentacao|#cinema33-film|\.hero--floating-panels/);
  assert.equal((editorial.match(/\{/g)||[]).length,(editorial.match(/\}/g)||[]).length);
});

test('Ato IV animation uses visible-only observers and static fallbacks with no perpetual JS loops', () => {
  assert.match(home,/src="assets\/js\/products-showroom-motion\.js" defer/);
  assert.match(motion,/IntersectionObserver/);
  assert.match(motion,/products-is-visible/);
  assert.match(motion,/observer\.observe\(section\)/);
  assert.match(motion,/prefers-reduced-motion: reduce/);
  assert.match(motion,/navigator\.connection/);
  assert.match(motion,/document\.hidden/);
  assert.doesNotMatch(motion,/requestAnimationFrame|setInterval|setTimeout/);
  assert.match(patch,/@keyframes products-float-vitrini/);
  assert.match(patch,/@keyframes products-float-engreni/);
  assert.match(patch,/@keyframes products-device-vitrini/);
  assert.match(patch,/@keyframes products-device-engreni/);
});
