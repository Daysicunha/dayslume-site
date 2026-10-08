const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
test('scroll hero places original text left and six original petals right',()=>{
  const html=read('index.html');
  assert.match(html,/hero--interactive-flower hero--motion-lab hero--scroll-invasion/);
  assert.match(html,/data-scroll-hero/);
  assert.match(html,/<div class="container hero-grid">[\s\S]*<div class="hero-content">[\s\S]*<h1 id="hero-title">Faça o digital/);
  assert.match(html,/<div class="hero-visual-composition"/);
  assert.equal((html.match(/data-flower-petal\b/g)||[]).length,6);
  assert.match(html,/href="#problemas"/);
  assert.match(html,/href="#projetos"/);
  assert.doesNotMatch(html,/data-kiru-word|hero-kiru-keyword|data-hero-video/);
});
test('Kiru rolling cards are limited to the two commercial paths',()=>{
  const html=read('index.html');
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.match(html,/data-kiru-cards id="modelo"/);
  assert.equal((html.match(/data-kiru-card\b/g)||[]).length,2);
  assert.match(css,/\.home-page #modelo\[data-kiru-cards\]/);
  assert.match(js,/scrollCards/);
  assert.match(js,/kiru-cards-ready/);
});
test('pin and invasion use scroll progress, disable on small screens and reduced motion',()=>{
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.match(css,/\.hero--scroll-invasion\.hero-scroll-ready \.hero-scroll-stage/);
  assert.match(css,/position: sticky/);
  assert.match(css,/\.hero--scroll-invasion \.hero__spotlight/);
  assert.match(css,/\.hero--scroll-invasion \.flower-prism-glint/);
  assert.match(css,/max-width: 800px/);
  assert.match(css,/prefers-reduced-motion: reduce/);
  assert.match(js,/requestAnimationFrame/);
  assert.match(js,/invasion=range/);
  assert.match(js,/copy\.style\.opacity/);
  assert.match(js,/flower\.style\.transform/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/saveData/);
  assert.match(js,/\.inert/);
});


test('Kiru recording inspired motion uses three layered microcards and scroll-tied sweeps',()=>{
  const html=read('index.html');
  const css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.equal((html.match(/data-kiru-panel\b/g)||[]).length,3);
  assert.equal((html.match(/data-kiru-sweep\b/g)||[]).length,3);
  assert.equal((html.match(/data-kiru-card\b/g)||[]).length,2);
  assert.match(css,/\.kiru-motion-panels/);
  assert.match(css,/\.kiru-motion-panel__bars/);
  assert.match(js,/gridRect=cardGrid\.getBoundingClientRect/);
  assert.match(js,/panels\.forEach/);
  assert.match(js,/sweeps\.forEach/);
  assert.match(js,/Math\.min\(innerWidth\*\.33,390\)/);
});


test('Hero first fold pins from top, and colored right panel travels with flower',()=>{
 const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css'),js=read('assets/js/hero-prism-scroll.js');
 assert.match(html,/hero__split-panel/);
 assert.match(css,/\.hero\.hero--interactive-flower\.hero--motion-lab\.hero--scroll-invasion\s*\{\s*display:\s*block/);
 assert.match(css,/\.hero--scroll-invasion\.hero-scroll-ready \.hero-scroll-stage\s*\{\s*position:sticky;\s*top:0/);
 assert.match(css,/--hero-split-x/);
 assert.match(css,/#6B536D/);
 assert.match(css,/#66758F/);
 assert.match(js,/hero\.style\.setProperty\('--hero-split-x'/);
});
test('manifest title wraps only within left column, and the semicircle is disabled',()=>{
 const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css');
 assert.match(html,/manifest-title-line">Onde o digital/);
 assert.match(html,/manifest-title-line">está travando/);
 assert.match(html,/manifest-title-line">o seu negócio\?/);
 assert.match(css,/body\.home-page main > #problemas \.manifest-concept::after\s*\{\s*content:none;/);
 assert.match(css,/body\.home-page main > #problemas \.manifest-title \.manifest-title-line\s*\{[\s\S]*?white-space:normal;/);
});
test('section 05 scrolls its five cards individually without old reveal collisions',()=>{
 const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css'),js=read('assets/js/hero-prism-scroll.js');
 const homeJs=read('assets/js/home-premium.js');
 assert.match(html,/home-process-list" data-process-scroll/);
 assert.equal((html.match(/<li><span>0[1-5]<\/span>/g)||[]).length,5);
 assert.match(js,/function scrollProcess\(/);
 assert.match(js,/progress-i\*cues\.stagger/);
 assert.match(js,/processCards\.forEach/);
 assert.match(css,/\.process-scroll-ready li/);
 assert.match(homeJs,/home-process-list:not\(\[data-process-scroll\]\) li/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});


test('shared normalized choreography keeps hero panel/flower/text in sync',()=>{
 const js=read('assets/js/hero-prism-scroll.js');
 const css=read('assets/css/hero-prism-scroll.css');
 assert.match(js,/const MOTION_CUES = Object\.freeze/);
 assert.match(js,/flowerEnd:\.80/);
 assert.match(js,/panelEnd:\.78/);
 assert.match(js,/textEnd:\.76/);
 assert.match(js,/const scrollRange =/);
 assert.match(js,/const entry=scrollRange\(gridRect\.top,cues\)/);
 assert.match(js,/const progress=scrollRange\(rect\.top,cues\)/);
 assert.match(css,/height:185svh/);
});
test('all later sections use one-shot editorial reveal rather than competing observers',()=>{
 const js=read('assets/js/hero-prism-scroll.js');
 const css=read('assets/css/hero-prism-scroll.css');
 const home=read('assets/js/home-premium.js');
 for(const id of ['produtos','projetos','conteudos','sobre','contato']){
   assert.match(js,new RegExp("selector:'#"+id+"'"));
 }
 assert.match(js,/new IntersectionObserver/);
 assert.match(js,/editorialObserver\.unobserve\(entry\.target\)/);
 assert.match(js,/if\(changed\)setupEditorial\(\)/);
 assert.match(css,/motion-story-item\.is-in-view/);
 assert.match(css,/max-width:800px/);
 assert.doesNotMatch(home,/reveal\('\.launch-products \.solution-card'/);
 assert.doesNotMatch(home,/reveal\('\.content-masthead/);
 assert.doesNotMatch(home,/querySelectorAll\('\.project-card'\)/);
});
