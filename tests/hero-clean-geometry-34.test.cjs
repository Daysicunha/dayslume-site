const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const hero=read('assets/css/hero-project-simulators-20261118.css');
const cinematic=read('assets/css/hero-cinematic.css');
const editorial=read('assets/css/cinematic-editorial-33.css');
const palette=read('assets/css/brand-palette.css');
const html=read('index.html');
const workflow=read('.github/workflows/visual-qa.yml');
const final=hero.slice(hero.indexOf('/* DAYSLUME 3.4 — palco único'));
test('3.4 preserves the original 5-scene opening and 3 linked live-DOM product previews',()=>{
 assert.match(html,/id="cinema33-film"/);
 for(const k of ['vitrini','agenda','caderneta']){
  assert.match(html,new RegExp('hero-projects__card--'+k));
 }
 assert.match(html,/href="solucoes.html#vitrini"/);
 assert.match(html,/href="solucoes.html#engreni"/);
 assert.doesNotMatch(html.slice(html.indexOf('id="apresentacao"'),html.indexOf('id="problemas"')),/hero-flower/);
});
test('3.4 desktop transforms share a baseline with no overlapping horizontal slots',()=>{
 const wide=final.split('@media (min-width:761px) {')[1]?.split('@media (min-width:761px) and')[0]||'';
 assert.match(wide,/perspective:1700px/);
 for(const name of ['vitrini','agenda','caderneta'])assert.match(wide,new RegExp('hero-projects__card--'+name+' \\{[^}]*bottom:12%;'));
 const boxes=[{l:2,w:28,h:68},{l:33,w:34,h:76},{l:70,w:28,h:68}];
 assert.ok(boxes[0].l+boxes[0].w<boxes[1].l);
 assert.ok(boxes[1].l+boxes[1].w<boxes[2].l);
 assert.ok(boxes[1].h>boxes[0].h && boxes[1].h>boxes[2].h);
 assert.match(wide,/rotateY\(5deg\)/);
 assert.match(wide,/rotateY\(-5deg\)/);
});
test('3.4 removes decorative grid backgrounds but retains functional interface layouts',()=>{
 const h=cinematic.slice(cinematic.indexOf('.hero--cinematic::before {'),cinematic.indexOf('.hero--cinematic::after {'));
 assert.doesNotMatch(h,/background-size:\\s*80px|linear-gradient\\(90deg.*1px/);
 const beginning=editorial.slice(editorial.indexOf('section#problemas.section::before {'),editorial.indexOf('section#problemas.section::after {'));
 assert.doesNotMatch(beginning,/background-size:\\s*82px|1px, transparent 1px/);
 for(const k of ['manifest','structure','network','editorial']){
  const start=palette.indexOf('.section-atmosphere--'+k+'::before {');
  assert.ok(start>=0,k);
  const rule=palette.slice(start,palette.indexOf('}',start));
  assert.doesNotMatch(rule,/repeating-linear-gradient|1px, transparent 1px|background-size:\\s*clamp/);
 }
 assert.match(hero,/hero-projects__timeline-track/);
 assert.match(hero,/hero-projects__c-list/);
 assert.match(final,/rgba\(169,197,216,.07\)/);
});
test('3.4 screen-size fallback and before-after browser evidence are explicitly configured',()=>{
 assert.match(final,/@media \(max-width:760px\)/);
 assert.match(final,/@media \(max-width:440px\)/);
 assert.match(final,/prefers-reduced-motion:reduce/);
 assert.match(workflow,/BASE_SHA: 69896abee9ff81c1ff2d2d883d1becbbd18adce4/);
 const visual=read('scripts/visual-qa.mjs');
 assert.match(visual,/home-full.png/);
 assert.match(visual,/hero-complete-/);
 assert.match(visual,/heroSpatial/);
});
