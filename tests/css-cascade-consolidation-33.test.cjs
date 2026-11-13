const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(root,'assets','css',n),'utf8');
const names=['brand-palette.css','home-premium.css','hero-tech.css','internal-home-parity.css','hero-cinematic.css'];

test('CSS fase 2 preserves official tokens, cinematic mockups and responsive breakpoints',()=>{
 const palette=read('brand-palette.css');
 for(const token of ['--ink-deep: #202532;','--plum-mineral: #6B536D;','--mist-blue: #A9C5D8;','--warm-ivory: #F3EFE8;','--slate-mineral: #66758F;'])assert.ok(palette.includes(token),token);
 const hero=read('hero-cinematic.css');
 for(const sel of ['.cinema-cluster','.cinema-browser','.cinema-phone','.cinema-service'])assert.ok(hero.includes(sel),sel);
 assert.match(hero,/@media \(max-width: 560px\)/);
 assert.match(read('internal-home-parity.css'),/\.header\.days-nav-ready/);
});

test('CSS fase 2 retains balanced blocks and canonical stylesheet precedence',()=>{
 for(const name of names){
  const css=read(name);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,name);
 }
 for(const name of ['index.html','servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html']){
  const source=fs.readFileSync(path.join(root,name),'utf8');
  const hrefs=[...source.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
  assert.equal(hrefs.at(-1),'assets/css/brand-palette.css',name);
 }
});

test('CSS fase 2 does not introduce new files or remove the approved hero',()=>{
 assert.equal(fs.readdirSync(path.join(root,'assets','css')).filter(x=>x.endsWith('.css')).length,37);
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const anchor of ['id="cinema33-film"','class="hero hero--cinematic hero--floating-panels"','class="cinema-browser"','class="cinema-phone cinema-agenda-panel"','class="cinema-service"','class="site-footer days-support-ready"'])assert.ok(index.includes(anchor),anchor);
});
