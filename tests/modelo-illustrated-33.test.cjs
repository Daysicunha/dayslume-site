const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const home = read('index.html');
const css = read('assets/css/cinematic-editorial-33.css');
const script = read('assets/js/modelo-motion.js');
const section = home.split('id="modelo"')[1]?.split('id="produtos"')[0] || '';
const cssPatch = css.split('DAYSLUME ATO III — ameixa mineral #6B536D, glass editorial compacto e ícones delicados / 18.11.2026')[1] || '';

test('Ato III keeps approved commercial copy, both CTAs and destinations',()=>{
  assert.match(home,/id="modelo"/);
  for(const label of [
    'COMO A DAYSLUME ENTREGA',
    'Projeto sob medida.',
    'Ou uma solução própria.',
    'PROJETOS SOB MEDIDA',
    'PRODUTOS PRÓPRIOS',
    'Uma solução desenhada para seu negócio.',
    'Uma solução que já tem um caminho definido.',
    'VITRINI ajuda a apresentar. ENGRENI ajuda a organizar. Explore os formatos.'
  ])assert.ok(section.includes(label),label);
  assert.match(section,/href="servicos\.html"/);
  assert.match(section,/href="contato\.html"/);
  assert.match(section,/href="solucoes\.html"/);
  assert.equal((section.match(/data-kiru-card\b/g)||[]).length,2);
});

test('Ato III illustrations are semantic decoration, preserving actual links and texts',()=>{
  assert.match(section,/class="modelo-project-art"[^>]*role="presentation"/);
  assert.match(section,/class="modelo-path-visual modelo-path-visual--bespoke" aria-hidden="true"/);
  assert.match(section,/class="modelo-path-visual modelo-path-visual--products" aria-hidden="true"/);
  assert.match(section,/class="modelo-product-tile modelo-product-tile--vitrini"/);
  assert.match(section,/class="modelo-product-tile modelo-product-tile--engreni"/);
  assert.equal((section.match(/class="modelo-product-tile /g)||[]).length,2);
  assert.equal((section.match(/<article class="service-card days-service-card commercial-path-card modelo-path-card/g)||[]).length,2);
  assert.match(section,/class="path-cta" href="solucoes\.html"/);
});

test('Ato III uses scoped CSS, native scroll cards, responsive layout and reduced motion',()=>{
  assert.ok(cssPatch,'section styles must exist');
  assert.match(cssPatch,/section#modelo\.section/);
  assert.match(cssPatch,/\.modelo-paths\s*\{/);
  assert.match(cssPatch,/padding-block: clamp\(72px, 6vw, 95px\)/);
  assert.match(cssPatch,/min-height: clamp\(330px, 24\.2vw, 385px\)/);
  assert.match(cssPatch,/backdrop-filter: blur\(15px\) saturate\(1\.04\)/);
  assert.match(cssPatch,/\.modelo-product-tile svg \{[^}]*width: 24px;[^}]*stroke-width: 1\.2;/s);
  assert.match(cssPatch,/linear-gradient\(112deg,/);
  assert.match(cssPatch,/max-width: 1480px/);
  assert.match(cssPatch,/gap: clamp\(20px, 2\.75vw, 44px\)/);
  assert.match(cssPatch,/height: 235px/);
  assert.match(cssPatch,/\.modelo-product-tile--engreni/);
  assert.match(cssPatch,/modelo-art-laptop-float/);
  assert.match(cssPatch,/modelo-tile-vitrini-float/);
  assert.match(cssPatch,/@media \(max-width: 800px\)/);
  assert.match(cssPatch,/@media \(max-width: 540px\)/);
  assert.match(cssPatch,/@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(cssPatch,/#apresentacao|#cinema33-film|\.hero--floating-panels/);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
});

test('Ato III illustration motion runs only in view and degrades without JS',()=>{
  assert.match(home,/src="assets\/js\/modelo-motion\.js" defer/);
  assert.match(script,/IntersectionObserver/);
  assert.match(script,/is-modelo-visible/);
  assert.match(script,/modelo-motion-ready/);
  assert.match(script,/observer\.observe\(section\)/);
  assert.match(script,/observer\?\.disconnect/);
  assert.match(script,/prefers-reduced-motion: reduce/);
  assert.match(script,/navigator\.connection/);
  assert.doesNotMatch(script,/requestAnimationFrame|setInterval|setTimeout/);
  const cssFiles = [...home.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
  assert.equal(cssFiles.at(-1),'assets/css/brand-palette.css');
});
