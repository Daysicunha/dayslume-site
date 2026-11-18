const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const html=read('index.html');
const css=read('assets/css/cinematic-floating-panels-20261113.css');
const motion=read('assets/js/hero-master-motion.js');
const pointer=read('assets/js/hero-cinematic.js');
const begin=html.indexOf('<section class="hero hero--cinematic hero--floating-panels hero--project-simulators"');
const end=html.indexOf('id="problemas"',begin);
const hero=html.slice(begin,end);
const patch=css.split('DAYSLUME — HERO MASTER / referência aprovada 17.11.2026')[1]||'';

test('Hero Master: commercial promise uses three coded product simulations',()=>{
 assert.ok(begin>0 && end>begin);
 assert.ok(hero.includes('data-cinema33-home data-hero-master="true" id="apresentacao"'));
 for(const value of ['<h1 id="hero-title">Soluções digitais','que <em>conectam</em>','ideias, negócios','e pessoas','ESTÚDIO DE DESENVOLVIMENTO DIGITAL','Criamos sites, sistemas e experiências digitais','VITRINI','Minha agenda','Caderneta']) assert.ok(hero.includes(value),value);
 for(const href of ['href="#produtos"','href="#projetos"','href="solucoes.html#vitrini"','href="solucoes.html#engreni"']) assert.ok(hero.includes(href),href);
 for(const name of ['vitrini','agenda','caderneta']) assert.ok(hero.includes('hero-projects__card--'+name),name);
 assert.ok(hero.includes('Prévia ilustrativa de três projetos DAYSLUME'));
 assert.ok(html.includes('id="cinema33-film"'));
});

test('Hero Master: orbit and floor light retain cinematic 3D depth with glass screens',()=>{
 const glass=read('assets/css/hero-project-simulators-20261118.css');
 for(const value of ['class="hero-master-orbit"','class="hero-master-lightfloor"','class="hero-master-orbit-halo"','class="hero-master-orbit-line"','aria-hidden="true" focusable="false"']) assert.ok(hero.includes(value),value);
 for(const value of ['--hero-plum: #6B536D','.hero-projects__card--vitrini','.hero-projects__card--agenda','.hero-projects__card--caderneta','perspective:1500px','backdrop-filter:blur(20px)','@media (max-width:1250px)','@media (max-width:600px)','@media (max-width:365px)','@media (prefers-reduced-motion:reduce)']) assert.ok(glass.includes(value),value);
 assert.doesNotMatch(glass, /#cinema33-film|#modelo|#produtos|#projetos|#sobre|#conteudos|#contato/);
 assert.equal((glass.match(/\{/g)||[]).length,(glass.match(/\}/g)||[]).length);
});

test('Hero Master: viewport gated ambient motion and existing single RAF mouse parallax',()=>{
 assert.match(html,/src="assets\/js\/hero-master-motion\.js" defer/);
 assert.match(motion,/IntersectionObserver/);
 assert.match(motion,/hero-master-visible/);
 assert.match(motion,/hero\.classList\.add\('is-3d-visible'\)/);
 assert.match(motion,/observer\.observe\(hero\)/);
 assert.match(motion,/prefers-reduced-motion: reduce/);
 assert.match(motion,/navigator\.connection/);
 assert.match(motion,/document\.hidden/);
 assert.doesNotMatch(motion,/requestAnimationFrame\(|setInterval\(|setTimeout\(/);
 assert.match(pointer,/requestAnimationFrame\(paint\)/);
 assert.match(pointer,/--cinema-shift-x/);
 assert.match(patch, /transform:translate3d\(var\(--cinema-shift-x,0px\),var\(--cinema-shift-y,0px\),0\)/);
 assert.match(patch, /\.hero-master-visible \.hero-master-orbit/);
 assert.match(patch, /:not\(\.hero-master-visible\) :is\(/);
 assert.match(patch, /animation-play-state:paused!important/);
 assert.match(patch, /@keyframes hero-master-orbit-pulse/);
 assert.match(patch, /@keyframes hero-master-floor-glow/);
});

test('Hero Master: existing later acts and styles remain included, brand remains last',()=>{
 for(const id of ['problemas','modelo','produtos','projetos','sobre','conteudos','contato']) {
   assert.ok(html.includes('id="'+id+'"'),id);
 }
 const files=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.equal(files.at(-1),'assets/css/brand-palette.css');
 assert.match(html, /src="assets\/js\/cinematic-film-intro-33\.js" defer/);
 assert.match(html, /href="#contato"/);
});

test('Hero Master: trio uses plum lighting, product links and accessibility',()=>{
 const glass=read('assets/css/hero-project-simulators-20261118.css');
 for(const value of ['VITRINI','Minha agenda','Caderneta','Clientes','Cobranças','Relatórios','EXPERIÊNCIA ILUSTRATIVA']) assert.ok(hero.includes(value),value);
 for(const value of ['.hero-projects__plinth','.hero-projects__halo','.hero-pillar-band','.hero-projects__card:focus-visible','@media (max-width:600px)']) assert.ok(glass.includes(value),value);
 assert.ok(hero.includes('cinema33-ledger__link" href="#produtos"'));
});
