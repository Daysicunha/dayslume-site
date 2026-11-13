const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
test('cinematic hero puts commercial message and product interfaces on the first fold',()=>{
  const html=read('index.html');
  assert.match(html,/class="hero hero--cinematic hero--floating-panels"/);
  assert.match(html,/<div class="container hero-grid">[\s\S]*<div class="hero-content">[\s\S]*<h1 id="hero-title">Faça o digital/);
  assert.match(html,/class="hero-visual-composition cinema-stage"/);
  for(const element of ['cinema-browser','cinema-phone','cinema-service']) assert.match(html,new RegExp(element));
  assert.match(html,/href="#problemas"/);
  assert.match(html,/href="#projetos"/);
  assert.match(html,/aria-label="Painéis de interfaces digitais flutuantes/);
  assert.match(html,/VITRINI LOCAL · experiência ilustrativa/);
  assert.doesNotMatch(html,/data-flower-petal|data-scroll-hero|data-kiru-word|hero-kiru-keyword|data-hero-video/);
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
test('hero uses lightweight motion without pinning or hiding accessible actions',()=>{
  const css=read('assets/css/hero-cinematic.css');
  const motion=read('assets/js/hero-cinematic.js');
  const editorial=read('assets/js/hero-prism-scroll.js');
  assert.match(css,/\.hero\.hero--cinematic/);
  assert.match(css,/\.hero--cinematic \.hero-grid/);
  assert.match(css,/@media \(max-width: 560px\)/);
  assert.match(css,/prefers-reduced-motion: reduce/);
  assert.match(motion,/requestAnimationFrame/);
  assert.match(motion,/precise\.matches/);
  assert.match(motion,/reduced\.matches/);
  assert.match(editorial,/if \(cinematic \|\|/);
  assert.match(editorial,/function scrollCards\(/);
  assert.match(editorial,/function scrollProcess\(/);
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


test('hero layers three product stories, preserving the mineral palette and mobile readability',()=>{
  const html=read('index.html'),css=read('assets/css/hero-cinematic.css');
  assert.match(html,/cinema-stage-caption--vitrini/);
  assert.match(html,/cinema-stage-caption--engreni/);
  assert.match(html,/assets\/images\/logohorizontalbranca\.png/);
  assert.match(css,/background:\s*radial-gradient/);
  assert.match(css,/var\(--peach\)/);
  assert.match(css,/var\(--warm-ivory\)/);
  assert.match(css,/@media \(max-width: 360px\)/);
  assert.match(css,/\.cinema-phone-screen/);
  assert.match(css,/\.cinema-browser-screen/);
  assert.doesNotMatch(html,/hero__split-panel/);
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


test('section choreography remains available while old hero transition is disabled',()=>{
  const js=read('assets/js/hero-prism-scroll.js');
  const css=read('assets/css/hero-prism-scroll.css');
  assert.match(js,/const cinematic = hero\.classList\.contains\('hero--cinematic'\)/);
  assert.match(js,/if \(cinematic \|\|/);
  assert.match(js,/const scrollRange =/);
  assert.match(js,/const entry=scrollRange\(gridRect\.top,cues\)/);
  assert.match(js,/const progress=scrollRange\(rect\.top,cues\)/);
  assert.match(css,/\.home-page #modelo\[data-kiru-cards\]/);
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
 assert.match(html,/Conte o desafio\./);
 assert.match(html,/A solução vem depois\./);
 assert.match(html,/Contar o que está travando meu negócio/);
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
 assert.ok(palette.includes('order:-1;'));
 assert.ok(palette.includes('width:min(44vw,168px)'));
 assert.ok(palette.includes('margin:0 auto clamp(12px,2svh,18px)'));
 assert.ok(palette.includes('padding:clamp(94px,10svh,112px)'));
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

test('new cinematic hero styles load before the official palette',()=>{
 const html=read('index.html');
 const styles=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.ok(styles.includes('assets/css/hero-cinematic.css'));
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
 const css=read('assets/css/hero-cinematic.css');
 assert.match(css,/min-height: min\(850px, 94svh\)/);
 assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
});

test('cinematic product composition keeps every card in an independent grid cell', () => {
  const css = read('assets/css/hero-cinematic.css');
  const patch = css.split('/* FIX 2026-11-10')[1];
  assert.ok(patch, 'non-overlap patch must exist');
  assert.match(patch, /\.hero--cinematic \.cinema-cluster\s*\{[\s\S]*?display:\s*grid;/);
  assert.match(patch, /\.hero--cinematic \.cinema-browser\s*\{[\s\S]*?grid-column:\s*1;[\s\S]*?grid-row:\s*3;/);
  assert.match(patch, /\.hero--cinematic \.cinema-phone\s*\{[\s\S]*?grid-column:\s*2;[\s\S]*?grid-row:\s*3;/);
  assert.match(patch, /\.hero--cinematic \.cinema-service\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1;[\s\S]*?grid-row:\s*4;/);
  const mobile = patch.split('@media (max-width: 560px)')[1];
  assert.ok(mobile, 'mobile layout must exist');
  assert.match(mobile, /\.hero--cinematic \.cinema-browser\s*\{[\s\S]*?grid-row:\s*3;/);
  assert.match(mobile, /\.hero--cinematic \.cinema-phone\s*\{[\s\S]*?grid-row:\s*5;/);
  assert.match(mobile, /\.hero--cinematic \.cinema-service\s*\{[\s\S]*?grid-row:\s*6;/);
  assert.match(mobile, /grid-template-columns:\s*minmax\(0,\s*1fr\);/);
});

test('3D is restored on separated product cells without merging the QA cases and content', () => {
 const css=read('assets/css/hero-cinematic.css');
 const html=read('index.html');
 const tilt=css.split('/* DAYSLUME 3.2 — Perspectiva 3D aprovada')[1];
 assert.ok(tilt,'the approved 3D treatment exists');
 for(const element of ['cinema-browser','cinema-phone','cinema-service']){
   const declaration=tilt.split('.hero--cinematic .'+element+' {')[1];
   assert.ok(declaration,element+' missing 3D rule');
   assert.match(declaration.split('}')[0],/transform:\s*perspective\(/);
 }
 assert.match(css,/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
 assert.match(html,/assets\/css\/final-qa-20261014\.css/);
 assert.match(html,/assets\/js\/home-case-mockups\.js/);
 for(const name of ['case-tornearia-barbosa-1600x900.webp','case-new-rocket-play-1600x900.webp','case-engreni-agenda-1600x900.webp']){
   assert.match(html,new RegExp(name));
 }
 for(const name of ['content-design-process.svg','content-strategy-editorial.svg','content-technology-experience.svg']){
   assert.match(html,new RegExp(name));
 }
 const styles=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
});
