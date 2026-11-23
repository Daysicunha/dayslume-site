const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = read('index.html');
const css = read('assets/css/home-positioning-20261123.css');

test('novo posicionamento entre modelo e produtos, sem refazer o roteiro 3.4', () => {
  assert.ok(html.indexOf('id="modelo"') < html.indexOf('id="studio-criativo"'));
  assert.ok(html.indexOf('id="studio-criativo"') < html.indexOf('id="produtos"'));
  assert.equal((html.match(/id="studio-criativo"/g) || []).length,1);
  assert.equal((html.match(/class="home34-boundary"/g) || []).length,7);
  assert.ok(html.includes('id="cinema33-film"'));
  assert.ok(html.includes('hero--project-simulators'));
});

test('branding + presença digital no mesmo estúdio e CTAs reais de contato', () => {
  const seg = html.slice(html.indexOf('id="studio-criativo"'),html.indexOf('id="produtos"'));
  for (const s of ['STUDIO CRIATIVO','EXPERIÊNCIAS DIGITAIS','Identidade visual e branding','Design para redes sociais','Sites, landing pages e catálogos','Sistemas e automações sob medida']) {
    assert.ok(seg.includes(s),s);
  }
  assert.equal((seg.match(/href="#contato"/g) || []).length,3);
  assert.ok(html.includes('id="contato"'));
});

test('CSS isolado à home, responsável e preservando cascade de tokens', () => {
  const links = [...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
  assert.equal(links.at(-1),'assets/css/brand-palette.css');
  assert.equal(links.at(-2),'assets/css/home-cinematic-continuity-34.css');
  assert.equal(links.at(-3),'assets/css/home-positioning-20261123.css');
  assert.ok(css.includes('#studio-criativo'));
  assert.ok(css.includes('@media (max-width:720px)'));
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
  assert.equal((css.match(/\{/g) || []).length,(css.match(/\}/g) || []).length);
});

test('JSON-LD publicamente consistente com o posicionamento', () => {
  const match=html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  assert.ok(match);
  const data=JSON.parse(match[1]);
  const org=data['@graph'].find(x=>x['@type']==='Organization');
  assert.match(org.description,/criativo e de tecnologia/);
  assert.ok(org.hasOfferCatalog.itemListElement.some(x=>x.itemOffered.name.includes('Identidade visual')));
});
