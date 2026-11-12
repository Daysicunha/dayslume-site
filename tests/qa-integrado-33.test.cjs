const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Lote D keeps the film first, the existing hero next, and the original footer last',()=>{
 const html=read('index.html');
 assert.ok(html.indexOf('id="cinema33-film"') < html.indexOf('id="apresentacao"'));
 assert.match(html,/class="skip" href="#apresentacao"/);
 assert.match(html,/class="home-page" data-c33-editorial/);
 assert.match(html,/class="site-footer days-support-ready"/);
 assert.doesNotMatch(html,/id="cinema33-credits"/);
 assert.doesNotMatch(html,/data-c33-scene-flash/);
});
test('Lote D does not hide the whole navigation by default',()=>{
 const html=read('index.html'),css=read('assets/css/cinematic-film-intro-33.css');
 assert.doesNotMatch(html,/<body class="home-page c33-intro-active"/);
 assert.match(css,/html:not\(\.c33-film-ready\) #cinema33-film/);
 assert.match(css,/top: var\(--c33-help-height, 38px\)/);
 const palette=read('assets/css/brand-palette.css');
 assert.match(palette,/top: 0 !important/);
 assert.match(palette,/body\.home-page\.c33-intro-active > header\.site-header/);
});
test('Lote D has no perpetual cinema loop and no second hero pointer handler',()=>{
 const film=read('assets/js/cinematic-film-intro-33.js');
 const hero=read('assets/js/hero-cinematic.js');
 const showroom=read('assets/js/cinematic-experience-33.js');
 assert.doesNotMatch(film,/function loop\(/);
 assert.match(film,/window\.addEventListener\('scroll',requestPaint/);
 assert.match(film,/typeof IntersectionObserver !== 'function'/);
 assert.match(hero,/--cinema33-pointer-x/);
 assert.doesNotMatch(showroom,/addEventListener\('pointermove'/);
});
test('Lote D internal sections support changing reduced-motion and a static fallback',()=>{
 const js=read('assets/js/cinematic-editorial-33.js');
 const css=read('assets/css/cinematic-editorial-33.css');
 assert.match(js,/reduced\.addEventListener\('change',syncMotion\)/);
 assert.match(js,/const seen=new WeakSet\(\)/);
 assert.match(js,/c33-editorial-static/);
 assert.match(css,/c33-editorial-static/);
});
test('Lote D remains an additive design layer with palette last',()=>{
 for(const p of ['index.html','servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html']){
  const html=read(p);
  const css=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
  assert.equal(css.at(-1),'assets/css/brand-palette.css',p);
  assert.match(html,/cinematic-editorial-33\.css/);
 }
});
