const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const html=read('index.html');
const css=read('assets/css/cinematic-floating-panels-20261113.css');
const motion=read('assets/js/hero-master-motion.js');
const pointer=read('assets/js/hero-cinematic.js');
const begin=html.indexOf('<section class="hero hero--cinematic hero--floating-panels"');
const end=html.indexOf('id="problemas"',begin);
const hero=html.slice(begin,end);
const patch=css.split('DAYSLUME — HERO MASTER / referência aprovada 17.11.2026')[1]||'';

test('Hero Master: retained commercial promise and live product UI without flattening to image',()=>{
 assert.ok(begin>0&&end>begin);
 assert.match(hero,/data-cinema33-home data-hero-master="true" id="apresentacao"/);
 assert.match(hero,/<h1 id="hero-title">Faça o digital/);
 for(const copy of ['trabalhar melhor','para o seu negócio','ESTÚDIO DE DESENVOLVIMENTO DIGITAL',
  'Criamos sites, experiências digitais e sistemas', 'VITRINI LOCAL','Minha agenda',
  'Sites &amp; experiências digitais','PROJETOS SOB MEDIDA + PRODUTOS PRÓPRIOS']) {
   assert.ok(hero.includes(copy),copy);
 }
 for(const dest of ['href="#contato"','href="#projetos"','href="#produtos"'])assert.ok(hero.includes(dest),dest);
 assert.match(hero,/aria-label="Painéis de interfaces digitais flutuantes em três dimensões/);
 assert.match(hero,/class="cinema-browser"/);
 assert.match(hero,/class="cinema-phone cinema-agenda-panel"/);
 assert.match(hero,/class="cinema-service"/);
 assert.match(html,/id="cinema33-film"/);
});

test('Hero Master: orbit, floor light and device layers reproduce approved depth safely',()=>{
 assert.equal((hero.match(/class="hero-master-orbit"/g)||[]).length,1);
 assert.equal((hero.match(/class="hero-master-lightfloor"/g)||[]).length,1);
 assert.match(hero,/class="hero-master-orbit-halo"/);
 assert.match(hero,/class="hero-master-orbit-line"/);
 assert.match(hero,/aria-hidden="true" focusable="false"/);
 assert.ok(patch);
 assert.match(patch,/body\.home-page #apresentacao\[data-hero-master\]/);
 assert.match(patch,/font-family:Georgia/);
 assert.match(patch,/grid-template-columns:minmax\(0,\.86fr\) minmax\(0,1\.14fr\)/);
 assert.match(patch,/\.cinema-float--vitrini/);
 assert.match(patch,/\.cinema-float--engreni/);
 assert.match(patch,/\.cinema-float--service/);
 assert.match(patch,/\.hero-master-orbit/);
 assert.match(patch,/\.hero-master-lightfloor/);
 assert.match(patch,/@media \(max-width:1100px\)/);
 assert.match(patch,/@media \(max-width:600px\)/);
 assert.match(patch,/@media \(max-width:380px\)/);
 assert.match(patch,/@media \(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(patch,/#cinema33-film|#modelo|#produtos|#projetos|#sobre|#conteudos|#contato/);
 assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
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

test('approved screenshot master preserves live 3D layers, plum lighting and thin lower seam',()=>{
 assert.match(patch,/width:calc\(100% \+ 112px\);/);
 assert.match(patch,/margin:0 0 0 -76px;/);
 assert.match(patch,/\.cinema-float--engreni\s*\{[^}]*width:38%;/s);
 assert.match(patch,/\.cinema-float--service\s*\{[^}]*bottom:14%;/s);
 assert.match(patch,/radial-gradient\(ellipse 50% 61% at 67% 47%,rgba\(var\(--plum-mineral-rgb\),\.52\)/);
 for(const label of ['Eventos do dia','Atendimento','Livre','Agendamento'])assert.ok(hero.includes(label),label);
 assert.match(patch,/\.cinema33-ledger::before/);
 assert.match(patch,/\.cinema33-ledger__link:focus-visible/);
 assert.match(patch,/@media \(max-width:600px\)/);
});
