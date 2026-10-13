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


test('all interior pages share the complete Home flagship design system',()=>{
 const parity=read('assets/css/internal-home-parity.css');
 for(const signature of [
  'PARIDADE FLAGSHIP INTEGRAL','--internal-container:1320px',
  'Capsule header matches the Home','Editorial hero: mineral split',
  'Home rhythm','Cards, contextual calls','Footer: same spacing',
  '@media(max-width:1180px)','@media(prefers-reduced-motion:reduce)'
 ])assert.ok(parity.includes(signature),signature);
 assert.match(parity,/body:not\(\.home-page\) \.footer-inner\s*\{\s*display:grid/);
 assert.match(parity,/body:not\(\.home-page\) main \.grid>\.box\.days-card/);
 assert.match(parity,/body\.blog-index \.blog-hero/);
 assert.match(parity,/body\.vl-page \.vl-page-hero/);
 assert.match(parity,/\.header~main>\.hero\s*\{\s*position:relative/);
 for(const page of allHtml(root).filter(p=>path.basename(p)!=='index.html')){
  const source=fs.readFileSync(page,'utf8');
  assert.match(source,/internal-home-parity\.css/,path.relative(root,page));
 }
});


test('logo do menu Home é o mesmo arquivo em todos os cabeçalhos e rodapés',()=>{
 const pages=allHtml(root);assert.equal(pages.length,19);
 const canonical='logohorizontalbranca.png';
 for(const page of pages){
  const s=fs.readFileSync(page,'utf8');
  const links=[...s.matchAll(/<(?:header|footer)\b[\s\S]*?<\/(?:header|footer)>/gi)].map(x=>x[0]);
  assert.equal(links.length,2,path.relative(root,page));
  for(const part of links){
   assert.match(part,/src="(?:\.\.\/)?assets\/images\/logohorizontalbranca\.png"/,path.relative(root,page));
  }
  assert.doesNotMatch(s,/dayslume-logo-horizontal-branca\.png/);
 }
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(home,/"logo":"https:\/\/dayslume\.daysicunha\.com\.br\/assets\/images\/logohorizontalbranca\.png"/);
});
test('flores decorativas internas reutilizam exclusivamente as seis pétalas da Home',()=>{
 const p=read('assets/css/internal-home-parity.css');
 const blog=read('blog.html');
 const vit=read('vitrini-link.html');
 assert.match(p,/--dayslume-home-petals:/);
 for(let i=1;i<=6;i++)assert.ok(p.includes('hero-flower-petals/petal-0'+i+'.png'));
 assert.match(p,/background-image:var\(--dayslume-home-petals\)/);
 assert.equal((blog.match(/class="dayslume-home-flower-art"/g)||[]).length,2);
 assert.equal((vit.match(/class="dayslume-home-flower-art"/g)||[]).length,1);
 assert.doesNotMatch(blog,/dayslume-flor-hero\.png/);
 assert.doesNotMatch(vit,/dayslume-flor-oficial\.webp/);
 assert.doesNotMatch(p,/dayslume-flor-hero\.svg/);
});
