const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const palette=read('assets/css/brand-palette.css');
const layer=palette.split('DAYSLUME 3.4 / NEON GLASS LANGUAGE')[1];

test('neon glass: preservar token oficial e camada final compartilhada',()=>{
  assert.ok(layer,'nova camada não encontrada');
  assert.ok(palette.includes('--ds-neon-pink: #FF3D9A;'));
  const paths=[...read('sitemap.xml').matchAll(/<loc>(https:\/\/dayslume\.daysicunha\.com\.br\/[^<]*)<\/loc>/g)].map(m=>{
    const relative=new URL(m[1]).pathname.replace(/^\//,'');
    return relative||'index.html';
  });
  assert.equal(paths.length,22);
  for(const file of paths){
    const html=read(file);
    const prefix=file.includes('/')?'../':'';
    const styles=[...html.matchAll(/href="((?:\.\.\/)?assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
    assert.equal(styles.at(-1),prefix+'assets/css/brand-palette.css',file+' palette not last');
  }
});

test('neon glass: cards e simuladores recebem acentos sem alterar palco 3D',()=>{
  assert.ok(layer);
  for(const selector of [
    '.studio-service-card','.studio-scene-card','.studio-scene-orbit',
    '.products-browser','.products-showroom','.sites-browser','.lp-hero-browser',
    '.lp-lab-browser','.vl-demo-device','.projects-case-card','.blog-story',
    '.contact-process-card','.days-card','.hero-projects__card--agenda',
    '#studio-criativo .positioning-path'
  ])assert.ok(layer.includes(selector),'Seletor ausente: '+selector);
  assert.ok(layer.includes('var(--ds-neon-pink-rgb)'));
  assert.ok(layer.includes('--ds-neon-line'));
  assert.ok(!layer.includes('transform:'));
  assert.ok(!layer.includes('grid-template-columns:'));
  assert.ok(!layer.includes('font-size:'));
  assert.ok(!layer.includes('background:#FF3D9A'));
});

test('neon glass: acessibilidade em foco, touch e movimento reduzido',()=>{
  assert.ok(layer.includes(':focus-visible'));
  assert.ok(layer.includes('@media (hover:none)'));
  assert.ok(layer.includes('@media (prefers-reduced-motion:reduce)'));
  assert.equal((palette.match(/\{/g)||[]).length,(palette.match(/\}/g)||[]).length);
  assert.match(layer,/\.studio-scene-card--front/);
  assert.match(layer,/\.studio-service-card:nth-child\(3\)/);
});
