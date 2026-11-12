const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const internal=['servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html'];

test('Lote C applies the shared visual system to the six primary internal pages',()=>{
  for(const filename of internal){
    const html=read(filename);
    assert.match(html,/data-c33-editorial/);
    assert.match(html,/cinematic-editorial-33\.css/);
    assert.match(html,/cinematic-editorial-33\.js/);
    assert.ok(html.indexOf('cinematic-editorial-33.css')<html.indexOf('brand-palette.css'));
    assert.match(html,/href="contato\.html"/);
  }
});
test('Lote C preserves film and approved 3D hero, without duplicate internal cuts',()=>{
  const html=read('index.html'), js=read('assets/js/cinematic-editorial-33.js');
  assert.match(html,/data-c33-editorial/);
  assert.match(html,/cinematic-editorial-33\.css/);
  assert.match(html,/id="cinema33-film"/);
  assert.match(html,/data-cinema33-home/);
  assert.doesNotMatch(html,/src="assets\/js\/cinematic-editorial-33\.js"/);
  assert.match(js,/body\.classList\.contains\('home-page'\)/);
});
test('Lote C lines decorate only boundaries of direct child sections',()=>{
  const js=read('assets/js/cinematic-editorial-33.js');
  const css=read('assets/css/cinematic-editorial-33.css');
  assert.match(js,/sections\.slice\(1\)/);
  assert.match(js,/section\.append\(line\)/);
  assert.doesNotMatch(js,/section\.prepend\(line\)/);
  assert.match(js,/line\.setAttribute\('aria-hidden','true'\)/);
  assert.match(js,/IntersectionObserver/);
  assert.doesNotMatch(js,/requestAnimationFrame|setInterval|setTimeout/);
  assert.match(css,/c33-editorial-line\.is-lit/);
  assert.match(css,/prefers-reduced-motion: reduce/);
});
test('Lote C does not override layout geometry or add a new font',()=>{
  const css=read('assets/css/cinematic-editorial-33.css');
  assert.doesNotMatch(css,/@import/);
  assert.doesNotMatch(css,/font-family\s*:/);
  assert.doesNotMatch(css,/min-height\s*:/);
  assert.doesNotMatch(css,/height:\s*760svh/);
  assert.doesNotMatch(css,/\.cinema-stage\s*\{[^}]*transform:/);
});

test('Lote C can re-enable one-shot cuts after reduced-motion changes',()=>{
  const js=read('assets/js/cinematic-editorial-33.js');
  assert.match(js,/reduced\.addEventListener\('change'/);
  assert.match(js,/line\.classList\.remove\('is-lit'\)/);
  assert.match(js,/observer\.observe\(line\)/);
});
