const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const allHtml=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
 const p=path.join(dir,e.name);
 return e.isDirectory() ? (e.name==='.git' ? []: allHtml(p)): e.name.endsWith('.html')?[p]:[];
});
test('all 18 internal pages load the Home editorial visual system',()=>{
 const pages=allHtml(root);
 assert.equal(pages.length,19);
 for(const page of pages.filter(p=>path.basename(p)!=='index.html')){
  const source=fs.readFileSync(page,'utf8');
  assert.match(source,/internal-home-parity\.css/);
  assert.match(source,/brand-palette\.css/);
  assert.match(source,/dayslume-components\.js/);
  assert.match(source,/id="menu-principal"/);
  assert.match(source,/days-menu-toggle/);
  assert.match(source,/class="floating-whatsapp"/);
 }
});
test('internal navigation uses the same 1180px breakpoint as the Home',()=>{
 const css=read('assets/css/dayslume-components.css');
 const parity=read('assets/css/internal-home-parity.css');
 const nav=read('assets/js/dayslume-components.js');
 assert.match(css,/@media\(max-width:1180px\)\{\.header\.days-nav-ready/);
 assert.match(parity,/@media\(min-width:1181px\)/);
 assert.match(parity,/@media\(max-width:1180px\)/);
 assert.match(parity,/\.header\.days-nav-ready nav\.is-open \{display:flex;\}/);
 assert.match(nav,/max-width: 1180px/);
 assert.match(css,/\.days-menu-toggle,\.header \.days-mobile-contact\{display:none\}/);
});
test('interior hero adopts the mineral split without pinning scroll',()=>{
 const parity=read('assets/css/internal-home-parity.css');
 assert.match(parity,/Auditoria de 13\/10/);
 assert.match(parity,/#202532 0%,#202532 58%,#2C3448 58%,#485168 82%,#6B536D 100%/);
 assert.match(parity,/body\.blog-index \.blog-hero::before/);
 assert.match(parity,/body\.blog-article \.blog-reading-hero/);
 assert.match(parity,/prefers-reduced-motion:reduce/);
});
