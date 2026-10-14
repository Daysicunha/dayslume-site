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


test('section 02 keeps the two real service cards without floating data graphics',()=>{
  const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css');
  const js=read('assets/js/hero-prism-scroll.js');
  assert.equal((html.match(/data-kiru-card\b/g)||[]).length,2);
  assert.doesNotMatch(html,/kiru-motion-panels|kiru-motion-sweeps|data-kiru-panel|data-kiru-sweep/);
  assert.doesNotMatch(css,/kiru-motion-panel__bars|kiru-motion-panels|kiru-motion-sweeps/);
  assert.doesNotMatch(js,/\bpanels\.forEach|\bsweeps\.forEach/);
  assert.match(js,/scrollCards/);
});


test('Hero first fold pins from top, and colored right panel travels with flower',()=>{
 const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css'),js=read('assets/js/hero-prism-scroll.js');
 assert.match(html,/hero__split-panel/);
 assert.match(css,/\.hero\.hero--interactive-flower\.hero--motion-lab\.hero--scroll-invasion\s*\{\s*display:\s*block/);
 assert.match(css,/\.hero--scroll-invasion\.hero-scroll-ready \.hero-scroll-stage\s*\{\s*position:sticky;\s*top:0/);
 assert.match(css,/--hero-split-x/);
 assert.match(css,/#6B536D/);
 assert.match(css,/#485168/);
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
 assert.match(js,/flowerEnd:\.93/);
 assert.match(js,/panelEnd:\.92/);
 assert.match(js,/textEnd:\.95/);
 assert.match(js,/const scrollRange =/);
 assert.match(js,/const entry=scrollRange\(gridRect\.top,cues\)/);
 assert.match(js,/const progress=scrollRange\(rect\.top,cues\)/);
 assert.match(css,/height:168svh/);
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


test('new mineral hero gradient and concise case stories keep brand identity',()=>{
 const html=read('index.html'),css=read('assets/css/hero-prism-scroll.css');
 const palette=read('assets/css/brand-palette.css');
 assert.match(css,/#2C3448 0%,#485168 48%,#6B536D 100%/);
 assert.match(html,/Site próprio que reúne especialidades/);
 assert.match(html,/Landing page com hierarquia visual/);
 assert.match(html,/Página autoral com fluxo de atendimento conectado ao ENGRENI Agenda/);
 assert.match(palette,/main > #projetos \.projects-grid\.projects-grid--launch \.case-story/);
 assert.match(palette,/main > #projetos \.projects-grid\.projects-grid--launch \.project-card-head\s*\{\s*min-height:0;/);
});
test('section 08 has readable, wrapping copy and isolated two-column layout',()=>{
 const html=read('index.html'),palette=read('assets/css/brand-palette.css');
 assert.match(html,/O que precisa funcionar/);
 assert.match(html,/melhor no digital\?/);
 assert.match(html,/Conte o que está travando seu negócio/);
 assert.match(palette,/main > #contato #contact-title > span\s*\{[\s\S]*?white-space:normal/);
 assert.match(palette,/main > #contato \.contact-grid > div:first-child/);
 assert.match(html,/<form class="contact-form" id="contact-form"/);
});

test('shorter hero never enters a prolonged empty pinned frame',()=>{
 const css=read('assets/css/hero-prism-scroll.css'), js=read('assets/js/hero-prism-scroll.js');
 assert.equal((css.match(/height:168svh/g)||[]).length,1);
 assert.doesNotMatch(css,/height:\s*(185|195|215)svh/);
 assert.match(js,/textStart:\.32, textEnd:\.95/);
});

test('mobile hero puts a compact flower above readable copy and CTAs',()=>{
 const palette=read('assets/css/brand-palette.css');
 const js=read('assets/js/hero-prism-scroll.js');
 const html=read('index.html');
 assert.match(js,/function allowMobileHero\(\) \{[\s\S]*?return false;/);
 assert.match(palette,/Mobile flower-first layout/);
 assert.match(palette,/body\\.home-page \\.hero--scroll-invasion:not\\(\\.hero-mobile-scroll-ready\\) \\.hero-visual-composition\\s*\\{[\\s\\S]*?order:-1;/);
 assert.match(palette,/width:min\\(48vw,190px\\)/);
 assert.match(palette,/margin:0 auto clamp\\(14px,3svh,23px\\)/);
 assert.match(palette,/padding:clamp\\(121px,14svh,144px\\)/);
 assert.match(palette,/body\.home-page \.hero--scroll-invasion \.hero-content\s*\{[\s\S]*?opacity:1!important/);
 assert.match(palette,/body\.home-page \.hero--scroll-invasion:not\(\.hero-mobile-scroll-ready\) \.hero-visual-composition\s*\{[\s\S]*?display:block!important/);
 assert.match(palette,/body\.home-page \.hero--scroll-invasion \.hero-scroll-stage\s*\{[\s\S]*?height:auto/);
 assert.match(palette,/body\.home-page \.hero--scroll-invasion \.hero-actions\s*\{[\s\S]*?justify-content:center/);
 assert.match(palette,/body\.home-page \.hero--scroll-invasion \.hero-scroll-hint,/);
 assert.match(html,/href="#problemas"/);
 assert.match(html,/href="#projetos"/);
});

test('compact-height/reduced-motion/save-data users have an accessible static hero',()=>{
 const css=read('assets/css/hero-prism-scroll.css');
 const js=read('assets/js/hero-prism-scroll.js');
 assert.match(read('assets/css/brand-palette.css'),/\.hero--scroll-invasion:not\(\.hero-mobile-scroll-ready\) \.hero-visual-composition\s*\{[\s\S]*?display:block!important/);
 assert.match(js,/!reduced\.matches && !saveData/);
 assert.match(css,/max-height:699px/);
 assert.match(css,/prefers-reduced-motion:no-preference/);
 assert.match(js,/copy\.inert=false/);
 assert.match(js,/copy\.inert=!\(fade<\.76 \|\| copyFocused\)/);
});
